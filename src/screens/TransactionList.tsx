import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, Alert, TouchableOpacity } from 'react-native';
import { LocalStorage, Transaction } from '../utils/LocalStorage';
import TransactionCard from '../components/TransactionCard';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type TransactionType = 'All' | 'Savings' | 'Expense' | 'Transfer' | 'Borrow';

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>('All');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, startDate, endDate, selectedType]);

  const loadTransactions = async () => {
    try {
      const data = await LocalStorage.getTransactions();
      setTransactions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(transaction => transaction.Type === selectedType);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.Timestamp);
        return transactionDate >= startDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.Timestamp);
        return transactionDate <= endDate;
      });
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = async (transaction: Transaction) => {
    try {
      await LocalStorage.deleteTransaction(transaction);
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t.Timestamp !== transaction.Timestamp)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const FilterButton = ({ type, label }: { type: TransactionType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedType === type && styles.filterButtonActive
      ]}
      onPress={() => setSelectedType(type)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedType === type && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.dateFilterContainer}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              From: {formatDate(startDate)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              To: {formatDate(endDate)}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.typeFilterContainer}
        >
          <FilterButton type="All" label="All" />
          <FilterButton type="Savings" label="Savings" />
          <FilterButton type="Expense" label="Expense" />
          <FilterButton type="Transfer" label="Transfer" />
          <FilterButton type="Borrow" label="Borrow" />
        </ScrollView>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transactions found</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredTransactions.map((transaction) => (
            <TransactionCard 
              key={transaction.Timestamp} 
              transaction={transaction} 
              onDelete={handleDelete}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  typeFilterContainer: {
    padding: 12,
    flexDirection: 'row',
    gap: 8,
  },
  dateButton: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#2c3e50',
    fontSize: 14,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '800',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  }
});

export default TransactionList; 