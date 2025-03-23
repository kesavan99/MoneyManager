import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { LocalStorage, Transaction } from '../utils/LocalStorage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const typeColors = {
  Expense: '#FF6B6B',
  Borrow: '#FFA726',
  Transfer: '#2196F3',
  Savings: '#4CAF50',
};

const TransactionCharts = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await LocalStorage.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const getLast7DaysData = (type: 'Expense' | 'Borrow' | 'Transfer' | 'Savings') => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const data = last7Days.map(date => {
      const dayTransactions = transactions.filter(t => 
        t.Timestamp.split('T')[0] === date && t.Type === type
      );
      return dayTransactions.reduce((sum, t) => sum + t.Amount, 0);
    });

    const weekdayLabels = last7Days.map(date => {
      const day = new Date(date).getDay();
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return weekdays[day];
    });

    return {
      labels: weekdayLabels,
      datasets: [{
        data,
        color: () => typeColors[type],
        strokeWidth: 2,
      }],
    };
  };

  const renderChart = (data: any, title: string, type: 'Expense' | 'Borrow' | 'Transfer' | 'Savings') => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <BarChart
        data={data}
        width={screenWidth * 0.92}
        height={screenHeight * 0.25}
        chartConfig={{
          ...chartConfig,
          color: () => typeColors[type],
        }}
        style={styles.chart}
        showBarTops={false}
        fromZero
        yAxisLabel="₹"
        yAxisSuffix=""
        withInnerLines={true}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        segments={4}
        withCustomBarColorFromData={true}
        showValuesOnTopOfBars={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderChart(getLast7DaysData('Expense'), 'Last 7 Days - Expenses', 'Expense')}
      {renderChart(getLast7DaysData('Borrow'), 'Last 7 Days - Borrowings', 'Borrow')}
      {renderChart(getLast7DaysData('Transfer'), 'Last 7 Days - Transfers', 'Transfer')}
      {renderChart(getLast7DaysData('Savings'), 'Last 7 Days - Savings', 'Savings')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: '2%',
    paddingLeft: '2%',
  },
  chartContainer: {
    marginBottom: '3%',
    padding: '2%',
    paddingBottom: '6%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: screenHeight * 0.022,
    fontWeight: 'bold',
    marginBottom: '2%',
    color: '#2c3e50',
    paddingLeft: '1%',
  },
  chart: {
    marginVertical: '1%',
    borderRadius: 16,
    paddingLeft: 0,
  },
});

export default TransactionCharts; 