import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
  GREEN_COLOR,
  WHITE_COLOR,
  GRAY_COLOR,
  BLACK_COLOR,
} from '../theme/Colors';
import HeadingComponent from '../components/HeadingComponent';

const {height, width} = Dimensions.get('window');

function MultiFactorScreen({route, navigation}) {
  const nextHandler = () => {
    navigation.navigate('SecurityScreen');
  };
  React.useEffect(() => {
    SplashScreen.hide();
  });
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
            marginTop: height / 20,
            marginBottom: height / 20,
            justifyContent: 'space-around',
            borderRadius: 10,
          }}>
          <View style={{marginLeft: 30, marginRight: 30}}>
            <HeadingComponent text="Multi Factor Authentication to keep you safe!" />
          </View>
          <Text style={styles.textView}>
            We have sent confirmation code to both of your email and your phone.
            Please input them below.
          </Text>
          <View>
            <ScrollView showsVerticalScrollIndicator={true}>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Phone Confirmation Code"
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Email Confirmation Code"
                />
              </View>
              <Text style={styles.textView}>
                And the secret phrase you saved in previous phrase step.
              </Text>
              <Text style={styles.secretMessage}>Your Secret phrase</Text>
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
              <Text style={styles.textView}>
                The code expires in 5 minutes - tap 'Resend' if you need another
                one
              </Text>
              <TouchableOpacity style={styles.borderButton}>
                <Text style={styles.borderText}>RESEND EMAIL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.borderButton}>
                <Text style={styles.borderText}>RESEND SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={nextHandler}>
                <Text style={styles.text}>CONTINUE</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
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
});
export default MultiFactorScreen;
