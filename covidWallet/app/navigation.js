import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './components/TabNavigator';
import SplashScreen from 'react-native-splash-screen';
import PassCodeScreen from './components/PassCodeScreen';

const Stack = createStackNavigator();

function NavigationComponent() {
  React.useEffect(()=>{
    SplashScreen.hide();
  },[])
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="PassCodeScreen">
        <Stack.Screen options={{headerShown: false}} name="PassCodeScreen" component={PassCodeScreen}  />
        <Stack.Screen name="MainScreen"  options={{ title: 'COVID WALLET' }} component={TabNavigator}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationComponent;