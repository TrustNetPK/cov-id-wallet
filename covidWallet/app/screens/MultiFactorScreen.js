import React, { useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAvoidingView } from 'react-native';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
  GREEN_COLOR,
  WHITE_COLOR,
  GRAY_COLOR,
  BLACK_COLOR,
  RED_COLOR,
} from '../theme/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HeadingComponent from '../components/HeadingComponent';
import ConstantsList from '../helpers/ConfigApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveItem, getItem } from '../helpers/Storage';
import { showMessage } from '../helpers/Toast';
import { AuthenticateUser } from '../helpers/Authenticate'
import { validateOTP } from '../gateways/auth';

const { height, width } = Dimensions.get('window');

function MultiFactorScreen({ route, navigation }) {
  const [emailConfirmationCode, setEmailConfirmationCode] = useState('');
  const [phoneConfirmationCode, setPhoneConfirmationCode] = useState('');
  const [networkState, setNetworkState] = useState(false);
  const [secret, setSecret] = useState('');
  const [secureSecret, setSecureSecret] = useState(true);
  const [progress, setProgress] = useState(false);
  const [isAuthenticated, setAuthentication] = useState(false);
  const [isWalletCreated, setWallet] = useState(false);

  // Countdown
  const [minutes, setMinutes] = useState(4);
  const [seconds, setSeconds] = useState(59);
  const [timeout, setTimeout] = useState(false);

  // Toggling for password 
  const _toggleSecureSecretEntry = () => {
    setSecureSecret(!secureSecret);
  }
  
  React.useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
  }, [networkState]);

  React.useEffect(()=>{
    let interval = setInterval(() => {
      let tempSec = seconds-1;
      if(tempSec <= 0 && minutes > 0){
        setSeconds(59);
        setMinutes(minutes - 1);
      }
      else if(tempSec <= 0 && minutes == 0){
        setSeconds(0);
        setMinutes(0);
        clearInterval(interval);
        setTimeout(true);
      }
      else{
        setSeconds(tempSec);
      }
    }, 1000) //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval)
  })

  const submit = () => {
    if (
      phoneConfirmationCode == '' ||
      emailConfirmationCode == '' ||
      secret == ''
    ) {
      showMessage('ZADA Wallet', 'Fill the empty fields');
    } else {
      setProgress(true);
      validate();
    }
  };

  const validate = async () => {
    if (networkState) {
      let walletSecret = await getItem(ConstantsList.WALLET_SECRET);
      if (walletSecret !== secret) {
        showMessage('ZADA Wallet', 'Your wallet secret is mismatching, Please try again!');
      } else {

        // Validate OTP Api call.
        try {
          let result = await validateOTP(phoneConfirmationCode, emailConfirmationCode, secret);

          if (result.data.success) {
            await saveItem(ConstantsList.USER_ID, result.data.userId)
            await authenticateUser();
          } else {
            showMessage('ZADA Wallet', result.data.error);
          }

        } catch (e) {
          console.log(e)
        }
      }
      setProgress(false);
    } else {
      showMessage('ZADA Wallet', 'Internet Connection is not available')
    }
  };

  const reNewAuthenticationToken = async () => {
    if (networkState) {
      setAuthentication(true);
      let resp = await AuthenticateUser(true);
      if (resp.success) {

        // Put User isFirsTime Logic here as well
        await AsyncStorage.setItem('isfirstTime', 'false');

        navigation.replace('SecurityScreen');
        setProgress(false);
      } else {
        showMessage('ZADA Wallet', resp.message);
        setProgress(false);
      }
    } else {
      showMessage('ZADA Wallet', 'Internet Connection is not available');
      setProgress(false);
    }
  };

  const authenticateUser = async () => {
    if (networkState) {
      setAuthentication(true);
      let resp = await AuthenticateUser();
      if (resp.success) {
        createWallet(resp.token);
        setProgress(false);
      } else {
        showMessage('ZADA Wallet', resp.message);
        setAuthentication(false);
        setProgress(false);
      }
    } else {
      showMessage('ZADA Wallet', 'Internet Connection is not available')
      setAuthentication(false);
    }
  };

  const createWallet = async (userToken) => {
    if (networkState) {
      await fetch(ConstantsList.BASE_URL + `/api/wallet/create`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      }).then((walletResult) =>
        walletResult.json().then((data) => {
          try {
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              setWallet(true);
              reNewAuthenticationToken();
            } else {
              showMessage('ZADA Wallet', response.error)
            }
          } catch (error) {
            console.error(error);
          } finally {
            setProgress(false);
          }
        }),
      );
    } else {
      showMessage('ZADA Wallet', 'Internet Connection is not available')
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
      }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View
            style={{
              backgroundColor: BACKGROUND_COLOR,
              alignContent: 'center',
              width: width - 40,
              marginTop: height / 20,
              marginBottom: height / 20,
              justifyContent: 'space-around',
              borderRadius: 10,
            }}>
            {isWalletCreated || isAuthenticated ? (
              <>
                <View style={{ marginLeft: 30, marginRight: 30 }}>
                  <HeadingComponent text="We're getting things ready!" />
                </View>
                <Text style={styles.textView}>Thanks for your patience</Text>
                <ActivityIndicator
                  style={styles.progressView}
                  size="small"
                  color={PRIMARY_COLOR}
                />
                {isAuthenticated ? (
                  <Text style={styles.opTextView}>Authenticating User...</Text>
                ) : (
                  <Text style={styles.optextView}>Creating Wallet...</Text>
                )}
              </>
            ) : (
              <>
                <View style={{ marginLeft: 30, marginRight: 30 }}>
                  <HeadingComponent text="Multi Factor Authentication to keep you safe!" />
                </View>
                <Text style={styles.textView}>
                  We have sent confirmation code to both of your email and your
                  phone. Please input them below.
                </Text>
                <View>
                  <ScrollView showsVerticalScrollIndicator={true}>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.TextInput}
                        placeholder="Phone Confirmation Code"
                        placeholderTextColor="grey"
                        keyboardType="number-pad"
                        onChangeText={(confirmationCode) => {
                          setPhoneConfirmationCode(confirmationCode);
                        }}
                      />
                    </View>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.TextInput}
                        placeholderTextColor="grey"
                        placeholder="Email Confirmation Code"
                        keyboardType="number-pad"
                        onChangeText={(confirmationCode) => {
                          setEmailConfirmationCode(confirmationCode);
                        }}
                      />
                    </View>
                    {
                      timeout ? (
                        <Text style={styles._expireText}>Code(s) have expired, go back and try again!</Text>
                      ):(
                        <View style={styles._countdownView}>
                          <Text style={styles._countdown}>Code(s) expires in</Text>
                          <Text style={styles._countdown}>{('0' + minutes).slice(-2)} : {('0' + seconds).slice(-2)}</Text>
                        </View>
                      )
                    }
                    

                    <Text style={styles.textView}>
                      And the secret phrase you saved in previous phrase step.
                    </Text>
                    <Text style={styles.secretMessage}>Your Secret phrase</Text>

                    <View
                      style={[styles.inputView, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                      <TextInput
                        style={[styles.TextInput,{ marginRight: 4 }]}
                        placeholderTextColor="grey"
                        placeholder="Password"
                        secureTextEntry={secureSecret}
                        multiline={false}
                        autoCapitalize={"none"}
                        keyboardType="name-phone-pad"
                        onChangeText={(secretPhrase) => {
                          setSecret(secretPhrase);
                        }}
                      />
                      <FontAwesome
                        onPress={_toggleSecureSecretEntry}
                        name={secureSecret ? "eye-slash" : "eye"}
                        size={25}
                        color={GRAY_COLOR}
                        style={{
                          marginRight: 8,
                        }}
                      />
                    </View>
                    
                    <Text style={styles.textView}>
                      The code expires in 5 minutes - Go back to retry again in case code expires.
                    </Text>
                    {/* <TouchableOpacity style={styles.borderButton}>
                    <Text style={styles.borderText}>RESEND EMAIL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.borderButton}>
                    <Text style={styles.borderText}>RESEND SMS</Text>
                  </TouchableOpacity> */}
                    {progress ? (
                      <ActivityIndicator
                        style={styles.primaryButton}
                        size="small"
                        color={WHITE_COLOR}
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={()=>{
                          if(timeout)
                            navigation.goBack();
                          else
                            submit()
                        }}>
                        <Text style={styles.text}>{timeout ? "GO BACK" : "CONTINUE"}</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  _countdownView:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  _countdown:{
    color: PRIMARY_COLOR,
  },
  _expireText:{
    marginTop: 10,
    color: RED_COLOR,
    marginHorizontal: 16,
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
  _resendButton:{
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
    width: 150,
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
  textView: {
    color: GRAY_COLOR,
    fontFamily: 'Poppins-Regular',
    marginLeft: 20,
    fontSize: 12,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginRight: 20,
  },
  borderButton: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: BLACK_COLOR,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 5,
    paddingLeft: 20,
    paddingBottom: 5,
    paddingRight: 20,
    marginTop: 10,
  },
  borderText: {
    fontFamily: 'Poppins-Bold',
    color: BLACK_COLOR,
  },
  progressView: {
    marginTop: 5,
    marginBottom: 10,
    paddingTop: 5,
    paddingLeft: 20,
    paddingBottom: 5,
    paddingRight: 20,
  },
  opTextView: {
    fontFamily: 'Poppins-Bold',
    color: BLACK_COLOR,
    marginBottom: 20,
    fontSize: 12,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
export default MultiFactorScreen;
