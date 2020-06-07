import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import FlatCard from './FlatCard';

const image = require('../assets/images/visa.jpg')

function ActionsScreen(props) {
  const [isAction, setAction] = useState(false);

  return (
    <View style={styles.MainContainer}>
      {isAction &&
        <View>
          <Text>Actions</Text>
          <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world" />
          <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world" />
        </View>
      }
      {!isAction &&
        <View style={styles.EmptyContainer}>
          <Image style={styles.Imagesize} source={require('../assets/images/action.gif')} />
          <Text style={styles.TextGuide}>There are no actions to complete, Please scan a QR code to either get a vaccination certificate or to prove it.</Text>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  EmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Imagesize: {
    marginBottom: 50,
    height: 300,
    width: 300,
    resizeMode: 'contain'
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
export default ActionsScreen;