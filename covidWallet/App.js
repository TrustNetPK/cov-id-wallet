import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'react-native';
import NavigationComponent from './app/Navigation';
import { PRIMARY_COLOR } from './app/theme/Colors';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
      <NavigationComponent />
    </>
  );
};

export default App;
