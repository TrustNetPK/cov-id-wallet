import {useState} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import {getItem} from '../helpers/Storage';
import {BIOMETRIC_ENABLED} from '../helpers/ConfigApp';
import {showMessage} from '../helpers/Toast';

import useAppState from 'react-native-appstate-hook';

const useBiometric = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);

  const [oneTime, setOneTime] = useState(false);

  const oneTimeAuthentication = async (callback: Function) => {
    setOneTime(true);
    setTimeout(async () => {
      let result = await authenticateUser();
      setAuthStatus(true);
      return callback(result);
    }, 500);
  };

  // Authenticate function
  const authenticateUser = async () => {
    // Check if sensor is available.
    let available = await LocalAuthentication.hasHardwareAsync();

    if (available) {
      // Check if fingerprint is enrolled.
      let isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (isEnrolled) {
        // Authenticate User
        let resp = await LocalAuthentication.authenticateAsync();
        return resp.success;
      } else {
        showMessage(
          'ZADA Wallet',
          'Please enable biometric verification from mobile.',
        );
      }
    }
    return false;
  };

  const getBiometricStatus = async () => {
    let biometricEnabled = await getItem(BIOMETRIC_ENABLED);
    biometricEnabled = JSON.parse(biometricEnabled || 'false');
    return biometricEnabled;
  };

  const {appState} = useAppState({
    onChange: (newAppState) => {
      if (newAppState == 'background') {
        setAuthStatus(false);
      }
    },
    onForeground: async () => {
      if (oneTime) {
        setOneTime(false);
        return;
      }

      let biometricEnabled = await getBiometricStatus();

      if (!biometricEnabled) return;

      if (!authStatus && !authVisible) {
        setAuthVisible(true);

        // Timeout for setAuthStatus
        setTimeout(async () => {
          let result = await authenticateUser();
          setAuthStatus(result);
        }, 500);

        setAuthVisible(false);
      }
    },
    onBackground: () => {},
  });

  return {authStatus, oneTimeAuthentication};
};
export default useBiometric;
