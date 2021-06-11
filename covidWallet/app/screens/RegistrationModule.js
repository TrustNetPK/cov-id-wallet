import React, {useState} from 'react';
import randomWords from 'random-words';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  Clipboard,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
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
import {StackActions} from '@react-navigation/native';
import ConstantsList from '../helpers/ConfigApp';
import NetInfo from '@react-native-community/netinfo';

const {height, width} = Dimensions.get('window');

function RegistrationModule({navigation}) {
  const [activeOption, updateActiveOption] = useState('register');
  const [networkState, setNetworkState] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [secret, setSecret] = useState('');
  const [progress, setProgress] = useState(false);

  const selectionOnPress = userType => {
    updateActiveOption(userType);
  };
  const copyToClipboard = () => {
    Clipboard.setString(secret);
    ToastAndroid.show(
      'Secret Phrase is copied to clipboard.',
      ToastAndroid.SHORT,
    );
  };
  React.useEffect(() => {
    NetInfo.fetch().then(networkState => {
      setNetworkState(networkState.isConnected);
    });
    if (activeOption == 'register')
      setSecret(
        randomWords(12)
          .toString()
          .replace(/,/g, ' '),
      );
  }, [activeOption, networkState]);

  const nextHandler = () => {
    navigation.dispatch({
      index: 0,
      actions: [StackActions.replace({routeName: 'MultiFactorScreen'})],
    });
  };

  const submit = () => {
    if (
      activeOption == 'register' &&
      (name == '' || phone == '' || email == '' || secret == '')
    ) {
      ToastAndroid.show('Fill the empty fields', ToastAndroid.SHORT);
      return;
    }
    if (
      activeOption == 'login' &&
      (phone == '' || email == '' || secret == '')
    ) {
      ToastAndroid.show('Fill the empty fields', ToastAndroid.SHORT);
      return;
    } else {
      setProgress(true);
      if (activeOption == 'register') register();
      else if (activeOption == 'login') login();
      else setProgress(false);
    }
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
          email: email,
          phone: phone,
          secretPhrase: secret,
        }),
      }).then(credsResult =>
        credsResult.json().then(data => {
          try {
            console.log(JSON.stringify(data));
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              navigation.replace('MultiFactorScreen');
            } else {
              ToastAndroid.show(response.error, ToastAndroid.SHORT);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setProgress(false);
          }
        }),
      );
    } else {
      ToastAndroid.show(
        'Internet Connection is not available',
        ToastAndroid.LONG,
      );
    }
  };

  const storeUserID = async userId => {
    try {
      await AsyncStorage.setItem(ConstantsList.USER_ID, userId);
    } catch (error) {
      console.log(error);
    }
  };
  const storeUserToken = async userToken => {
    try {
      console.log(userToken);
      await AsyncStorage.setItem(ConstantsList.USER_TOKEN, userToken);
    } catch (error) {
      console.log(error);
    }
  };
  const AuthenticateUser = async userId => {
    if (networkState) {
      await fetch(ConstantsList.BASE_URL + `/api/authenticate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          secretPhrase: secret,
        }),
      }).then(credsResult =>
        credsResult.json().then(data => {
          try {
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              storeUserToken(response.token);
              navigation.replace('SecurityScreen');
            } else {
              ToastAndroid.show(response.error, ToastAndroid.SHORT);
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
      ToastAndroid.show(
        'Internet Connection is not available',
        ToastAndroid.LONG,
      );
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
          email: email,
          phone: phone,
          secretPhrase: secret,
        }),
      }).then(credsResult =>
        credsResult.json().then(data => {
          try {
            console.log(JSON.stringify(data));
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              storeUserID(response.userId);
              AuthenticateUser(response.userId);
            } else {
              ToastAndroid.show(response.error, ToastAndroid.SHORT);
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
      ToastAndroid.show(
        'Internet Connection is not available',
        ToastAndroid.LONG,
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
      }}>
      <ScrollView
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
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Name"
                    keyboardType="name-phone-pad"
                    onChangeText={name => {
                      setName(name);
                    }}
                  />
                </View>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={email => {
                      setEmail(email);
                    }}
                  />
                </View>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                    onChangeText={phone => {
                      setPhone(phone);
                    }}
                  />
                </View>
                <Text style={styles.secretMessage}>
                  Secret phrase (please save in safe place)
                </Text>
                <View
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
                    onChangeText={text => setText(text.replace(',', ''))}
                    defaultValue={secret}
                    multiline={true}
                    editable={false}
                    onChangeText={secret => {
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
                  We need your details as you ZADA WALLET will be based on it.
                  We are not going to send you ads or spam email, or sell your
                  information to a 3rd party.
                </Text>
                {progress ? (
                  <ActivityIndicator
                    style={styles.primaryButton}
                    size="large"
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
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={email => {
                      setEmail(email);
                    }}
                  />
                </View>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                    onChangeText={phone => {
                      setPhone(phone);
                    }}
                  />
                </View>
                <Text style={styles.secretMessage}>Secret phrase</Text>
                <View
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
                    keyboardType="name-phone-pad"
                    onChangeText={secretPhrase => {
                      setSecret(secretPhrase);
                    }}
                    multiline={true}
                  />
                </View>
                {progress ? (
                  <ActivityIndicator
                    style={styles.primaryButton}
                    size="large"
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    width: '94%',
    height: 45,
    marginLeft: 10,
    marginTop: 8,
  },
  secretMessage: {
    marginLeft: 15,
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
    padding: 5,
    color: GRAY_COLOR,
  },
});

export default RegistrationModule;
