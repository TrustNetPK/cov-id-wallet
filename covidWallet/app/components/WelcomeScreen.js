      import * as React from 'react';
      import {View,Image,Text,Linking,StyleSheet,CheckBox  } from 'react-native';
      import { useState } from 'react';
      import RadioForm, {RadioButton} from 'react-native-simple-radio-button';
      import PrimaryButton from '../components/PrimaryButton';
      import { PRIMARY_COLOR } from '../constants/constants';
      const img = require('../assets/images/t&c.png');
 
      var radio_props = [
        {label: '', value: 0 }
      ];
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
         
          <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flex:3, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={{ width:200, height:200 }}
                    source={img}
          />
          </View>
          <View style={{ flex:2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.TextContainerHead}>Welcome!</Text>
              <Text style={styles.TextContainer}>Let's create your self-soverign identity.
              {"\n"}This app helps you exchange secure 
                                                vaccination proof against Covid-19.</Text>
          </View>
          <View style={{ flex:3, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.checkboxContainer}>
              <CheckBox
                value={isSelected}
                onValueChange={setSelection}
                style={styles.checkbox}
              />
                {/* <RadioForm
               radio_props={radio_props}
               initial={0}
               onPress={(value) => {this.setState({value:value})}}
               style={styles.checkbox}
              /> */}
            <View style={{alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.link}>I agree to TrustNet Pakistan’s
                  <Text style={styles.linkText} 
                  onPress={() => Linking.openURL('https://trust.net.pk/')}> Terms of Services
                  and Privacy Policy.</Text></Text>
            </View> 
            </View> 
            
          {error.length > 0 ? <Text  style={styles.ErrorBox}>{error}</Text> : null}
        <PrimaryButton title="Continue" nextHandler={nextHandler} />

          </View>
       
          </View>
          
        );
      } 
      const styles = StyleSheet.create({
        TextContainerHead: {
           margin:20,alignItems: 'center', justifyContent: 'center',color:'black',fontWeight:'bold',
          fontSize:25 
        },  
      
        TextContainer: {
        padding:10, alignItems: 'center', justifyContent: 'center',color:'black',alignContent:'center'
        ,marginLeft:30}, 
        ErrorBox: {
          flexDirection: "row",
          alignSelf: "center",
          textAlign:'center',
          color:'red',
          fontSize:13
            },
        checkboxContainer: {
              flexDirection: "row",
              alignSelf: "center",
              textAlign:'center',
              paddingLeft:20,paddingRight:20,marginLeft:30
            },
        checkbox: {
              alignSelf: "center"
            },
            linkText: {
              color : PRIMARY_COLOR,
              fontSize:12,
              fontStyle: 'italic' 
          
            },
        link: {
              color : 'black',
              fontSize:12
             

            },
      });
        
      export default WelcomeScreen;