
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageComponent } from 'react-native';
import CredentialsCard from './CredentialsCard';
import ImageBoxComponent from './ImageBoxComponent';

const card_logo = require('../assets/images/visa.jpg')

function CredentialsScreen(props) {
  const [isCredential, setCredential] = useState(false);

  return (
    <View style={styles.MainContainer}>
      {isCredential &&
        <View>
          <Text style={styles.heading}>Credentials</Text>
          <CredentialsCard card_no="0000 0000 0000 0000" card_user="SAEED AHMAD" date="05/09/2020" card_logo={card_logo} />
        </View>
      }
      {!isCredential &&
        <View style={styles.EmptyContainer}>
          <ImageBoxComponent source={require('../assets/images/credentialsempty.png')} />
          <Text style={styles.TextGuide}>There are no certificates in your wallet. Once you receive a certificate, it will show up here.</Text>
        </View>
      }
    </View>
  );
}


const styles = StyleSheet.create({
  heading: {
    fontWeight: "600",
    fontSize: 30,
  },
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

export default CredentialsScreen;