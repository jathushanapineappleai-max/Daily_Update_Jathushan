#!/bin/bash

# SpanTower27 Daily Maintenance Script
# This script ensures both databases stay synchronized and login issues are prevented

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging
LOG_FILE="/var/www/SpanTower27/logs/maintenance.log"
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_success() {
    log "${GREEN}✅ $1${NC}"
}

log_warning() {
    log "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    log "${RED}❌ $1${NC}"
}

log_info() {
    log "${BLUE}ℹ️  $1${NC}"
}

# Function to check and fix user passwords
fix_user_passwords() {
    log_info "Checking and fixing user passwords in both databases..."
    
    cd /var/www/SpanTower27/backend
    if node setup-dual-databases.js >> "$LOG_FILE" 2>&1; then
        log_success "User passwords synchronized successfully"
    else
        log_error "Failed to synchronize user passwords"
        return 1
    fi
}

# Function to check service health
check_service_health() {
    log_info "Checking service health..."
    
    # Check production server
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:5001/api/auth/me" | grep -q "401\|200"; then
        log_success "Production server (port 5001) is responding"
    else
        log_error "Production server (port 5001) is not responding properly"
        return 1
    fi
    
    # Check development server
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/auth/me" | grep -q "401\|200"; then
        log_success "Development server (port 5000) is responding"
    else
        log_error "Development server (port 5000) is not responding properly"
        return 1
    fi
}

# Function to restart services if needed
restart_services_if_needed() {
    log_info "Checking if services need restart..."
    
    cd /var/www/SpanTower27/backend
    if ! ../manage-spantower27-services.sh status | grep -q "RUNNING.*RUNNING"; then
        log_warning "One or more services are down, restarting..."
        if ../manage-spantower27-services.sh restart >> "$LOG_FILE" 2>&1; then
            log_success "Services restarted successfully"
        else
            log_error "Failed to restart services"
            return 1
        fi
    else
        log_success "All services are running properly"
    fi
}

# Function to clean up old logs
cleanup_logs() {
    log_info "Cleaning up old log files..."
    
    # Keep only last 30 days of logs
    find /var/www/SpanTower27/logs -name "*.log" -mtime +30 -delete 2>/dev/null
    find /var/www/SpanTower27-Dev/backend/logs -name "*.log" -mtime +30 -delete 2>/dev/null
    
    log_success "Log cleanup completed"
}

# Function to backup databases
backup_databases() {
    log_info "Creating database backups..."
    
    BACKUP_DIR="/var/www/SpanTower27/backups/$(date +%Y%m%d)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup production database
    if mongodump --uri="mongodb://admin:SecurePassword123!@localhost:27017/spantower27_prod?authSource=admin" --out="$BACKUP_DIR/prod" >> "$LOG_FILE" 2>&1; then
        log_success "Production database backed up"
    else
        log_error "Failed to backup production database"
    fi
    
    # Backup development database
    if mongodump --uri="mongodb://admin:SecurePassword123!@localhost:27017/spantower27_dev?authSource=admin" --out="$BACKUP_DIR/dev" >> "$LOG_FILE" 2>&1; then
        log_success "Development database backed up"
    else
        log_error "Failed to backup development database"
    fi
    
    # Keep only last 7 days of backups
    find /var/www/SpanTower27/backups -type d -mtime +7 -exec rm -rf {} + 2>/dev/null
}

# Function to test login functionality
test_login_functionality() {
    log_info "Testing login functionality on both services..."
    
    # Test production login
    cd /var/www/SpanTower27/backend
    if node debug-login.js >> "$LOG_FILE" 2>&1; then
        log_success "Production login test passed"
    else
        log_error "Production login test failed"
        return 1
    fi
    
    # Test development login
    cd /var/www/SpanTower27-Dev/backend
    if node debug-login.js >> "$LOG_FILE" 2>&1; then
        log_success "Development login test passed"
    else
        log_error "Development login test failed"
        return 1
    fi
}

# Function to send status report
send_status_report() {
    local status=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Create status report
    cat > /tmp/maintenance_report.txt << EOF
SpanTower27 Daily Maintenance Report
====================================
Date: $timestamp
Status: $status

Services Status:
$(cd /var/www/SpanTower27/backend && ../manage-spantower27-services.sh status)

Recent Log Entries:
$(tail -20 "$LOG_FILE")
EOF
    
    log_info "Maintenance report generated at /tmp/maintenance_report.txt"
}

# Main maintenance routine
main() {
    log_info "Starting SpanTower27 daily maintenance..."
    
    local overall_status="SUCCESS"
    
    # Run maintenance tasks
    if ! fix_user_passwords; then
        overall_status="PARTIAL_FAILURE"
    fi
    
    if ! restart_services_if_needed; then
        overall_status="FAILURE"
    fi
    
    if ! check_service_health; then
        overall_status="FAILURE"
    fi
    
    if ! test_login_functionality; then
        overall_status="FAILURE"
    fi
    
    cleanup_logs
    backup_databases
    
    # Generate status report
    send_status_report "$overall_status"
    
    if [ "$overall_status" = "SUCCESS" ]; then
        log_success "Daily maintenance completed successfully"
        exit 0
    elif [ "$overall_status" = "PARTIAL_FAILURE" ]; then
        log_warning "Daily maintenance completed with some issues"
        exit 1
    else
        log_error "Daily maintenance failed"
        exit 2
    fi
}

# Run main function
main "$@"
