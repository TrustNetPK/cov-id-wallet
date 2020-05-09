import * as React from 'react';
import { View, Text,Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './components/TabNavigator';
import SplashScreen from 'react-native-splash-screen';
import PassCodeScreen from './containers/PassCodeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

function NavigationComponent() {
  React.useEffect(()=>{
    SplashScreen.hide();
  },[])
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="PassCodeScreen">
        <Stack.Screen options={{headerShown: false}} name="PassCodeScreen" component={PassCodeScreen}  />
        <Stack.Screen name="MainScreen"  options={{  headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }, title: false,headerRight: () => (
        <Icon onPress={()=>{console.log('1')}} style={styles.headerRightIcon} size={30} name="qrcode" padding={30} />
      ),headerLeft: () => (
        <Icon onPress={()=>{console.log('backbutton')}} style={styles.headerRightIcon} size={30} name="gear" padding={30} />
      ) }} component={TabNavigator}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRightIcon: {
    padding: 10,
  }
});

export default NavigationComponent;