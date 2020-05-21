        import * as React from 'react';
        import { View,Image,Text,StyleSheet} from 'react-native';
        import { useState } from 'react';
        import PrimaryButton from '../components/PrimaryButton';
        import { PRIMARY_COLOR } from '../constants/constants';
        const img = require('../assets/images/security.png');
        function SecurityScreen({navigation}) {

          nextHandler = () => {     
                navigation.navigate('NotfiyMeScreen');
            
        }

          return (
        
        <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flex:4, alignItems: 'center', justifyContent: 'center' }}>
        <Image style={styles.ImageBox}
                      source={img}
            />
      </View>
      <View style={{ flex:3, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.TextContainer}>Using biometric security significantly reduces the chances
                your account will be compromised in case your phone is lost or stolen.</Text>
      </View>
      <View style={{ flex:3, alignItems: 'center', justifyContent: 'center' }}>
        
      <PrimaryButton title="Enable Secure ID" nextHandler={nextHandler} />


      </View>

      </View>
      
    );
    } 
    const styles = StyleSheet.create({
   

    TextContainer: {
      padding:30,  color:'black',fontSize:15,
      textAlign:'center',
      marginTop:70,alignItems: 'center', justifyContent: 'center',color:'black',
      
  },
  
        ImageBox: {
          width:230, height:220,
          marginTop:100,marginBottom:30
            }, 
 
    });
        export default SecurityScreen;