import React, { useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PhoneInput from "react-native-phone-number-input";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
  GREEN_COLOR,
  WHITE_COLOR,
  GRAY_COLOR,
} from '../theme/Colors';
import HeadingComponent from '../components/HeadingComponent';
import { StackActions } from '@react-navigation/native';
import ConstantsList from '../helpers/ConfigApp';
import NetInfo from '@react-native-community/netinfo';
import { saveItem } from '../helpers/Storage';
import randomString from '../helpers/RandomString';
import { showMessage } from '../helpers/Toast';
import { AuthenticateUser } from '../helpers/Authenticate';
import { InputComponent } from '../components/Input/inputComponent';
import { emailRegex, nameRegex, validateIfLowerCased } from '../helpers/validation';

const { height, width } = Dimensions.get('window');

function RegistrationModule({ navigation }) {
  const [activeOption, updateActiveOption] = useState('register');
  const [networkState, setNetworkState] = useState(false);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const phoneInput = useRef(null);
  const [phone, setPhone] = useState('');


  const [secret, setSecret] = useState('');
  const [secretError, setSecretError] = useState('');
  const [secureSecret, setSecureSecret] = useState(true);
  

  const [progress, setProgress] = useState(false);

  // Toggling for password 
  const _toggleSecureSecretEntry = () => {
    setSecureSecret(!secureSecret);
  }

  const selectionOnPress = (userType) => {
    updateActiveOption(userType);
  };
  const copyToClipboard = () => {
    Clipboard.setString(secret);
    showMessage('ZADA Wallet', 'Secret Phrase is copied to clipboard.');
  };
  React.useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
    if (activeOption == 'register') {
      setPhone('');
      // setSecret(randomString(24))
      setSecretError('')
    } else {
      setSecret('');
    }
  }, [activeOption, networkState]);

  const nextHandler = () => {
    navigation.dispatch({
      index: 0,
      actions: [StackActions.replace({ routeName: 'MultiFactorScreen' })],
    });
  };

  const submit = () => {

    // Check if name is valid.
    if (!nameRegex.test(name) && activeOption == 'register') {
      setNameError("Please enter a name between 2-20 alphabetical characters long. No numbers or special characters.")
      return
    }
    setNameError('');

    // Check if email is valid
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setEmailError('');

    // Check if phone number is valid
    const checkValid = phoneInput.current?.isValidNumber(phone);
    if (!checkValid) {
      Alert.alert('Zada', 'Please enter a valid phone number.');
      return
    }

    // Check if secret 
    if (secret == "") {
      setSecretError('Secret is required.')
      return
    }

    if (!validateIfLowerCased(secret)) {
      setSecretError('Secret must be in lowercase.')
      return
    }

    setSecretError('');

    setProgress(true);
    if (activeOption == 'register') register();
    else if (activeOption == 'login') login();
    else setProgress(false);

  };

  const register = async () => {
    if (networkState) {
      await fetch(ConstantsList.BASE_URL + `/api/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email.toLocaleLowerCase(),
          phone: phone,
          secretPhrase: secret,
        }),
      }).then((registerResult) =>
        registerResult.json().then((data) => {
          try {
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              saveItem(ConstantsList.WALLET_SECRET, secret).then(() => {
                navigation.replace('MultiFactorScreen');
              });
            } else {
              showMessage('ZADA Wallet', response.error);
              setProgress(false);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setProgress(false);
          }
        }),
      );
    } else {
      showMessage('ZADA Wallet', 'Internet Connection is not available');
    }
  };

  const storeUserID = async (userId) => {
    try {
      await AsyncStorage.setItem(ConstantsList.USER_ID, userId);
    } catch (error) {
      console.log(error.message);
    }
  };
  const authenticateUserToken = async () => {
    if (networkState) {
      let resp = await AuthenticateUser();
      setProgress(false);
      if (resp.success) {
        navigation.replace('SecurityScreen');
      } else {
        showMessage('ZADA Wallet', resp.message);
      }
    } else {
      setProgress(false);
      showMessage('ZADA Wallet', 'Internet Connection is not available');
    }
  };

  const login = async () => {
    if (networkState) {
      await fetch(ConstantsList.BASE_URL + `/api/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLocaleLowerCase(),
          phone: phone,
          secretPhrase: secret,
        }),
      }).then((credsResult) =>
        credsResult.json().then((data) => {
          try {
            console.log(JSON.stringify(data));
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              storeUserID(response.userId);
              saveItem(ConstantsList.WALLET_SECRET, secret);
              authenticateUserToken();
            } else {
              showMessage('ZADA Wallet', response.error);
              setProgress(false);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setProgress(false);
          }
        }),
      );
    } else {
      setProgress(false);
      showMessage('ZADA Wallet', 'Internet Connection is not available');
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
          flexDirection: "row",
          backgroundColor: WHITE_COLOR,
          borderRadius: 10,
          height: 45,
          marginTop: 8,
          alignSelf: "center",
          width: '88%',
          marginLeft: 4,
        }}
        textInputStyle={{ fontSize: 14, height: 45 }}
        countryPickerButtonStyle={{ width: 65, borderRightColor: "00000040", borderRightWidth: 0.5 }}
        textContainerStyle={{ fontSize: 16, padding: 0, borderRadius: 10, backgroundColor: WHITE_COLOR }}
        codeTextStyle={{ fontSize: 14, textAlign: "center", textAlignVertical: "center", padding: 0, margin: 0 }}
        onChangeText={(text) => {
          // setPhone(text);
        }}
        onChangeFormattedText={(text) => {
          // console.log(text);
          setPhone(text);
        }}
        disableArrowIcon
        withShadow
      />
    )

  }

  return (
    <View
      pointerEvents={progress ? "none" : "auto"}
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View
          style={{
            backgroundColor: BACKGROUND_COLOR,
            alignContent: 'center',
            width: width - 40,
            justifyContent: 'space-around',
            borderRadius: 10,
          }}>
          <View style={{ marginLeft: 50, marginRight: 50 }}>
            <HeadingComponent text="Let's Get Started!" />
          </View>

          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                selectionOnPress('register');
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
              <ScrollView showsVerticalScrollIndicator={true}>
                <View >
                  <InputComponent
                    placeholderText="Name"
                    errorMessage={nameError}
                    value={name}
                    isSecureText={false}
                    inputContainerStyle={styles.inputView}
                    setStateValue={(text) => setName(text)}
                  />
                  {/* <TextInput
                    style={styles.TextInput}
                    placeholder="Name"
                    keyboardType="default"
                    placeholderTextColor="grey"
                    onChangeText={(name) => {
                      setName(name);
                    }}
                  /> */}
                </View>
                <View>
                  <InputComponent
                    placeholderText="Email"
                    errorMessage={emailError}
                    value={email}
                    keyboardType="email-address"
                    isSecureText={false}
                    autoCapitalize={'none'}
                    inputContainerStyle={styles.inputView}
                    setStateValue={(text) => setEmail(text)}
                  />
                  {/* <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor="grey"
                    onChangeText={(email) => {
                      setEmail(email);
                    }}
                  /> */}
                </View>
                {renderPhoneNumberInput()}
                {/* <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                    placeholderTextColor="grey"
                    onChangeText={(phone) => {
                      setPhone(phone);
                    }}
                  />
                </View> */}
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
                    inputContainerStyle={{ width: '80%' }}
                    inputContainerStyle={styles.inputView}
                    setStateValue={(text) => {
                      setSecret(text.replace(',', ''))
                      if (text.length < 1) {
                        setSecretError('Secret is required.')
                      } else {
                        setSecretError('')
                      }
                    }}
                  />
                  {/* {
                    secretError == "" &&
                    <FontAwesome
                      style={{ height: 50, zIndex: 10 }}
                      onPress={() => setSecureSecret(!secureSecret)}
                      style={styles.textRightIcon}
                      name={secureSecret ? "eye-slash" : "eye"}
                      size={25}
                    />
                  } */}
                </View>
                {/* <View
                  style={{
                    backgroundColor: WHITE_COLOR,
                    borderRadius: 10,
                    width: '94%',
                    height: 65,
                    flexDirection: 'row',
                    marginLeft: 10,
                    marginTop: 8,
                  }}>
                  <TextInput
                    style={styles.SecretTextInput}
                    placeholder="Secret Phrase"
                    onChangeText={(text) => setText(text.replace(',', ''))}
                    defaultValue={secret}
                    multiline={true}
                    editable={false}
                    onChangeText={(secret) => {
                      setSecret(secret);
                    }}
                  />
                  <FontAwesome
                    style={{flex: 1}}
                    onPress={() => copyToClipboard()}
                    style={styles.textRightIcon}
                    name="copy"
                    size={25}
                  />
                </View> */}

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
                  We need your details as your ZADA WALLET will be based on it.
                  We are not going to send you ads or spam email, or sell your
                  information to a 3rd party.
                </Text>
                {progress ? (
                  <ActivityIndicator
                    style={styles.primaryButton}
                    size="small"
                    color={WHITE_COLOR}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={submit}>
                    <Text style={styles.text}>CONTINUE</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
          {activeOption == 'login' && (
            <View>
              <ScrollView showsVerticalScrollIndicator={true}>
                <View>
                  <InputComponent
                    placeholderText="Email"
                    errorMessage={emailError}
                    value={email}
                    autoCapitalize={'none'}
                    keyboardType="email-address"
                    isSecureText={false}
                    inputContainerStyle={styles.inputView}
                    setStateValue={(text) => setEmail(text)}
                  />
                </View>
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
                      setSecret(text.replace(',', ''))
                      if (text.length < 1) {
                        setSecretError('Secret is required.')
                      } else {
                        setSecretError('')
                      }
                    }}
                  />
                </View>

                {progress ? (
                  <ActivityIndicator
                    style={styles.primaryButton}
                    size="small"
                    color={WHITE_COLOR}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={submit}>
                    <Text style={styles.text}>CONTINUE</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
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
    // padding: 8,
    color: GRAY_COLOR,
    position: "absolute",
    right: '10%',
    top: '30%'
  },
});

export default RegistrationModule;
