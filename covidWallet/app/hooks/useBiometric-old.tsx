import { useEffect, useRef, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { getItem } from '../helpers/Storage';
import { BIOMETRIC_ENABLED } from '../helpers/ConfigApp';
import { showMessage } from '../helpers/Toast';

// import useAppState from 'react-native-appstate-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

const useBiometric = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

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

  // const { appState } = useAppState({
  //   onChange: async (newAppState) => {
  //     if (newAppState == 'background') {
  //       // console.log('background');
  //       let temp = await AsyncStorage.getItem("temporarilyMovedToBackground");
  //       setAuthStatus(false);
  //     }
  //   },
  //   onForeground: async () => {
  //     if (oneTime) {
  //       setOneTime(false);
  //       return;
  //     }

  //     let biometricEnabled = await getBiometricStatus();

  //     if (!biometricEnabled) return;

  //     if (!authStatus && !authVisible) {
  //       // setAuthVisible(true);
  //       await AsyncStorage.setItem("temporarilyMovedToBackground", 'true');

  //       // Timeout for setAuthStatus
  //       setTimeout(async () => {
  //         let result = await authenticateUser();
  //         setAuthStatus(result);
  //       }, 500);

  //       await AsyncStorage.setItem("temporarilyMovedToBackground", 'false');
  //       // setAuthVisible(false);
  //     }
  //     console.log('foreground!')
  //   },
  //   onBackground: () => { },
  // });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      console.log('CALLING CHANGE')
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkBiometric();
      } else {
        console.log('background or inactive')
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [])

  const checkBiometric = async () => {
    let temporarilyMovedToBackground = await AsyncStorage.getItem("temporarilyMovedToBackground");

    if (temporarilyMovedToBackground == 'true') return

    let biometricEnabled = await getBiometricStatus();

    if (!biometricEnabled) return;

    if (!authStatus && temporarilyMovedToBackground == 'false') {

      // setting temp move true to control chiken and egg problem.
      await AsyncStorage.setItem("temporarilyMovedToBackground", "true");

      // Timeout for setAuthStatus
      setTimeout(async () => {
        let result = await authenticateUser();
        setAuthStatus(result);
      }, 500);

      // setting temp move to false.
      setTimeout(() => {
        AsyncStorage.setItem("temporarilyMovedToBackground", "false");
      }, 2000);
    }

  }

  return { authStatus, oneTimeAuthentication };
};
export default useBiometric;
