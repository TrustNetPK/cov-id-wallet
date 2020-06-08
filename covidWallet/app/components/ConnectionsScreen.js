import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ImageBoxComponent from './ImageBoxComponent'
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
          <Text style={styles.TextGuide}>Once you establish a connection, it will show up here. Go ahead and connect with someone.</Text>
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
  TextGuide: {
    color: '#708090',
    marginTop: 14,
    fontSize: 15,
    marginLeft: 50,
    marginRight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }
});

export default ConnectionsScreen;