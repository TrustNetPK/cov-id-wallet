import React, {useRef, useState} from 'react';
import {Alert} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
  GREEN_COLOR,
  WHITE_COLOR,
  GRAY_COLOR,
} from '../theme/Colors';
import HeadingComponent from '../components/HeadingComponent';
import ConstantsList from '../helpers/ConfigApp';
import NetInfo from '@react-native-community/netinfo';
import {saveItem} from '../helpers/Storage';
import {showMessage, showNetworkMessage, _showAlert} from '../helpers/Toast';
import {AuthenticateUser} from '../helpers/Authenticate';
import {InputComponent} from '../components/Input/inputComponent';
import {
  nameRegex,
  validateAtLeastOneSpecialLetter,
  validateAtLeastOneUpperCaseLetter,
  validateIfLowerCased,
  validateLength,
  validateMediumPassword,
  validatePasswordStrength,
  validateStrongPassword,
} from '../helpers/validation';
import {_resgiterUserAPI} from '../gateways/auth';
import SimpleButton from '../components/Buttons/SimpleButton';
import jwt_decode from 'jwt-decode';
import {_fetchingAppData} from '../helpers/AppData';
import useNetwork from '../hooks/useNetwork';
import {_handleAxiosError} from '../helpers/AxiosResponse';

const {width} = Dimensions.get('window');

