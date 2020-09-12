import { Platform } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-community/async-storage';

var localPassCode = 0;
var isSuccessful = false;


function isSecureIDAvailable() {
    return FingerprintScanner
        .isSensorAvailable().then(
            () => {
                return true;

            }
        )
        .catch((error) => {
            retrieveData();
            return false;
        });
}
const retrieveData = async () => {
    try {
        const value = await AsyncStorage.getItem('@passCode').then((value) => {
            localPassCode = value;

        })


    } catch (error) {
        // Error retrieving data
    }
};

function requiresLegacyAuthentication() {
    return Platform.Version < 23;
}

async function authLegacy() {
    FingerprintScanner.release();
    return FingerprintScanner
        .authenticate({ title: 'Log in with Secure ID to continue' })
        .then(() => {
            // this.props.handlePopupDismissedLegacy();
            isSuccessful = true;
            return true;
        })
        .catch((error) => {
            return false;
        });
}

async function authCurrent() {
    FingerprintScanner.release();
    return FingerprintScanner
        .authenticate({ title: 'Log in with Secure ID to continue' })
        .then(() => {
            isSuccessful = true;
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export const authenticate = async () => {
    let response = false;
    if (isSecureIDAvailable()) {
        if (requiresLegacyAuthentication()) {
            response = authLegacy();
        } else {
            response = authCurrent();
        }
        return response;
    }
    else {
        //TODO: Skip the SecureID Process if Sensor not Available
        //navigation.replace('MainScreen');
        return response;
    }
}