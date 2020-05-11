import * as React from 'react';
import {View,Image,Text,Linking,StyleSheet,CheckBox  } from 'react-native';
import { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { PRIMARY_COLOR } from '../constants/constants';
const img = require('../assets/images/welcome.jpg');

function WelcomeScreen({navigation}) {
  const [isSelected, setSelection] = useState(false);
  const [error, setError] = useState('');
  nextHandler = () => {
    setError('')
    if (isSelected == false) {
            setError("Please agree with the terms and conditions of TrustNetPk.")
       
    }
  
    else { 
        navigation.navigate('SecurityScreen');
    }
}
  return (
    
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     <Image style={{ width:260, height:230 }}
              source={img}
    />
    <View style={{ padding:30, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.TextContainerHead}>Welcome!</Text>
        <Text style={styles.TextContainer}>Let's create your self-soverign identity.
    This app helps you exchange secure
                                  vaccination proof against Covid-19.</Text>
    
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          style={styles.checkbox}
        />
        <Text style={styles.link} 
         onPress={() => Linking.openURL('https://trust.net.pk/')}>I agree to the TrustNetPk's Terms of Services
    and Privacy Policy.</Text>
    
      </View>
      {error.length > 0 ? <Text  style={styles.ErrorBox}>{error}</Text> : null}
  <PrimaryButton nextHandler={nextHandler} />

    </View>
     
  );
} 
const styles = StyleSheet.create({
  TextContainerHead: {
    padding:10, alignItems: 'center', justifyContent: 'center',color:PRIMARY_COLOR,fontWeight:'bold',
    fontSize:30 
  },  
 
  TextContainer: {
    padding:2, alignItems: 'center', justifyContent: 'center',color:PRIMARY_COLOR
  }, 
  ErrorBox: {
    flexDirection: "row",
    alignSelf: "center",
    textAlign:'center',
    color:'red'
  },
  Purple: {  color:'#4178CD'    
  },
  White: {    
    color: '#FFFFFF'    
  },
  Blue:{    
    color : PRIMARY_COLOR
      },
  checkboxContainer: {
        flexDirection: "row",
        alignSelf: "center",
        textAlign:'center'
      },
  checkbox: {
        alignSelf: "center",
      },
  link: {
        margin:10,
        color : PRIMARY_COLOR,
        justifyContent:'center',
        textDecorationLine: 'underline'
      },
});
  
export default WelcomeScreen;