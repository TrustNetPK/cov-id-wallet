import * as React from 'react';
import { View,Image,Text,Switch,StyleSheet } from 'react-native';
import { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { PRIMARY_COLOR } from '../constants/constants';
const img = require('../assets/images/bell.png');
function NotfiyMeScreen({navigation}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  nextHandler = () => {     
        navigation.navigate('PassCodeScreen');
    
}

  return (
    
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     <Image 
              source={img}
    />
    <View style={{flexDirection: 'row',padding:20}}>
       
        <Text style={styles.TextContainer}>Push notifications should be On so that
         you receive notification when new event occurs such as new credential offer received.</Text>

        <Switch
       
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      </View>
     
  <PrimaryButton nextHandler={nextHandler} />

    </View>
     
  );
} 
const styles = StyleSheet.create({
  TextContainer: {
    padding:30, alignItems: 'center', justifyContent: 'center',color:PRIMARY_COLOR,marginTop:10
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
  
export default NotfiyMeScreen;