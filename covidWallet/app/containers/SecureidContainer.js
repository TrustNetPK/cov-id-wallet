import React, { Component, useState, useEffect } from 'react';
import {
    Alert,
    View,
    Platform,
} from 'react-native';
import { AlertIOS, StyleSheet } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';


function SecureidContainer({ navigation }) {
    const [isSensorAvailable, checkSensor] = useState(false);

    useEffect(() => {
        isSecureIDAvailable();
        if (isSensorAvailable) {
            if (requiresLegacyAuthentication()) {
                authLegacy();
            } else {
                authCurrent();
            }
        }
        else {
            //TODO: Skip the SecureID Process if Sensor not Available
            if (Platform.OS === 'ios') {
                AlertIOS.alert('Failed to Authenticate Secure ID');
            }
            else {
                Alert.alert('Secure ID Authentication Failed', error.message);

            }

        }

    });

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

    function authCurrent() {
        FingerprintScanner
            .authenticate({ title: 'Log in with Secure ID to continue' })
            .then(() => {
                //  this.props.onAuthenticate();

            })
            .catch((error) => {
                if (Platform.OS === 'ios') {
                    AlertIOS.alert('Failed to Authenticate Secure ID');
                }
                else {
                    Alert.alert('Secure ID Authentication Failed', error.message);

                }

            });
    }

    function authLegacy() {
        FingerprintScanner
            .authenticate({ title: 'Log in with Secure ID to continue' })
            .then(() => {
                this.props.handlePopupDismissedLegacy();
                //navigation.navigate('PassCodeContainer');


            })
            .catch((error) => {
                if (Platform.OS === 'ios') {
                    AlertIOS.alert('Failed to Authenticate Secure ID');
                }
                else {
                    Alert.alert('Secure ID Authentication Failed', error.message);

                }
            });
    }

    return (

        <View>
        </View>
    );

}



export default SecureidContainer;