import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  ID: number;
  Type: string;
  Amount: number;
  Description: string;
  Date: string;
  Timestamp: string;
  Timezone: string;
}

const STORAGE_KEY = '@transactions';

export const LocalStorage = {
  // Store a new transaction
  storeTransaction: async (transaction: Omit<Transaction, 'ID'>): Promise<Transaction> => {
    try {
      const transactions = await LocalStorage.getTransactions() || [];
      const newTransaction: Transaction = {
        ...transaction,
        ID: Date.now(),
      };
      transactions.push(newTransaction);
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      return newTransaction;
    } catch (error) {
      console.error('Error storing transaction:', error);
      throw error;
    }
  },

  // Get all transactions
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = data ? JSON.parse(data) : [];
      return transactions;
    } catch (error) {
      throw error;
    }
  },

  // Delete a transaction by ID
  deleteTransaction: async (transaction: Transaction): Promise<void> => {
    if (!transaction || !transaction.Timestamp) {
      throw new Error('Invalid transaction');
    }
    try {
      const transactions = await LocalStorage.getTransactions();
      const updatedTransactions = transactions.filter(
        (t: Transaction) => t.Timestamp !== transaction.Timestamp
      );
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Clear all transactions
  clearTransactions: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      throw error;
    }
  },

  storeTransactions: async (transactions: Transaction[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error storing transactions:', error);
      throw error;
    }
  },
}; 