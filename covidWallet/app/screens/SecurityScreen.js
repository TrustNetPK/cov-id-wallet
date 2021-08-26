import React, { useEffect, useState } from 'react';
import { AlertIOS, StyleSheet, View, Text, Alert, Platform } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { BACKGROUND_COLOR } from '../theme/Colors'
import PrimaryButton from '../components/PrimaryButton';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import GreenPrimaryButton from '../components/GreenPrimaryButton';
import { saveItem } from '../helpers/Storage';
import { BIOMETRIC_ENABLED } from '../helpers/ConfigApp';

const img = require('../assets/images/security.png');

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
      navigation.navigate('NotifyMeScreen');
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
    console.log("h1");
    FingerprintScanner.release();
    FingerprintScanner
      .authenticate({ title: 'Log in with Secure ID to continue' })
      .then(() => {
        // this.props.handlePopupDismissedLegacy();
        checkSecureIDAuth(true);
        nextHandler();
      })
      .catch((error) => {
        console.log(error)
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
    FingerprintScanner.release();
    FingerprintScanner
      .authenticate({ title: 'Log in with Secure ID to continue' })
      .then(() => {
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


  nextHandler = () => {
    navigation.navigate('NotifyMeScreen');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BACKGROUND_COLOR }}>
      <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Text style={styles.TextContainerHead}>Be Secure</Text>
        <TextComponent onboarding={true} text="Using biometric security significantly reduces the chances
                your account will be compromised in case your phone is lost or stolen." />
      </View>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBoxComponent
          source={img}
        />
      </View>
      <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
        <GreenPrimaryButton text="ENABLE SECURE ID" nextHandler={enableSecureID} />
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

SecurityScreen.defaultProps = {
  isSensorAvailable: false,
  isSuccessful: false

};

export default SecurityScreen;