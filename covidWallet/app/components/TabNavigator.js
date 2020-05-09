import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionsScreen from './ActionsScreen';
import ConnectionsScreen from './ConnectionsScreen';
import CredentialsScreen from './CredentialsScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (

    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Actions') {
          iconName = 'plus-circle'
        } else if (route.name === 'Connections') {
          iconName = 'window-restore';
        }
        else if (route.name === 'Credentials') {
          iconName = 'search';
        }
        // You can return any component that you like here!
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
    })}
      tabBarOptions={{
        activeTintColor: '#8dc03c',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Actions" component={ActionsScreen} />
      <Tab.Screen name="Credentials" component={CredentialsScreen} />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
    </Tab.Navigator>

  );
}

export default TabNavigator;