import * as React from 'react';
import {
  View,
  Text,
  Linking,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
  GREEN_COLOR,
  WHITE_COLOR,
} from '../theme/Colors';

import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';

const img = require('../assets/images/t&c.png');

function WelcomeScreen({navigation}) {
  const nextHandler = () => {
    navigation.navigate('RegistrationScreen');
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PRIMARY_COLOR,
      }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          flexGrow: 0,
        }}
        contentContainerStyle={{
          // flex: 1,
          backgroundColor: BACKGROUND_COLOR,
          alignContent: 'center',
          // margin: 30,
          marginLeft: 25,
          marginRight: 25,
          // marginTop: 150,
          // marginBottom: 150,
          borderRadius: 10,
        }}>
        <View
          style={{
            // height: 400,
            paddingBottom: 8,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
          <View style={{marginTop: 20, marginLeft: 25, marginRight: 25}}>
            <HeadingComponent text="ZADA is your Digital ID Wallet!" />
          </View>
          <TextComponent
            onboarding={true}
            text="Securely prove who you are and only share the information you want."
          />
          <View style={{paddingTop: 10}} />
          <TextComponent
            onboarding={true}
            text="All certificates and IDs safely stored on your phone, where only you can access them."
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Merriweather-Bold',
                paddingTop: 30,
              }}>
              We protect your privacy and data.
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Regular',
                marginLeft: 20,
                fontSize: 12,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginRight: 20,
              }}>
              By continuing below you confirm that you have read and agree to
              &nbsp;
              <Text
                style={{color: PRIMARY_COLOR}}
                onPress={() => {
                  Linking.openURL('https://zada.io/privacy-policy/');
                }}>
                ZADA General Terms and Conditions
              </Text>
              &nbsp;and&nbsp;
              <Text
                style={{color: PRIMARY_COLOR}}
                onPress={() => {
                  Linking.openURL('https://zada.io/privacy-policy/');
                }}>
                Privacy Policy.
              </Text>
            </Text>
          </View>
        </View>

        <View
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            paddingTop: 20,
            paddingBottom: 20,
          }}>
          <TouchableOpacity style={styles.primaryButton} onPress={nextHandler}>
            <Text style={styles.text}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderColor: GREEN_COLOR,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: GREEN_COLOR,
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 10,
    paddingRight: 20,
    width: 250,
  },
  text: {
    color: WHITE_COLOR,
    alignSelf: 'center',
    fontFamily: 'Merriweather-Bold',
  },
});

export default WelcomeScreen;
