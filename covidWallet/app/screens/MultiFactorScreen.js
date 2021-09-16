import React, { useLayoutEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAvoidingView } from 'react-native';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
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
} from '../theme/Colors';
import HeadingComponent from '../components/HeadingComponent';
import ConstantsList from '../helpers/ConfigApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveItem, getItem } from '../helpers/Storage';
import { showMessage, _showAlert } from '../helpers/Toast';
import { AuthenticateUser } from '../helpers/Authenticate'
import { validateOTP, _resendOTPAPI } from '../gateways/auth';
import SimpleButton from '../components/Buttons/SimpleButton';

const { height, width } = Dimensions.get('window');

function MultiFactorScreen({ navigation }) {
  const [phoneConfirmationCode, setPhoneConfirmationCode] = useState('');
  const [networkState, setNetworkState] = useState(false);
  const [progress, setProgress] = useState(false);
  const [isAuthenticated, setAuthentication] = useState(false);
  const [isWalletCreated, setWallet] = useState(false);
  const [userData, setUserData] = useState(null);

  // Countdown
  const [phoneMins, setPhoneMins] = useState(1);
  const [phoneSecs, setPhoneSecs] = useState(59);
  const [phoneTimeout, setPhoneTimeout] = useState(false);

  const [phoneCodeLoading, setPhoneCodeLoading] = useState(false);

  // Effect to check network connection
  React.useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
  }, [networkState]);

  // Effect for phone code countdown
  React.useEffect(()=>{
    let interval = setInterval(() => {
      let tempSec = phoneSecs - 1;
      if(tempSec <= 0 && phoneMins > 0){
        setPhoneSecs(59);
        setPhoneMins(phoneMins - 1);
      }
      else if(tempSec <= 0 && phoneMins == 0){
        setPhoneSecs(0);
        setPhoneMins(0);
        clearInterval(interval);
        setPhoneTimeout(true);
      }
      else{
        setPhoneSecs(tempSec);
      }
    }, 1000) //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval)
  })

  const submit = () => {
    if (
      phoneConfirmationCode == '' 
      //|| emailConfirmationCode == '' 
    ) {
      showMessage('ZADA Wallet', 'Fill the empty fields');
    } else {
      setProgress(true);
      validate();
    }
  };

  const validate = async () => {
    try {
      if (networkState) {
        //let result = await validateOTP(phoneConfirmationCode, emailConfirmationCode, userData.userId);
        let result = await validateOTP(phoneConfirmationCode, userData.userId);
  
        if (result.data.success) {
          await saveItem(ConstantsList.USER_ID, result.data.userId);
          await authenticateUser();
        } 
        else {
          showMessage('ZADA Wallet', result.data.error);
        }
      } else {
        showMessage('ZADA Wallet', 'Internet Connection is not available')
      }
      setProgress(false);
    } catch (error) {
      setProgress(false);
      _showAlert('Zada Wallet', error.toString());
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

  // Funcion to resend phone code
  const _reSendPhoneCode = async () => {
    try {
      setPhoneCodeLoading(true);
      const result = await _resendOTPAPI(userData.userId, 'phone');
      if(result.data.success){
        setPhoneTimeout(false);
        setPhoneMins(1);
        setPhoneSecs(59);
      }
      else{
        _showAlert("Zada Wallet", result.data.error.toString());
      } 
      setPhoneCodeLoading(false);
    } catch (error) {
      setPhoneCodeLoading(false);
      _showAlert("Zada Wallet", error.toString());
    }
  }

  // Function to get registeration data of user
  const _getRegisterUserInfo = async () => {
    const regData = JSON.parse(await getItem(ConstantsList.REGISTRATION_DATA));

    // sending phone OTP
    _resendOTPAPI(regData.userId, 'phone');
   
     // sending email OTP
    _resendOTPAPI(regData.userId, 'email');

    setUserData(regData);
  }

  useLayoutEffect(()=>{
    _getRegisterUserInfo();
  },[])

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
                  We have sent confirmation code to your
                  phone. Please input it below.
                </Text>
                <View>
                  <ScrollView showsVerticalScrollIndicator={true}>
                    
                    {/* Phone Confirmation Code */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
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
                      {
                        phoneTimeout ? (
                            !phoneCodeLoading ? (
                              <Text onPress={_reSendPhoneCode} style={styles._expireText}>Send Again</Text>
                            ):(
                              <ActivityIndicator 
                                color={PRIMARY_COLOR}
                                size={'small'}
                                style={{
                                  marginLeft: 30,
                                }}
                              />
                            )
                          ):(
                            <Text style={styles._countdown}>{('0' + phoneMins).slice(-2)} : {('0' + phoneSecs).slice(-2)}</Text>
                          )
                      }
                    </View>

                    {/* Email Confirmation Code */}
                    {/* <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
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
                        emailTimeout ? (
                          !emailCodeLoading ? (
                            <Text onPress={_reSendEmailCode} style={styles._expireText}>Send Again</Text>
                          ):(
                            <ActivityIndicator 
                              color={PRIMARY_COLOR}
                              size={'small'}
                              style={{
                                marginLeft: 30,
                              }}
                            />
                          )
                          ):(
                            <Text style={styles._countdown}>{('0' + emailMins).slice(-2)} : {('0' + emailSecs).slice(-2)}</Text>
                          )
                      }
                    </View> */}

                    <Text style={styles.textView}>
                      Please wait until 2 minutes for the code. If you will not receive then you will be able to resend it
                    </Text>
                    
                    {/* <View style={styles.inputView}>
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
                    } */}
                    

                    {/* <Text style={styles.textView}>
                      And the password you saved in previous phrase step.
                    </Text>
                    <Text style={styles.secretMessage}>Your Password</Text>

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
                    </Text> */}
                    
                    {/* <TouchableOpacity style={styles.borderButton}>
                    <Text style={styles.borderText}>RESEND EMAIL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.borderButton}>
                    <Text style={styles.borderText}>RESEND SMS</Text>
                  </TouchableOpacity> */}
                    <SimpleButton 
                      loaderColor={WHITE_COLOR}
                      isLoading={progress}
                      width={250}
                      onPress={()=>{
                        submit()
                      }}
                      title='Continue'
                      titleColor={WHITE_COLOR}
                      buttonColor={GREEN_COLOR}
                      style={{
                        alignSelf: 'center',
                        marginVertical: 20,
                      }}
                    />
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
    width: '65%',
    height: 45,
    marginLeft: 10,
    marginTop: 8,
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
    marginLeft: 25,
    marginTop: 10,
  },
  _expireText:{
    marginTop: 10,
    color: PRIMARY_COLOR,
    marginLeft: 15,
    textDecorationLine: 'underline'
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
