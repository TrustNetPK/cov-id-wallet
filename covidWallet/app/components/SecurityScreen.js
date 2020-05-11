import * as React from 'react';
import { View,Image,Text,StyleSheet} from 'react-native';
import { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { PRIMARY_COLOR } from '../constants/constants';
const img = require('../assets/images/face.jpg');
function SecurityScreen({navigation}) {

  nextHandler = () => {     
        navigation.navigate('NotfiyMeScreen');
    
}

  return (
    
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     <Image style={{ width:280, height:240  }}
              source={img}
    />
    <View>
        <Text style={styles.TextContainer}>Enable your Face ID for security purpose.</Text>
      </View>
  <PrimaryButton nextHandler={nextHandler} />

    </View>
     
  );
} 
const styles = StyleSheet.create({
  TextContainer: {
    padding:20, alignItems: 'center', justifyContent: 'center',color:PRIMARY_COLOR,margin:10,marginTop:20
    ,textDecorationLine:'underline'
  }, 
 
 Purple: {  color:'#4178CD'    
  },
  White: {    
    color: '#FFFFFF'    
  },
    Blue:{    
    color : PRIMARY_COLOR
      }
});
  
export default SecurityScreen;