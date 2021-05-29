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
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
  GREEN_COLOR,
  WHITE_COLOR,
  GRAY_COLOR,
} from '../theme/Colors';
import HeadingComponent from '../components/HeadingComponent';

const {height, width} = Dimensions.get('window');

function RegistrationModule({navigation}) {
  const [activeOption, updateActiveOption] = useState('register');
  const [text, setText] = useState('');
  const selectionOnPress = userType => {
    updateActiveOption(userType);
  };
  const copyToClipboard = () => {
    Clipboard.setString(text);
    ToastAndroid.show('Secret Key is copied to clipboard.', ToastAndroid.SHORT);
  };
  React.useEffect(() => {
    if (activeOption == 'register')
      setText(
        randomWords(12)
          .toString()
          .replace(/,/g, ' '),
      );
  }, [activeOption]);
  const nextHandler = () => {
    navigation.navigate('MultiFactorScreen');
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
                  />
                </View>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Phone"
                    keyboardType="phone-pad"
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
                    defaultValue={text}
                    multiline={true}
                    editable={false}
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
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={nextHandler}>
                  <Text style={styles.text}>CONTINUE</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
          {activeOption == 'login' && (
            <View>
              <ScrollView showsVerticalScrollIndicator={true}>
                <View style={styles.inputView}>
                  <TextInput style={styles.TextInput} placeholder="Name" />
                </View>
                <View style={styles.inputView}>
                  <TextInput style={styles.TextInput} placeholder="Email" />
                </View>
                <View style={styles.inputView}>
                  <TextInput style={styles.TextInput} placeholder="Phone" />
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
                    multiline={true}
                  />
                </View>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={nextHandler}>
                  <Text style={styles.text}>CONTINUE</Text>
                </TouchableOpacity>
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
