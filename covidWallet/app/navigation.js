import * as React from 'react';
import { View, Text,Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './components/TabNavigator';
import SplashScreen from 'react-native-splash-screen';
import PassCodeScreen from './containers/PassCodeScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SecurityScreen from './components/SecurityScreen';
import NotfiyMeScreen from './components/NotfiyMeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './components/SettingsScreen';
import QRScreen from './components/QRScreen';

const Stack = createStackNavigator();

function NavigationComponent() {
  React.useEffect(()=>{
    SplashScreen.hide();
  },[])
  return (
    <NavigationContainer>
         <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen options={{headerShown: false}} name="PassCodeScreen" component={PassCodeScreen}  />
        <Stack.Screen options={{headerShown: false}} name="WelcomeScreen"  component={WelcomeScreen}  />
        <Stack.Screen options={{headerShown: false}} name="SecurityScreen"  component={SecurityScreen}  />
        <Stack.Screen options={{headerShown: false}} name="NotfiyMeScreen"  component={NotfiyMeScreen}  />
        <Stack.Screen options={{headerShown: false}} name="SettingsScreen" component={SettingsScreen}  />
        <Stack.Screen options={{headerShown: false}} name="QRScreen" component={QRScreen}  />
        <Stack.Screen name="MainScreen"  
        options={({navigation})=>({  headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }, title: false,headerRight: () => (
        <Icon onPress={()=>{navigation.navigate('QRScreen')}} style={styles.headerRightIcon} size={30} name="qrcode" padding={30} />
      ),headerLeft: () => (
        <Icon onPress={()=>{navigation.navigate('SettingsScreen')}} style={styles.headerRightIcon} size={30} name="gear" padding={30} />
      ) })}
    // options={({ navigation, route }) => ({
    //   headerTitle: (props)=>{console.log(props)},
    // })}
      component={TabNavigator}  />
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