import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import AddTransaction from './screens/AddTransaction';
import TransactionList from './screens/TransactionList';

const Stack = createStackNavigator();

const Index = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} />
        <Stack.Screen name="TransactionList" component={TransactionList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
