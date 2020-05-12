
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CredentialsCard from './CredentialsCard';

const card_logo = require('../assets/images/visa.jpg')

function CredentialsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.heading}>Credentials</Text>
      <CredentialsCard card_no="0000 0000 0000 0000" card_user="SAEED AHMAD" date="05/09/2020" card_logo={card_logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  heading:{
    fontWeight: "600",
    fontSize:30,
  }
});

export default CredentialsScreen;