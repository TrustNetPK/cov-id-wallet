import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './HomeScreen';
import UserScreen from './UserScreen';
import QRScreen from './QRScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
   
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'User') {
            iconName = 'user-circle';
          }
          else if (route.name === 'QR') {
            iconName = 'qrcode';
          }
          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#8dc03c',
        inactiveTintColor: 'gray',
      }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="QR" component={QRScreen} />
        <Tab.Screen name="User" component={UserScreen} />
      </Tab.Navigator>

  );
}

export default TabNavigator;