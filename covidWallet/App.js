import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import NetworkContext from './app/context/NetworkContext';
import NavigationComponent from './app/Navigation';
import { PRIMARY_COLOR } from './app/theme/Colors';

const App = () => {

  return (
    <NetworkContext>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
      <NavigationComponent />
    </NetworkContext>
  );
};

export default App;
