  import * as React from 'react';
  import { View,Image,Text,StyleSheet } from 'react-native';
  import { useState } from 'react';
  import PrimaryButton from '../components/PrimaryButton';
  import { PRIMARY_COLOR } from '../constants/constants';
  const img = require('../assets/images/notifications.png');
  function NotfiyMeScreen({navigation}) {
    const [isEnabled, setIsEnabled] = useState(false);
    nextHandler = () => {     
          navigation.navigate('PassCodeScreen');
      
  }

    return (
      
         <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
         <View style={{ flex:3, alignItems: 'center', justifyContent: 'center' }}>
       <Image style={{ width:200, height:200 }}
                 source={img}
       />
       </View>
       <View style={{ flex:2, alignItems: 'center', justifyContent: 'center' }}>
       
           <Text style={styles.TextContainer}>We use push notifications to deliver messages for important events,
          such as when you recieve a new credential.</Text>
       </View>
       <View style={{ flex:3, alignItems: 'center', justifyContent: 'center' }}>
       <PrimaryButton title="Enable Notifications" nextHandler={nextHandler} />
    
        <Text style={styles.TextContainerEnd}>Continue without alerts</Text>

       </View>
    
       </View>
    );
  } 
  const styles = StyleSheet.create({
    TextContainer: {
      padding:10, alignItems: 'center', justifyContent: 'center',color:'black',alignContent:'center'
      ,marginLeft:30,margin:20}, 
     TextContainerEnd: {
      alignItems: 'center', justifyContent: 'center',color:PRIMARY_COLOR,paddingTop:15
    }
  });
    
  export default NotfiyMeScreen;