const cron = require('node-cron');
const recurringTransactionService = require('../services/recurringTransactionService');

class RecurringTransactionJob {
  
  constructor() {
    this.isRunning = false;
    this.lastRun = null;
    this.nextRun = null;
  }
  
  // Initialize the cron job
  init() {
    console.log('🕐 Initializing recurring transaction cron job...');
    
    // Run daily at 6:00 AM to generate due recurring transactions
    this.job = cron.schedule('0 6 * * *', async () => {
      await this.executeJob();
    }, {
      scheduled: false, // Don't start immediately
      timezone: 'Asia/Colombo' // Sri Lanka timezone
    });
    
    // Also run every hour during business hours (8 AM - 6 PM) for more frequent checks
    this.hourlyJob = cron.schedule('0 8-18 * * *', async () => {
      await this.executeJob();
    }, {
      scheduled: false,
      timezone: 'Asia/Colombo'
    });
    
    console.log('✅ Recurring transaction cron jobs initialized');
  }
  
  // Start the cron jobs
  start() {
    if (this.job && this.hourlyJob) {
      this.job.start();
      this.hourlyJob.start();
      console.log('🚀 Recurring transaction cron jobs started');
      
      // Calculate next run time
      this.updateNextRunTime();
    } else {
      console.error('❌ Cron jobs not initialized. Call init() first.');
    }
  }
  
  // Stop the cron jobs
  stop() {
    if (this.job && this.hourlyJob) {
      this.job.stop();
      this.hourlyJob.stop();
      console.log('⏹️ Recurring transaction cron jobs stopped');
    }
  }
  
  // Execute the recurring transaction generation
  async executeJob() {
    if (this.isRunning) {
      console.log('⏳ Recurring transaction job already running, skipping...');
      return;
    }
    
    try {
      this.isRunning = true;
      this.lastRun = new Date();
      
      console.log(`🔄 Starting recurring transaction job at ${this.lastRun.toISOString()}`);
      
      const result = await recurringTransactionService.generateRecurringTransactions();
      
      if (result.success) {
        console.log(`✅ Recurring transaction job completed successfully`);
        console.log(`📊 Generated ${result.generatedCount} transactions`);
        
        if (result.results && result.results.length > 0) {
          console.log('📋 Generation results:');
          result.results.forEach((item, index) => {
            if (item.error) {
              console.log(`   ${index + 1}. ❌ Error for ${item.parentId}: ${item.error}`);
            } else {
              console.log(`   ${index + 1}. ✅ ${item.description} - LKR ${item.amount} (Next: ${item.nextDueDate})`);
            }
          });
        }
      } else {
        console.error(`❌ Recurring transaction job failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('❌ Error in recurring transaction job:', error);
    } finally {
      this.isRunning = false;
      this.updateNextRunTime();
    }
  }
  
  // Manual trigger for testing
  async triggerManually() {
    console.log('🔧 Manually triggering recurring transaction job...');
    await this.executeJob();
  }
  
  // Update next run time calculation
  updateNextRunTime() {
    const now = new Date();
    const tomorrow6AM = new Date(now);
    tomorrow6AM.setDate(tomorrow6AM.getDate() + 1);
    tomorrow6AM.setHours(6, 0, 0, 0);
    
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    
    // Choose the earlier of the two
    this.nextRun = nextHour < tomorrow6AM && nextHour.getHours() >= 8 && nextHour.getHours() <= 18 
      ? nextHour 
      : tomorrow6AM;
  }
  
  // Get job status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.nextRun,
      dailyJobActive: this.job ? this.job.running : false,
      hourlyJobActive: this.hourlyJob ? this.hourlyJob.running : false
    };
  }
  
  // Destroy the cron jobs
  destroy() {
    if (this.job) {
      this.job.destroy();
    }
    if (this.hourlyJob) {
      this.hourlyJob.destroy();
    }
    console.log('🗑️ Recurring transaction cron jobs destroyed');
  }
}

// Create singleton instance
const recurringTransactionJob = new RecurringTransactionJob();

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM received, stopping recurring transaction jobs...');
  recurringTransactionJob.stop();
});

process.on('SIGINT', () => {
  console.log('📡 SIGINT received, stopping recurring transaction jobs...');
  recurringTransactionJob.stop();
});

module.exports = recurringTransactionJob;
