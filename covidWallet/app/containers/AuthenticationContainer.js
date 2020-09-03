import React, { useEffect, useState } from 'react';
import { AlertIOS, StyleSheet, View, Text, Alert, Platform, TextInput } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import PrimaryButton from '../components/PrimaryButton';
// Pass Code Imports
import HeadingComponent from '../components/HeadingComponent';
import { PRIMARY_COLOR, GRAY_COLOR } from '../theme/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorComponent from '../components/ErrorComponent';

const img = require('../assets/images/security.png');

function AuthenticationContainer({ navigation }) {
    const [isSensorAvailable, checkSensor] = useState(false);
    const [isAuthenticated, setAuthentication] = useState(false);
    const [isSuccessful, checkSecureIDAuth] = useState(false);

    //PassCode States
    const [LocalPassCode, setlocalPassCode] = useState(0);
    const [PassCode, setPassCode] = useState(0);
    const [heading, setHeading] = useState('Security Check')
    const [btnText, setBtnText] = useState('Validate');
    const [error, setError] = useState('');
    const [stage, setStage] = useState(0);

    const retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('@passCode').then((value) => {
                console.log("Local Storage Password is " + value)

                setlocalPassCode(value)

            })


        } catch (error) {
            // Error retrieving data
        }
    };

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
            //navigation.replace('MainScreen');
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
                retrieveData();
                checkSensor(false);
            });
    }
    useEffect(() => {
        isSecureIDAvailable()
        //enableSecureID();
    })

    function authLegacy() {
        FingerprintScanner.release();
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

    const nextHandler = () => {
        navigation.replace('MainScreen');
    }


    const nextPassCodeHandler = () => {
        setError('')

        if (PassCode.length == undefined || PassCode.length < 6) {
            setError("Please enter a valid passcode.")
        }



        else {
            if (LocalPassCode == PassCode) {
                navigation.replace('MainScreen')

            }

            else {
                setError('Passcode does not match')
            }
        }

    }
    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {isSensorAvailable &&
                <View>
                    <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <ImageBoxComponent
                            source={img}
                        />
                    </View>

                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <Text style={styles.TextContainerHead}>Security Check</Text>
                        <TextComponent onboarding={true} text="Using security check significantly reduces the chances
                  your account will be compromised in case your phone is lost or stolen." />
                    </View>
                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <PrimaryButton text="Pass Security Check to move further" nextHandler={enableSecureID} />
                    </View>
                </View>
            }
            {!isSensorAvailable &&
                <View style={styles.title}>
                    <HeadingComponent text={heading} />
                    <View style={styles.codeWrapper}>
                        <View style={styles.passcodeEnter}>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.textBox}
                                keyboardType='numeric'
                                maxLength={6}
                                caretHidden={true}
                                autoFocus={true}
                                onChangeText={(PassCode) => setPassCode(PassCode)}
                            />
                        </View>
                        <View style={styles.circleBlock}>
                            <View style={[styles.circle, PassCode.length >= 1 && styles.circleFill]}></View>
                            <View style={[styles.circle, PassCode.length >= 2 && styles.circleFill]}></View>
                            <View style={[styles.circle, PassCode.length >= 3 && styles.circleFill]}></View>
                            <View style={[styles.circle, PassCode.length >= 4 && styles.circleFill]}></View>
                            <View style={[styles.circle, PassCode.length >= 5 && styles.circleFill]}></View>
                            <View style={[styles.circle, PassCode.length >= 6 && styles.circleFill]}></View>
                        </View>
                        {error.length > 0 ? <ErrorComponent text={error} /> : null}
                    </View>
                    <View style={styles.buttonContainer}><PrimaryButton text={btnText} nextHandler={nextPassCodeHandler} /></View>
                </View>}
        </View >
    );
}


AuthenticationContainer.defaultProps = {
    isSensorAvailable: false,
    isSuccessful: false

};

const styles = StyleSheet.create({
    TextContainerHead: {
        alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold',
        fontSize: 32, flexDirection: 'column',
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    heading: {
        fontSize: 25
    },
    passcodeEnter: {
        opacity: 0,
        position: 'absolute',
        width: 200,
        zIndex: 9
    },
    textBox: {
        fontSize: 30,
        marginTop: 20,
        letterSpacing: 15,
        textAlign: 'center',
    },
    circleBlock: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '15%',
        justifyContent: 'center'
    },
    circle: {
        borderRadius: 30,
        borderWidth: 3,
        borderColor: GRAY_COLOR,
        height: 25,
        marginLeft: 12,
        marginRight: 12,
        width: 25
    },
    circleFill: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: GRAY_COLOR,
        height: 25,
        marginLeft: 12,
        marginRight: 12,
        width: 25
    },

    buttonContainer: {
        marginTop: '15%'
    }
});

export default AuthenticationContainer;