function RegistrationModule({navigation}) {
  const {isConnected} = useNetwork();
  const [activeOption, updateActiveOption] = useState('register');

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const phoneInput = useRef(null);
  const [phone, setPhone] = useState('');
  const [phoneText, setPhoneText] = useState('');

  const [secret, setSecret] = useState('');
  const [secretError, setSecretError] = useState('');

  const [secureSecret, setSecureSecret] = useState(true);

  const [strengthMessage, setStrengthMessage] = useState(undefined);

  const [progress, setProgress] = useState(false);

  // Toggling for password
  const _toggleSecureSecretEntry = () => {
    setSecureSecret(!secureSecret);
  };

  const selectionOnPress = (userType) => {
    updateActiveOption(userType);
  };

  React.useEffect(() => {
    if (activeOption == 'register') {
      setPhone('');
      // setSecret(randomString(24))
      setSecretError('');
    } else {
      setSecret('');
    }
  }, [activeOption]);

  const submit = () => {
    // Check if name is valid.
    if (!nameRegex.test(name) && activeOption == 'register') {
      setNameError(
        'Please enter a name between 2-1000 alphabetical characters long. No numbers or special characters.',
      );
      return;
    }
    setNameError('');

    // Check if phone number is valid
    const checkValid = phoneInput.current?.isValidNumber(phone);
    if (!checkValid) {
      Alert.alert('Zada Wallet', 'Please enter a valid phone number.');
      return;
    }

    if (phoneText.charAt(0) == '0' && activeOption == 'register') {
      Alert.alert('Zada Wallet', 'Phone number should not start with zero');
      return;
    }

    // Check if secret
    if (secret == '') {
      setSecretError('Password is required.');
      return;
    }

    if (activeOption == 'register') {
      //check secret length min,max respectively
      if (validateLength(secret, 6, 30)) {
        setSecretError('Password length should be 6 to 30 characters');
        return;
      }
    }

    if (activeOption == 'login') {
      //check secret length min,max respectively
      if (validateLength(secret, 1, 50)) {
        setSecretError('Password length should be 1 to 50 characters');
        return;
      }
    }
    setSecretError('');

    setProgress(true);
    if (activeOption == 'register') register();
    else if (activeOption == 'login') login();
    else setProgress(false);
  };

  const register = async () => {
    try {
      if (isConnected) {
        let data = {
          name: name.trim(),
          phone: phone.trim(),
          secretPhrase: secret,
        };

        const result = await _resgiterUserAPI(data);
        const response = result.data;

        if (response.success) {
          // new user is going to register
          await saveItem(
            ConstantsList.REGISTRATION_DATA,
            JSON.stringify(response),
          );
          await saveItem(ConstantsList.WALLET_SECRET, secret);
          navigation.replace('MultiFactorScreen', {from: 'Register'});
        } else if (response.verified != undefined && !response.verified) {
          // unverified user come to register
          await saveItem(
            ConstantsList.REGISTRATION_DATA,
            JSON.stringify(response),
          );
          await saveItem(ConstantsList.WALLET_SECRET, secret);
          navigation.replace('MultiFactorScreen', {from: 'Register'});
        } else if (response.verified != undefined && response.verified) {
          // verified user came again to register
          selectionOnPress('login');
          _showAlert('Zada Wallet', response.error);
        } else {
          _showAlert('Zada Wallet', response.error);
        }
        setProgress(false);
      } else {
        setProgress(false);
        showNetworkMessage();
      }
    } catch (error) {
      console.log(error.response);
      setProgress(false);
      if (error.response && error.response.data) {
        _checkForVerification(error.response.data);
      }
    }
  };

  const _checkForVerification = async (response) => {
    try {
      if (response.verified != undefined && !response.verified) {
        // unverified user come to register
        await saveItem(
          ConstantsList.REGISTRATION_DATA,
          JSON.stringify(response),
        );
        await saveItem(ConstantsList.WALLET_SECRET, secret);
        navigation.replace('MultiFactorScreen', {from: 'Register'});
      } else if (response.verified != undefined && response.verified) {
        // verified user came again to register
        selectionOnPress('login');
        _showAlert('Zada Wallet', response.error);
      } else {
        _showAlert('Zada Wallet', response.error);
      }
    } catch (error) {
      _handleAxiosError(error);
    }
  };

  const login = async () => {
    if (isConnected) {
      await fetch(ConstantsList.BASE_URL + `/api/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          secretPhrase: secret,
        }),
      }).then((credsResult) =>
        credsResult.json().then(async (data) => {
          try {
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              storeUserID(response.userId);
              saveItem(ConstantsList.WALLET_SECRET, secret);
              await saveItem(
                ConstantsList.LOGIN_DATA,
                JSON.stringify(response),
              );

              await authenticateUserToken(response?.type);
            } else {
              showMessage('ZADA Wallet', response.error);
              setProgress(false);
            }
          } catch (error) {
            _handleAxiosError(error);
          } finally {
            setProgress(false);
          }
        }),
      );
    } else {
      setProgress(false);
      showNetworkMessage();
    }
  };

  const storeUserID = async (userId) => {
    try {
      await AsyncStorage.setItem(ConstantsList.USER_ID, userId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const createWallet = async (userToken) => {
    await fetch(ConstantsList.BASE_URL + `/api/wallet/create`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + userToken,
      },
    }).then((walletResult) =>
      walletResult.json().then(async (data) => {
        try {
          let response = JSON.parse(JSON.stringify(data));
          if (response.success == true) {
            // reauthentication
            let reAuth = await AuthenticateUser(true);

            if (reAuth.success) {
              // decoding token
              const decodedreAuthToken = jwt_decode(reAuth.token);

              if (decodedreAuthToken.dub.length) {
                await _fetchingAppData(isConnected);
                setProgress(false);
                // if token has wallet id
                navigation.replace('SecurityScreen');
              } else {
                //await authenticateUserToken();
              }
            } else {
              setProgress(false);
              _showAlert('ZADA Wallet', `${reAuth.message}`);
            }
          } else {
            _showAlert('ZADA Wallet', `${response.error}`);
          }
        } catch (error) {
          _showAlert('ZADA Wallet', `${error.toString()}`);
        }
      }),
    );
  };

  const authenticateUserToken = async (isDemo) => {
    try {
      if (isConnected) {
        // autthenticating user
        let resp = await AuthenticateUser(true);
        if (resp.success) {
          // decoding token
          const decodedToken = jwt_decode(resp.token);

          if (decodedToken.dub.length) {
            await _fetchingAppData(isConnected);
            setProgress(false);

            // if token has wallet id
            //  navigation.replace('SecurityScreen');
            if (isDemo != undefined && isDemo == 'demo') {
              navigation.replace('SecurityScreen');
            } else {
              navigation.replace('MultiFactorScreen', {from: 'Login'});
            }
          } else {
            // if token has not wallet id
            // CREATING WALLET
            await createWallet(resp.token);
          }
        } else {
          setProgress(false);
          _showAlert('ZADA Wallet', resp.message);
        }
      } else {
        setProgress(false);
        showNetworkMessage();
      }
    } catch (error) {
      setProgress(false);
      _showAlert('Zada Wallet', error.toString());
    }
  };

  function renderPhoneNumberInput() {
    return (
      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        defaultCode="MM"
        layout="second"
        containerStyle={{
          flexDirection: 'row',
          backgroundColor: WHITE_COLOR,
          borderRadius: 10,
          height: 45,
          marginTop: 8,
          alignSelf: 'center',
          width: '88%',
          marginLeft: 4,
        }}
        textInputStyle={{fontSize: 14, height: 45}}
        countryPickerButtonStyle={{
          width: 65,
          borderRightColor: '00000040',
          borderRightWidth: 0.5,
        }}
        textContainerStyle={{
          fontSize: 16,
          padding: 0,
          borderRadius: 10,
          backgroundColor: WHITE_COLOR,
        }}
        codeTextStyle={{
          fontSize: 14,
          textAlign: 'center',
          textAlignVertical: 'center',
          padding: 0,
          margin: 0,
        }}
        onChangeFormattedText={(text) => {
          setPhone(text);
        }}
        onChangeText={(text) => {
          setPhoneText(text);
        }}
        disableArrowIcon
        withShadow
      />
    );
  }

  // KEYBOARD AVOIDING VIEW
  const keyboardVerticalOffset = Platform.OS == 'ios' ? 100 : 0;
  const keyboardBehaviour = Platform.OS == 'ios' ? 'padding' : null;

  return (
    <View
      pointerEvents={progress ? 'none' : 'auto'}
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
      }}>
      <KeyboardAwareScrollView
        behavior={keyboardBehaviour}
        keyboardVerticalOffset={keyboardVerticalOffset}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View
          style={{
            backgroundColor: BACKGROUND_COLOR,
            alignContent: 'center',
            width: width - 40,
            justifyContent: 'space-around',
            borderRadius: 10,
          }}>
          <View style={{marginLeft: 50, marginRight: 50}}>
            <HeadingComponent text="Let's Get Started!" />
          </View>

          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                selectionOnPress('register');
                setName('');
                setNameError('');
                setSecret('');
                setSecretError('');
                setPhone('');
              }}>
              <Image
                style={{
                  height: 50,
                  width: '50%',
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  tintColor: activeOption == 'register' ? GREEN_COLOR : 'grey',
                }}
                source={require('../assets/images/register.png')}
              />
              <Text
                style={{
                  width: 150,
                  height: 30,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  fontFamily: 'Poppins-Regular',
                  color: 'grey',
                }}>
                Register Account
              </Text>
              <View
                style={{
                  borderBottomColor:
                    activeOption == 'register' ? GREEN_COLOR : 'grey',
                  borderBottomWidth: 4,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                selectionOnPress('login');
                setName('');
                setNameError('');
                setSecret('');
                setSecretError('');
                setPhone('');
              }}>
              <Image
                onPress={() => {
                  selectionOnPress('login');
                }}
                style={{
                  height: 50,
                  width: 50,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  tintColor: activeOption == 'login' ? GREEN_COLOR : 'grey',
                }}
                source={require('../assets/images/already.png')}
              />
              <Text
                style={{
                  width: 150,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontFamily: 'Poppins-Regular',
                  height: 30,
                  color: 'grey',
                }}>
                Login
              </Text>
              <View
                style={{
                  borderBottomColor:
                    activeOption == 'login' ? GREEN_COLOR : 'grey',
                  borderBottomWidth: 4,
                }}
              />
            </TouchableOpacity>
          </View>
          {activeOption == 'register' && (
            <View>
              <View>
                <InputComponent
                  placeholderText="Full Name (Official Name)"
                  errorMessage={nameError}
                  value={name}
                  isSecureText={false}
                  inputContainerStyle={styles.inputView}
                  setStateValue={(text) => setName(text)}
                />
              </View>

              {renderPhoneNumberInput()}
              <Text style={styles.secretMessage}>
                Password (please save in safe place)
              </Text>
              <View>
                <InputComponent
                  type={'secret'}
                  toggleSecureEntry={_toggleSecureSecretEntry}
                  placeholderText="Password"
                  errorMessage={secretError}
                  value={secret}
                  keyboardType="default"
                  isSecureText={secureSecret}
                  autoCapitalize={'none'}
                  //inputContainerStyle={{width: '80%'}}
                  inputContainerStyle={styles.inputView}
                  strengthMessage={strengthMessage}
                  setStateValue={(text) => {
                    if (activeOption == 'register') {
                      setSecret(text.replace(',', ''));

                      const msg = validatePasswordStrength(text);
                      setStrengthMessage(msg);
                    }

                    if (text.length < 1) {
                      setSecretError('Password is required.');
                    } else {
                      setSecretError('');
                    }
                  }}
                />
              </View>

              <Text
                style={{
                  color: GRAY_COLOR,
                  fontFamily: 'Poppins-Regular',
                  marginLeft: 20,
                  fontSize: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 10,
                  marginRight: 20,
                }}>
                We need your details as your ZADA WALLET will be based on it. We
                are not going to send you ads or spam email, or sell your
                information to a 3rd party.
              </Text>
              <SimpleButton
                loaderColor={WHITE_COLOR}
                isLoading={progress}
                onPress={submit}
                width={250}
                title="Continue"
                titleColor={WHITE_COLOR}
                buttonColor={GREEN_COLOR}
                style={{marginVertical: 20, alignSelf: 'center'}}
              />
            </View>
          )}
          {activeOption == 'login' && (
            <View>
              {renderPhoneNumberInput()}

              <View>
                <InputComponent
                  type={'secret'}
                  toggleSecureEntry={_toggleSecureSecretEntry}
                  placeholderText="Password"
                  errorMessage={secretError}
                  value={secret}
                  keyboardType="default"
                  isSecureText={secureSecret}
                  autoCapitalize={'none'}
                  inputContainerStyle={styles.inputView}
                  setStateValue={(text) => {
                    setSecret(text.replace(',', ''));
                    if (text.length < 1) {
                      setSecretError('Password is required.');
                    } else {
                      setSecretError('');
                    }
                  }}
                />
              </View>
              <Text
                onPress={() => {
                  navigation.navigate('ForgotPasswordScreen');
                }}
                style={styles._forgotText}>
                Forgot password?
              </Text>

              <SimpleButton
                loaderColor={WHITE_COLOR}
                isLoading={progress}
                onPress={submit}
                width={250}
                title="Continue"
                titleColor={WHITE_COLOR}
                buttonColor={GREEN_COLOR}
                style={{marginVertical: 20, alignSelf: 'center'}}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    width: '94%',
    marginLeft: 10,
    height: 45,
    marginTop: 8,
    paddingLeft: 16,
    borderBottomWidth: 0,
  },
  _forgotText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: PRIMARY_COLOR,
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 5,
  },
  secretMessage: {
    marginTop: 15,
    marginLeft: 24,
    color: 'grey',
  },
  SecretTextInput: {
    textAlign: 'center',
    height: 80,
    flex: 5,
    padding: 5,
    marginLeft: 5,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 5,
  },
  TextContainerHead: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    fontSize: 32,
  },
  ErrorBox: {
    color: 'red',
    fontSize: 13,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    color: PRIMARY_COLOR,
  },
  checkbox: {
    paddingTop: '2%',
    color: PRIMARY_COLOR,
  },
  linkText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontStyle: 'italic',
    margin: 5,
  },
  link: {
    color: 'black',
    fontSize: 14,
    marginBottom: 20,
  },
  primaryButton: {
    alignSelf: 'center',
    borderColor: GREEN_COLOR,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: GREEN_COLOR,
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 10,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 25,
    width: 250,
  },
  text: {
    color: WHITE_COLOR,
    alignSelf: 'center',
    fontFamily: 'Merriweather-Bold',
  },
  headerContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRightIcon: {
    alignSelf: 'center',
    color: GRAY_COLOR,
    position: 'absolute',
    right: '10%',
    top: '30%',
  },
});

export default RegistrationModule;
