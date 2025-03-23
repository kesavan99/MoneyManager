import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { Transaction } from '../utils/LocalStorage';

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(transaction),
        },
      ]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Expense':
        return '#FF6B6B';
      case 'Budget':
        return '#4CAF50';
      case 'Transfer':
        return '#2196F3';
      case 'Borrow':
        return '#FFA726';
      default:
        return '#757575';
    }
  };

  const formatTimestamp = (timestamp: string, timezone: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(transaction.Type) }]}>
            <Text style={styles.typeText}>{transaction.Type}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.timestamp}>
              {formatTimestamp(transaction.Timestamp, transaction.Timezone)}
            </Text>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.amountText}>${transaction.Amount.toFixed(2)}</Text>
          <Text style={styles.descriptionText}>{transaction.Description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 12,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  cardContent: {
    gap: 8,
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  descriptionText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    paddingRight: 20,
  },
});

export default TransactionCard; 