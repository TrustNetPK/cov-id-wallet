import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import FlatCard from './FlatCard';
import ImageBoxComponent from './ImageBoxComponent';
import TextComponent from './TextComponent';

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
          <ImageBoxComponent source={require('../assets/images/action.gif')} />
          <TextComponent text="There are no actions to complete, Please scan a QR code to either get a vaccination certificate or to prove it." />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  Imagesize: {
    marginBottom: 50,
    height: 300,
    width: 300,
    resizeMode: 'contain'
  },
});
export default ActionsScreen;