import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
const img = require('../assets/images/security.png');

function SecurityScreen({ navigation }) {

  nextHandler = () => {
    navigation.navigate('PassCodeContainer');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBoxComponent
          source={img}
        />
      </View>

      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Text style={styles.TextContainerHead}>Be Secure</Text>
        <TextComponent onboarding={true} text="Using biometric security significantly reduces the chances
                your account will be compromised in case your phone is lost or stolen." />
      </View>
      <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
        <PrimaryButton text="Enable Face ID" nextHandler={nextHandler} />
      </View>
    </View >
  );
}


const styles = StyleSheet.create({
  TextContainerHead: {
    alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold',
    fontSize: 32, flexDirection: 'column',
  }
});

export default SecurityScreen;