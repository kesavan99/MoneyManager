import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { LocalStorage } from '../utils/LocalStorage';

type TransactionType = 'Expense' | 'Savings' | 'Transfer' | 'Borrow';

const AddTransaction = () => {
  const [type, setType] = useState<TransactionType>('Expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const transactionTypes: TransactionType[] = ['Expense', 'Savings', 'Transfer', 'Borrow'];

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (!amount || !description) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Get current date and time
      const now = new Date();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timestamp = now.toISOString();

      // Create new transaction
      const newTransaction = {
        Type: type,
        Amount: parseFloat(amount),
        Description: description,
        Date: now.toISOString().split('T')[0], // Format: YYYY-MM-DD
        Timestamp: timestamp,
        Timezone: timezone,
      };

      // Store transaction
      await LocalStorage.storeTransaction(newTransaction);

      // Clear form
      setAmount('');
      setDescription('');
      setType('Expense');

      Alert.alert('Success', 'Transaction saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Type</Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.pickerButtonText}>{type}</Text>
          </TouchableOpacity>

          <Modal
            visible={showPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowPicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {transactionTypes.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.modalItem,
                      item === type && styles.modalItemSelected
                    ]}
                    onPress={() => {
                      setType(item);
                      setShowPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      item === type && styles.modalItemTextSelected
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Enter description"
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemSelected: {
    backgroundColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
  },
  modalItemTextSelected: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default AddTransaction; 