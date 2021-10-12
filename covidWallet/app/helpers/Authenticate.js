import { Platform } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConstantsList, { ZADA_AUTH_SECRET, ZADA_AUTH_URL } from '../helpers/ConfigApp';
import { getItem, saveItem } from '../helpers/Storage';
import axios from 'axios';

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

const storeUserAuth = async (userAuth) => {
    try {
        await AsyncStorage.setItem(ConstantsList.USER_AUTH, JSON.stringify(userAuth));
    } catch (error) {
        console.log(error);
    }
};

const getUserCurrentAuth = async () => {
    try {
        let auth = await AsyncStorage.getItem(ConstantsList.USER_AUTH);
        return JSON.parse(auth);
    } catch (error) {
        console.log(error);
    }
};

const getIsAuthExpired = async () => {
    try {
        let nowUnixEpoch = Math.round(Date.now() / 1000);
        let userAuth = await getUserCurrentAuth();
        if (userAuth !== null) {
            let expUnixEpoch = userAuth.exp;
            if ((expUnixEpoch - nowUnixEpoch) <= 120) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }

    } catch (error) {
        console.log(error);
    }
};

export const AuthenticateUser = async (forceAuthenticate) => {
    try {
        if (forceAuthenticate === undefined) {
            forceAuthenticate = false;
        }
        let isAuthExpired = await getIsAuthExpired();
        if (isAuthExpired || forceAuthenticate) {
            let walletSecret = await getItem(ConstantsList.WALLET_SECRET);
            let userID = await getItem(ConstantsList.USER_ID);
            return await fetch(ConstantsList.BASE_URL + `/api/authenticate`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userID,
                    secretPhrase: walletSecret,
                }),
            }).then((response) =>
                response.json().then((data) => {
                    try {
                        let response = JSON.parse(JSON.stringify(data));
                        if (response.success == true) {
                            storeUserAuth(response);
                            return { success: true, token: response.token }
                        } else {
                            return { success: false, message: response.error }
                        }
                    } catch (error) {
                        return { success: false, message: error.message }
                    }
                }),
            );
        } else {
            let userAuth = await getUserCurrentAuth();
            return { success: true, token: userAuth.token }
        }
    } catch (error) {
        return { success: false, message: error.message }
    }

};

const get_zada_auth = async () => {
    try {
        let auth = await AsyncStorage.getItem(ConstantsList.ZADA_AUTH);
        return JSON.parse(auth);
    } catch (error) {
        console.log(error);
    }
}; 

const getIsZadaAuthExpired = async () => {
    try {
        let nowUnixEpoch = Math.round(Date.now() / 1000);
        let zadaAuth = await get_zada_auth();
        if (zadaAuth !== null) {
            let expUnixEpoch = zadaAuth.exp;
            if ((expUnixEpoch - nowUnixEpoch) <= 120) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }

    } catch (error) {
        console.log(error);
    }
};

export const authenticateZadaAuth = async () => {
    try {
        let isZadaAuthExpired = await getIsZadaAuthExpired();
        if(isZadaAuthExpired){
            // Code expired generate new one and return it
            const authResult = await axios({
                url: `${ZADA_AUTH_URL}/api/authenticate`,
                method: 'POST',
                data:{
                    secret: ZADA_AUTH_SECRET,
                }
            });

            if(authResult.data.success){
                // Saving zada auth
                await saveItem(ConstantsList.ZADA_AUTH, JSON.stringify(authResult.data.data));

                // getting token
                let token = authResult.data.data.token;

                console.log('ZADA AUTH TOKEN => ', token);
                return { success: true, token: token }
            }
            else{
                return { success: false, error: error }
            }
        }
        else{
            // Otherwise use existing one
            const token = (JSON.parse(await getItem(ConstantsList.ZADA_AUTH))).token;
            console.log('ZADA AUTH TOKEN => ', token);
            return { success: true, token: token }
        }
    } catch (error) {
        return { success: false, error: error.toString() }
    }
}