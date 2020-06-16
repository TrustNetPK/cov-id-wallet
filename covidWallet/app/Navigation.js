import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './components/TabNavigator';
import SplashScreen from 'react-native-splash-screen';
import PassCodeContainer from './containers/PassCodeContainer';
import WelcomeScreen from './screens/WelcomeScreen';
import SecurityScreen from './screens/SecurityScreen';
import NotfiyMeScreen from './screens/NotfiyMeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingsScreen from './screens/SettingsScreen';
import QRScreen from './screens/QRScreen';
import { BLACK_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from './theme/Colors';

const Stack = createStackNavigator();

function NavigationComponent() {

  React.useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen options={{ headerShown: false }} name="PassCodeContainer" component={PassCodeContainer} />
        <Stack.Screen options={{ headerShown: false }} name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="SecurityScreen" component={SecurityScreen} />
        <Stack.Screen options={{ headerShown: false }} name="NotfiyMeScreen" component={NotfiyMeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen options={{ headerShown: false }} name="QRScreen" component={QRScreen} />
        <Stack.Screen name="MainScreen"
          options={({ navigation }) => ({
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            }, title: false, headerRight: () => (
              <MaterialCommunityIcons onPress={() => { navigation.navigate('QRScreen') }} style={styles.headerRightIcon} size={30} name="qrcode" padding={30} />
            ), headerLeft: () => (
              <MaterialCommunityIcons onPress={() => { navigation.navigate('SettingsScreen') }} style={styles.headerRightIcon} size={30} name="settings" padding={30} />
            )
          })}
          component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRightIcon: {
    padding: 10,
    color: BLACK_COLOR
  }
});

export default NavigationComponent;
