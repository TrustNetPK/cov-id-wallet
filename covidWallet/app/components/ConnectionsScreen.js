import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ImageBoxComponent from './ImageBoxComponent';
import TextComponent from './TextComponent';
import FlatCard from './FlatCard';
const image = require('../assets/images/visa.jpg')

function ConnectionsScreen(props) {
  const [isConnection, setConnection] = useState(false);
  return (
    <View style={styles.MainContainer}>
      {isConnection &&
        <View>
          <Text>ConnectionsScreen</Text>
          <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world" />
          <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world" />
        </View>
      }
      {!isConnection &&
        <View style={styles.EmptyContainer}>
          <ImageBoxComponent source={require('../assets/images/connectionsempty.png')} />
          <TextComponent text="Once you establish a connection, it will show up here. Go ahead and connect with someone." />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  EmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConnectionsScreen;