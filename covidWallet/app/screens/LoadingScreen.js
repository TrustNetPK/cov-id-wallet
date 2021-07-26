import * as React from 'react';
import {View, Text, Linking, StyleSheet, TouchableOpacity} from 'react-native';
import {
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
  GREEN_COLOR,
  WHITE_COLOR,
} from '../theme/Colors';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';

const img = require('../assets/images/t&c.png');

function LoadingScreen({navigation}) {
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
      <View
        style={{
          flex: 1,
          backgroundColor: BACKGROUND_COLOR,
          alignContent: 'center',
          margin: 30,
          borderRadius: 10,
        }}
      />
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
    marginTop: 10,
    width: 250,
  },
  text: {
    color: WHITE_COLOR,
    alignSelf: 'center',
    fontFamily: 'Merriweather-Bold',
  },
});

export default LoadingScreen;
