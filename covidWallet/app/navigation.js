import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './components/TabNavigator';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

function NavigationComponent() {
  React.useEffect(()=>{
    SplashScreen.hide();
  },[])
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={TabNavigator}  options={{ title: 'COVID Wallet' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationComponent;