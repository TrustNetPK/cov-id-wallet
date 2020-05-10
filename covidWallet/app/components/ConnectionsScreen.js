
import * as React from 'react';
import { View, Text } from 'react-native';
import FlatCard from './FlatCard';

const image = require('../assets/images/visa.jpg')

function ConnectionsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text>ConnectionsScreen</Text>
      <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world"/>
      <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world"/>

    </View>
  );
}

export default ConnectionsScreen;