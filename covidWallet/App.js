import React from 'react';
import { StatusBar } from "react-native";
import NavigationComponent from './app/Navigation';
import { BLACK_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from './app/theme/Colors';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={BLACK_COLOR} />
      <NavigationComponent />
    </>
  );
};


export default App;
