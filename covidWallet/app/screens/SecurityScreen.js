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
      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
        <TextComponent onboarding={true} text="Using biometric security significantly reduces the chances
                your account will be compromised in case your phone is lost or stolen."/>
      </View>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <PrimaryButton title="Enable Secure ID" nextHandler={nextHandler} />
      </View>
    </View> 
  );
}

export default SecurityScreen;