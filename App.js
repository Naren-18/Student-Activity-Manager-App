import {} from 'react-native';
import { } from 'expo-barcode-scanner';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsScreen from './Screens/Details'; 
import HomeScreen from './Screens/HomeScreen';
import RecordsScreen from './Screens/Records';
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MRCET" options={{title:"MRCET CSESM"}} component={HomeScreen} />
        <Stack.Screen name="RecordScreen" component={RecordsScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


