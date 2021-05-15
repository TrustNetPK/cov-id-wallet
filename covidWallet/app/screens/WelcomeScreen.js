import * as React from 'react';
import { View, Text, Linking, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import PrimaryButton from '../components/PrimaryButton';
import { PRIMARY_COLOR,BACKGROUND_COLOR,GREEN_COLOR,WHITE_COLOR } from '../theme/Colors';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import ConstantsList from '../helpers/ConfigApp';
import randomString from '../helpers/RandomString';
import { saveItem } from '../helpers/Storage';
import HeadingComponent from '../components/HeadingComponent';
import GreenPrimaryButton from '../components/GreenPrimaryButton';

const img = require('../assets/images/t&c.png');

var radio_props = [{ label: '', value: 0,selectedButtonColor: PRIMARY_COLOR }];

function WelcomeScreen({ navigation }) {
  const [error, setError] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [wallet_name, setWalletName] = useState(randomString(8));
  const [isRadio, setRadio] = useState('false');

  useEffect(() => {
    fetch(ConstantsList.BASE_URL + `/create_wallet`, {
      method: 'POST',
      headers: {
        'X-API-Key': ConstantsList.API_SECRET,
        'Content-Type': 'application/json; charset=utf-8',
        Server: 'Python/3.6 aiohttp/3.6.2',
      },
      body: JSON.stringify({
        wallet_name: wallet_name,
        seed: randomString(32),
      }),
    })
      .then(resp =>
        resp.json().then(data => {
          let wSecret = data.wallet_secret;
          // save data in async storage
          saveItem(ConstantsList.WALLET_SECRET, wSecret)
            .then(() => {
              saveItem(ConstantsList.WALLET_NAME, wallet_name)
                .then(() => {
                  setLoading(false);
                })
                .catch(e => {
                  setError('Error');
                });
            })
            .catch(e => {
              setError('Error');
            });
        }),
      )
      .catch(e => {
        setError(e);
      });
  }, []);

  const checkHandler = () => {
    if (!isChecked) {
      setChecked(true);
      setRadio('true');
    }
  };

  const nextHandler = () => {
      navigation.navigate('SecurityScreen');
  };

  return (
    <View style={{ flex: 1,alignItems: 'center', justifyContent: 'center',backgroundColor:PRIMARY_COLOR }}>
      <View style={{flex:1,backgroundColor:BACKGROUND_COLOR,alignContent:'center',margin:30,borderRadius:10}}>
      <View
        style={{
          flex: 5,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <View style={{marginTop:20,marginLeft:25,marginRight:25}}>
          <HeadingComponent text="Zada is your Digital ID Wallet!"/>
          </View>
        <TextComponent
          onboarding={true}
          text="Securely prove who you are and only share the information you want."/>
          <View style={{paddingTop:10}}/>
        <TextComponent
          onboarding={true}
          text="All certificates and IDs safely stored on your phone, where only you can access them."/>
       <View style={{ alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'}}>
         <Text style={{color:'black',fontFamily:'Merriweather-Bold',paddingTop:30}}>We provide your privacy and data.</Text>
         <Text style={{color:'black',fontFamily:'Poppins-Regular', marginLeft: 20,fontSize:12,alignItems:'center',justifyContent:'center',textAlign:'center', 
      marginRight: 20}}>By continuing below you confirm that you have read and agree to &nbsp;
      <Text
    style={{ color: PRIMARY_COLOR,}}
    onPress={() => {Linking.openURL('http://www.example.com/')}}
  >
    ZADA General Terms and Conditions 
  </Text>
  &nbsp;and&nbsp;
   <Text
    style={{ color: PRIMARY_COLOR,}}
    onPress={() => {Linking.openURL('http://www.example.com/')}}
  >
    Privacy Policy.
  </Text>
      </Text>
      
         </View>
         <TouchableOpacity style={styles.primaryButton} onPress={nextHandler}>
            <Text style={styles.text}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
     
    </View>
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
    color: PRIMARY_COLOR
  },
  checkbox: {
    paddingTop: '2%',
    color: PRIMARY_COLOR
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
    fontFamily:'Merriweather-Bold'
}
});

export default WelcomeScreen;
