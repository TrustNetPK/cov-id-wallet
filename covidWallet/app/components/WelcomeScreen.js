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
        const [error, setError] = useState('');
        const[isChecked,setChecked]=useState(false);
        const[isRadio,setRadio]=useState('false');
        const checkHandler = () => {
          console.log('come');
          console.log(isChecked);
          if (!isChecked) {
                  setChecked(true); 
                  setRadio('true');
                  
          }    
          console.log(isRadio);    
         
      }
        nextHandler = () => {
          setError('')
          console.log(isChecked);
          if (!isChecked) {   
            console.log(isChecked);
                  setError("Please agree with the terms and conditions of TrustNetPk.")        
          }    
          else{ 
              navigation.navigate('SecurityScreen');
          }
      }
        return (
         
          <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flex:4, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={styles.ImageBox}
                    source={img}
          />
          </View>
          <View style={{ flex:2, alignItems: 'center', justifyContent: 'center',textAlign:'center' }}>
          <Text style={styles.TextContainerHead}>Welcome!</Text>
              <Text style={styles.TextContainer}>Let's create your self-soverign identity.
              {"\n"}This app helps you exchange secure 
                                                vaccination proof against COVID-19.</Text>
          </View>
          <View style={{ flex:3, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.checkboxContainer}>
            
                <RadioForm
                radio_props={radio_props}
                 buttonSize={10}
               //value={isChecked}
               initial={-1}
              checked={isChecked}
               onPress={checkHandler}
               style={styles.checkbox}
               
              />
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
           marginTop:30,padding:20,alignItems: 'center', justifyContent: 'center',color:'black',fontWeight:'bold',
          fontSize:35,flexDirection: 'column'
        },  
      
        TextContainer: {
        padding:10,  color:'black',fontSize:15,
        textAlign:'center'
      }, 
        ImageBox: {
          width:230, height:220,
          marginTop:100,marginBottom:70
            },
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
              fontStyle: 'italic' ,
              margin:5
          
            },
        link: {
              color : 'black',
              fontSize:12
             

            },
      });
        
      export default WelcomeScreen;