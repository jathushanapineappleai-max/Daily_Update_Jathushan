const Transaction = require('../models/Transaction');
const notificationService = require('./notificationService');

class RecurringTransactionService {
  
  // Generate recurring transactions based on schedule
  async generateRecurringTransactions() {
    try {
      console.log('🔄 Starting recurring transaction generation...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find all active recurring transactions that are due
      const dueRecurringTransactions = await Transaction.find({
        'recurringTransaction.isRecurring': true,
        'recurringTransaction.isActive': true,
        'recurringTransaction.autoGenerate': true,
        'recurringTransaction.nextDueDate': { $lte: today }
      }).populate('createdBy', 'firstName lastName email');
      
      console.log(`📋 Found ${dueRecurringTransactions.length} due recurring transactions`);
      
      let generatedCount = 0;
      const results = [];
      
      for (const recurringTransaction of dueRecurringTransactions) {
        try {
          // Check if we've reached max generations
          if (recurringTransaction.recurringTransaction.maxGenerations && 
              recurringTransaction.recurringTransaction.generatedCount >= recurringTransaction.recurringTransaction.maxGenerations) {
            console.log(`⏹️ Stopping recurring transaction ${recurringTransaction._id} - max generations reached`);
            await recurringTransaction.stopRecurring();
            continue;
          }
          
          // Check if end date has passed
          if (recurringTransaction.recurringTransaction.endDate && 
              today > recurringTransaction.recurringTransaction.endDate) {
            console.log(`⏹️ Stopping recurring transaction ${recurringTransaction._id} - end date reached`);
            await recurringTransaction.stopRecurring();
            continue;
          }
          
          // Generate new transaction data
          const newTransactionData = recurringTransaction.generateNextRecurring();
          
          if (newTransactionData) {
            // Create the new transaction
            const newTransaction = new Transaction(newTransactionData);
            await newTransaction.save();
            
            // Update the parent recurring transaction
            recurringTransaction.recurringTransaction.generatedCount += 1;
            
            // Calculate next due date
            const nextDate = new Date(recurringTransaction.recurringTransaction.nextDueDate);
            const frequency = recurringTransaction.recurringTransaction.frequency;
            
            switch (frequency) {
              case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
              case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
              case 'quarterly':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
              case 'semi_annual':
                nextDate.setMonth(nextDate.getMonth() + 6);
                break;
              case 'annual':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            }
            
            recurringTransaction.recurringTransaction.nextDueDate = nextDate;
            await recurringTransaction.save();
            
            generatedCount++;
            results.push({
              parentId: recurringTransaction._id,
              newTransactionId: newTransaction._id,
              description: newTransaction.description,
              amount: newTransaction.amount,
              nextDueDate: nextDate
            });
            
            console.log(`✅ Generated transaction: ${newTransaction.description} - LKR ${newTransaction.amount}`);
            
            // Send notification for high-value transactions
            if (newTransaction.amount > 50000) {
              await this.notifyHighValueTransaction(newTransaction);
            }
            
          }
        } catch (error) {
          console.error(`❌ Error generating transaction for ${recurringTransaction._id}:`, error);
          results.push({
            parentId: recurringTransaction._id,
            error: error.message
          });
        }
      }
      
      console.log(`🎉 Generated ${generatedCount} recurring transactions`);
      
      return {
        success: true,
        generatedCount,
        results
      };
      
    } catch (error) {
      console.error('❌ Error in generateRecurringTransactions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Setup new recurring transaction
  async createRecurringTransaction(transactionData) {
    try {
      // Validate recurring data
      if (!transactionData.recurringTransaction || !transactionData.recurringTransaction.frequency) {
        throw new Error('Recurring transaction data is required');
      }
      
      // Clean vendor field if it's empty
      if (transactionData.vendor === '' || (transactionData.vendor && transactionData.vendor.trim() === '')) {
        transactionData.vendor = undefined;
      }

      // Auto-approve recurring transactions (they are pre-authorized)
      if (!transactionData.status) {
        transactionData.status = 'approved';
      }

      // Set classification based on type and recurring nature
      if (!transactionData.transactionClassification) {
        if (transactionData.type === 'income') {
          transactionData.transactionClassification = 'recurring_income';
        } else {
          transactionData.transactionClassification = 'recurring_expense';
        }
      }
      
      // Set recurring fields
      transactionData.recurringTransaction.isRecurring = true;
      
      // Set next due date if not provided
      if (!transactionData.recurringTransaction.nextDueDate) {
        const nextDate = new Date(transactionData.date);
        const frequency = transactionData.recurringTransaction.frequency;
        
        switch (frequency) {
          case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case 'quarterly':
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
          case 'semi_annual':
            nextDate.setMonth(nextDate.getMonth() + 6);
            break;
          case 'annual':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        }
        
        transactionData.recurringTransaction.nextDueDate = nextDate;
      }
      
      // Create the parent transaction
      const transaction = new Transaction(transactionData);
      await transaction.save();
      
      console.log(`✅ Created recurring transaction: ${transaction.description}`);
      
      return transaction;
      
    } catch (error) {
      console.error('❌ Error creating recurring transaction:', error);
      throw error;
    }
  }
  
  // Stop recurring transaction
  async stopRecurringTransaction(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      if (!transaction.recurringTransaction.isRecurring) {
        throw new Error('Transaction is not a recurring transaction');
      }
      
      await transaction.stopRecurring();
      
      console.log(`⏹️ Stopped recurring transaction: ${transaction.description}`);
      
      return transaction;
      
    } catch (error) {
      console.error('❌ Error stopping recurring transaction:', error);
      throw error;
    }
  }
  
  // Get all active recurring transactions
  async getActiveRecurringTransactions() {
    try {
      const recurringTransactions = await Transaction.find({
        'recurringTransaction.isRecurring': true,
        'recurringTransaction.isActive': true
      })
      .populate('createdBy', 'firstName lastName role')
      .populate('vendor', 'companyName')
      .populate('resident', 'firstName lastName unitNumber')
      .sort({ 'recurringTransaction.nextDueDate': 1 });
      
      return recurringTransactions;
      
    } catch (error) {
      console.error('❌ Error fetching recurring transactions:', error);
      throw error;
    }
  }
  
  // Notify about high-value transactions
  async notifyHighValueTransaction(transaction) {
    try {
      if (notificationService && notificationService.sendRoleBasedNotification) {
        await notificationService.sendRoleBasedNotification(
          ['treasurer', 'president', 'administrator'],
          {
            type: 'high_value_transaction',
            title: 'High Value Transaction Generated',
            message: `Auto-generated transaction: ${transaction.description} - LKR ${transaction.amount.toLocaleString()}`,
            data: {
              transactionId: transaction._id,
              amount: transaction.amount,
              type: transaction.type,
              classification: transaction.transactionClassification
            }
          }
        );
      }
    } catch (error) {
      console.error('❌ Error sending high-value transaction notification:', error);
    }
  }
}

module.exports = new RecurringTransactionService();
