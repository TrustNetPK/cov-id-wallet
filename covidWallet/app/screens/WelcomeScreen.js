import * as React from 'react';
import { View, Text, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import PrimaryButton from '../components/PrimaryButton';
import { PRIMARY_COLOR } from '../theme/Colors';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import ConstantsList from '../helpers/ConfigApp';
import randomString from '../helpers/RandomString';
import { saveItem } from '../helpers/Storage';

const img = require('../assets/images/t&c.png');

var radio_props = [
  { label: '', value: 0 }
];

function WelcomeScreen({ navigation }) {
  const [error, setError] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [wallet_secret, setSecret] = useState('');
  const [wallet_name] = useState(randomString(8));
  const [isRadio, setRadio] = useState('false');

  useEffect(() => {
    saveWalletSecret();
    fetch(ConstantsList.BASE_URL + `/create_wallet`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': ConstantsList.API_SECRET,
          'Content-Type': 'application/json; charset=utf-8',
          'Server': 'Python/3.6 aiohttp/3.6.2'
        },
        body: JSON.stringify({
          wallet_name: wallet_name,
          seed: randomString(32)
        })
      }).then((
        resp => resp.json().then((data => {
          // save data in async storage
          setLoading(false);
          setSecret(data.wallet_secret);
          console.log(data.wallet_secret);
        })))).catch(e => {
          setError(e)
        })
  }, []);


  const checkHandler = () => {
    if (!isChecked) {
      setChecked(true);
      setRadio('true');
    }
  }
  const saveWalletSecret = async () => {
    try {
      await AsyncStorage.setItem(
        ConstantsList.WALLET_NAME,
        wallet_name
      );

    } catch (error) {
      // Error saving data
      setError(error)
    }
  }

  const nextHandler = () => {
    setError('')
    if (!isChecked) {
      setError("Please agree with the terms and conditions.")
    }
    else {
      saveItem(ConstantsList.WALLET_SECRET, wallet_secret).then(() => {
        saveWalletSecret();
        navigation.navigate('SecurityScreen');
      }).catch(e => {
        setError('Error')
      })

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
        <Text style={styles.TextContainerHead}></Text>
        <TextComponent onboarding={true} text="Let's create your self-soverign identity.This app helps you exchange secure vaccination proof against COVID-19." />
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
                onPress={() => Linking.openURL('https://trust.net.pk/')}> {'\n'}Terms of Services and Privacy Policy.</Text></Text>
          </View>
        </View>
        {error.length > 0 ? <Text style={styles.ErrorBox}>{error}</Text> : null}
        {isLoading ? <ActivityIndicator size="large" color={PRIMARY_COLOR} /> : <PrimaryButton text="Continue" nextHandler={nextHandler} />}
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  TextContainerHead: {
    paddingTop: 20, alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold',
    fontSize: 32, flexDirection: 'column',
  },
  ErrorBox: {
    color: 'red',
    fontSize: 13
  },
  checkboxContainer: {
    flexDirection: "row",
    alignSelf: "center",
    textAlign: 'center',
    paddingLeft: 0, paddingRight: 0,
  },
  checkbox: {
    paddingTop: '2%'
  },
  linkText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontStyle: 'italic',
    margin: 5
  },
  link: {
    color: 'black',
    fontSize: 14,

    marginBottom: 20
  },
});

export default WelcomeScreen;