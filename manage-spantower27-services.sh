#!/bin/bash

# SpanTower27 Services Management Script
# This script manages both Production and Development servers

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service configurations
PROD_DIR="/var/www/SpanTower27/backend"
DEV_DIR="/var/www/SpanTower27-Dev/backend"
PROD_PORT=5001
DEV_PORT=5000

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to get process ID on a port
get_pid_on_port() {
    local port=$1
    lsof -Pi :$port -sTCP:LISTEN -t 2>/dev/null
}

# Function to start production server
start_production() {
    print_status "Starting Production Server (Port $PROD_PORT)..."
    
    if check_port $PROD_PORT; then
        print_warning "Production server already running on port $PROD_PORT"
        return 0
    fi
    
    cd "$PROD_DIR" || {
        print_error "Cannot access production directory: $PROD_DIR"
        return 1
    }
    
    # Start production server in background
    nohup node server.js > ../logs/production.log 2>&1 &
    local pid=$!
    
    # Wait a moment and check if it started successfully
    sleep 3
    if check_port $PROD_PORT; then
        print_success "Production server started successfully (PID: $pid, Port: $PROD_PORT)"
        echo $pid > ../logs/production.pid
        return 0
    else
        print_error "Failed to start production server"
        return 1
    fi
}

# Function to start development server
start_development() {
    print_status "Starting Development Server (Port $DEV_PORT)..."
    
    if check_port $DEV_PORT; then
        print_warning "Development server already running on port $DEV_PORT"
        return 0
    fi
    
    cd "$DEV_DIR" || {
        print_error "Cannot access development directory: $DEV_DIR"
        return 1
    }
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    # Start development server in background
    nohup node server.js > logs/development.log 2>&1 &
    local pid=$!
    
    # Wait a moment and check if it started successfully
    sleep 3
    if check_port $DEV_PORT; then
        print_success "Development server started successfully (PID: $pid, Port: $DEV_PORT)"
        echo $pid > logs/development.pid
        return 0
    else
        print_error "Failed to start development server"
        return 1
    fi
}

# Function to stop a service by port
stop_service() {
    local port=$1
    local name=$2
    
    if check_port $port; then
        local pid=$(get_pid_on_port $port)
        print_status "Stopping $name server (PID: $pid, Port: $port)..."
        kill $pid 2>/dev/null
        sleep 2
        
        if check_port $port; then
            print_warning "Graceful shutdown failed, forcing kill..."
            kill -9 $pid 2>/dev/null
            sleep 1
        fi
        
        if ! check_port $port; then
            print_success "$name server stopped successfully"
        else
            print_error "Failed to stop $name server"
            return 1
        fi
    else
        print_warning "$name server is not running"
    fi
}

# Function to show status
show_status() {
    print_status "SpanTower27 Services Status:"
    echo
    
    # Production status
    if check_port $PROD_PORT; then
        local prod_pid=$(get_pid_on_port $PROD_PORT)
        print_success "Production Server: RUNNING (PID: $prod_pid, Port: $PROD_PORT)"
        echo "  📍 URL: https://www.spantower27.org"
        echo "  📁 Directory: $PROD_DIR"
    else
        print_error "Production Server: STOPPED"
    fi
    
    echo
    
    # Development status
    if check_port $DEV_PORT; then
        local dev_pid=$(get_pid_on_port $DEV_PORT)
        print_success "Development Server: RUNNING (PID: $dev_pid, Port: $DEV_PORT)"
        echo "  📍 URL: https://dev.spantower27.org"
        echo "  📁 Directory: $DEV_DIR"
    else
        print_error "Development Server: STOPPED"
    fi
    
    echo
}

# Function to restart services
restart_services() {
    print_status "Restarting SpanTower27 Services..."
    
    # Stop services
    stop_service $PROD_PORT "Production"
    stop_service $DEV_PORT "Development"
    
    sleep 2
    
    # Start services
    start_production
    start_development
    
    echo
    show_status
}

# Function to test login on both services
test_login() {
    print_status "Testing login functionality on both services..."
    
    # Test production
    if check_port $PROD_PORT; then
        print_status "Testing production login..."
        cd "$PROD_DIR" && node debug-login.js
    else
        print_error "Production server is not running"
    fi
    
    echo
    
    # Test development
    if check_port $DEV_PORT; then
        print_status "Testing development login..."
        cd "$DEV_DIR" && node debug-login.js 2>/dev/null || {
            print_warning "Debug script not found in dev, copying from production..."
            cp "$PROD_DIR/debug-login.js" "$DEV_DIR/"
            cd "$DEV_DIR" && node debug-login.js
        }
    else
        print_error "Development server is not running"
    fi
}

# Main script logic
case "$1" in
    start)
        print_status "Starting all SpanTower27 services..."
        start_production
        start_development
        echo
        show_status
        ;;
    stop)
        print_status "Stopping all SpanTower27 services..."
        stop_service $PROD_PORT "Production"
        stop_service $DEV_PORT "Development"
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    test-login)
        test_login
        ;;
    prod-start)
        start_production
        ;;
    dev-start)
        start_development
        ;;
    prod-stop)
        stop_service $PROD_PORT "Production"
        ;;
    dev-stop)
        stop_service $DEV_PORT "Development"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|test-login|prod-start|dev-start|prod-stop|dev-stop}"
        echo
        echo "Commands:"
        echo "  start       - Start both production and development servers"
        echo "  stop        - Stop both servers"
        echo "  restart     - Restart both servers"
        echo "  status      - Show status of both servers"
        echo "  test-login  - Test login functionality on both servers"
        echo "  prod-start  - Start only production server"
        echo "  dev-start   - Start only development server"
        echo "  prod-stop   - Stop only production server"
        echo "  dev-stop    - Stop only development server"
        exit 1
        ;;
esac
