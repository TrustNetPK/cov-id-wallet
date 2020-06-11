import * as React from 'react';
import { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import ImageBoxComponent from './ImageBoxComponent';
import TextComponent from './TextComponent';
const img = require('../assets/images/security.png');
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { AlertIOS, StyleSheet, View, Alert, Platform } from 'react-native';

function SecurityScreen({ navigation }) {
  const [isSensorAvailable, checkSensor] = useState(false);
  const [isSuccessful, checkSecureIDAuth] = useState(false);


  useEffect(() => {
    isSecureIDAvailable()
  })

  function enableSecureID() {

    if (isSensorAvailable) {
      if (requiresLegacyAuthentication()) {
        authLegacy();
      } else {
        authCurrent();
      }
    }
    else {
      //TODO: Skip the SecureID Process if Sensor not Available
      navigation.navigate('PassCodeContainer');
    }
  }

  function requiresLegacyAuthentication() {
    return Platform.Version < 23;
  }

  function isSecureIDAvailable() {
    FingerprintScanner
      .isSensorAvailable().then(
        () => {
          checkSensor(true);
        }
      )
      .catch((error) => {
        checkSensor(false);
      });
  }

  function authLegacy() {
    FingerprintScanner
      .authenticate({ title: 'Log in with Secure ID to continue' })
      .then(() => {
        this.props.handlePopupDismissedLegacy();
        checkSecureIDAuth(true);
        nextHandler();
      })
      .catch((error) => {
        if (Platform.OS === 'ios') {
          AlertIOS.alert('Failed to Authenticate Secure ID');
        }
        else {
          Alert.alert('Secure ID Authentication Failed', error.message);

        }
        checkSecureIDAuth(false);
      });
  }

  function authCurrent() {
    FingerprintScanner
      .authenticate({ title: 'Log in with Secure ID to continue' })
      .then(() => {
        checkSecureIDAuth(true);
        nextHandler();
        //console.log("Enter in the True Section of Finger Print")

      })
      .catch((error) => {
        if (Platform.OS === 'ios') {
          AlertIOS.alert('Failed to Authenticate Secure ID');
        }
        else {
          Alert.alert('Secure ID Authentication Failed', error.message);

        }
        checkSecureIDAuth(false);
        //console.log("False Section is " + isSuccessful)

      });


  }



  nextHandler = () => {
    FingerprintScanner.release();
    // if (isSuccessful)
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
        <PrimaryButton title="Enable Secure ID" nextHandler={enableSecureID} />
      </View>
    </View>
  );
}

SecurityScreen.defaultProps = {
  isSensorAvailable: false,
  isSuccessful: false

};

export default SecurityScreen;