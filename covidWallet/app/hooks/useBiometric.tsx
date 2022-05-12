import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppState } from 'react-native';
import { BIOMETRIC_ENABLED } from '../helpers/ConfigApp';
import { getItem, saveItem } from '../helpers/Storage';
import { showMessage } from '../helpers/Toast';

const useBiometric = () => {

    // Refs
    const appState = useRef(AppState.currentState);
    const appStarted = useRef(true);

    // States
    const [authStatus, setAuthStatus] = useState(false);


    // UseEffects
    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                checkIfAuthIsRequired();
            } else {
                setAuthStatus(false);
            }
            appState.current = nextAppState;
        });

        // On app start
        if (appStarted.current) {
            checkIfAuthIsRequired();
        }

        return () => {
            subscription.remove();
        };
    }, [])


    // Functions
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
                if (resp.success) {
                    return resp.success;
                } else {
                    throw resp.success;
                }

            } else {
                showMessage(
                    'ZADA Wallet',
                    'Please enable biometric verification from mobile.',
                );
            }
        }
        return false;
    };

    // Checking if auth is required.
    const checkIfAuthIsRequired = async () => {
        let temporarilyMovedToBackground = await AsyncStorage.getItem("temporarilyMovedToBackground");

        let biometricEnabled = await getItem(BIOMETRIC_ENABLED);
        biometricEnabled = JSON.parse(biometricEnabled || 'false');

        // Return if biometric is disabled
        if (!biometricEnabled) return;

        // Return if authStatus is false
        if (!authStatus) {
            // Check if Authorization is not in process.
            if (temporarilyMovedToBackground == 'true') return false

            // Start Authorize flow
            if (appStarted.current) {
                // adding timeout to resolve multiple calls to authenticateNow()
                setTimeout(() => {
                    authenticateNow();
                }, 1000);
                appStarted.current = false;
            } else {
                authenticateNow();
            }
        }
    }

    const authenticateNow = async (singleAuth?: boolean) => {
        try {
            await saveItem('temporarilyMovedToBackground', "true");

            let result = await authenticateUser();

            setAuthStatus(true);

            setTimeout(async () => {
                await saveItem('temporarilyMovedToBackground', "false");
            }, 1000)

            return result;
        } catch (e) {
            if (!singleAuth)
                authenticateNow();
        }
    }


    // For single authentications
    const oneTimeAuthentication = async (callback: Function) => {
        try {
            let result = await authenticateNow(true)
            return callback(result);
        } catch (e) {
            console.log(e);
        }
    }


    return {
        oneTimeAuthentication,
        authStatus,
    };
};
export default useBiometric;