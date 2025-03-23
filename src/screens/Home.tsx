import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TransactionCharts from '../components/TransactionCharts';
import { LocalStorage, Transaction } from '../utils/LocalStorage';

const Home = ({ navigation }: { navigation: any }) => {
  const [balance, setBalance] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const calculateBalance = async () => {
    try {
      const transactions = await LocalStorage.getTransactions();
      
      const totalSavings = transactions
        .filter(t => t.Type === 'Savings')
        .reduce((sum, t) => sum + t.Amount, 0);

      const totalExpense = transactions
        .filter(t => t.Type === 'Expense')
        .reduce((sum, t) => sum + t.Amount, 0);

      const totalTransfer = transactions
        .filter(t => t.Type === 'Transfer')
        .reduce((sum, t) => sum + t.Amount, 0);

      const totalBorrow = transactions
        .filter(t => t.Type === 'Borrow')
        .reduce((sum, t) => sum + t.Amount, 0);

      const currentBalance = (totalSavings + totalBorrow) - (totalExpense + totalTransfer);
      setBalance(currentBalance);
    } catch (error) {
      console.error('Error calculating balance:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      calculateBalance();
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance:</Text>
        <Text style={[
          styles.balanceAmount,
          { color: balance >= 0 ? '#4CAF50' : '#FF6B6B' }
        ]}>
          ₹{balance.toFixed(2)}
        </Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Savings Tracker</Text>
          <TransactionCharts key={refreshKey} />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Add New Transaction" onPress={() => navigation.navigate('AddTransaction')} />
        <View style={styles.buttonSpacing} />
        <Button title="View Transactions" onPress={() => navigation.navigate('TransactionList')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 8,
    textAlign: 'center',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buttonSpacing: {
    height: 12,
  },
});

export default Home;
