import * as React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { useState } from 'react';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import PrimaryButton from '../components/PrimaryButton';
import { PRIMARY_COLOR } from '../theme/Colors';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';

const img = require('../assets/images/t&c.png');

var radio_props = [
  { label: '', value: 0 }
];

function WelcomeScreen({ navigation }) {
  const [error, setError] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [isRadio, setRadio] = useState('false');

  const checkHandler = () => {
    if (!isChecked) {
      setChecked(true);
      setRadio('true');
    }
  }

  nextHandler = () => {
    setError('')
    if (!isChecked) {
      setError("Please agree with the terms and conditions.")
    }
    else {
      navigation.navigate('SecurityScreen');
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBoxComponent
          source={img}
        />
      </View>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Text style={styles.TextContainerHead}>Welcome!</Text>
        <TextComponent onboarding={true} text="Let's create your self-soverign identity.This app helps you exchange secure vaccination proof against COVID-19."/>
      </View>
      <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.checkboxContainer}>
          <RadioForm
            radio_props={radio_props}
            buttonSize={10}
            initial={-1}
            checked={isChecked}
            onPress={checkHandler}
            style={styles.checkbox}
          />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.link}>I agree to TrustNet Pakistan’s
                  <Text style={styles.linkText}
                onPress={() => Linking.openURL('https://trust.net.pk/')}> Terms of Services
                  and Privacy Policy.</Text></Text>
          </View>
        </View>
        {error.length > 0 ? <Text style={styles.ErrorBox}>{error}</Text> : null}
        <PrimaryButton text="CONTINUE" nextHandler={nextHandler} />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  TextContainerHead: {
     paddingTop: 20, alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold',
    fontSize: 35, flexDirection: 'column',
  },
  ErrorBox: {
    color: 'red',
    fontSize: 13
  },
  checkboxContainer: {
    flexDirection: "row",
    alignSelf: "center",
    textAlign: 'center',
    paddingLeft: 20, paddingRight: 20, marginLeft: 30
  },
  checkbox: {
    alignSelf: "center"
  },
  linkText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontStyle: 'italic',
    margin: 5
  },
  link: {
    color: 'black',
    fontSize: 12
  },
});

export default WelcomeScreen;