import React from 'react';
import { View, Image, Text, StyleSheet, BackHandler, Alert } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { PRIMARY_COLOR } from '../theme/Colors';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';

//import { AuthContext } from '../helpers/AuthContext'
import { AuthContext } from '../Navigation'
import { isFirstTime } from '../helpers/Storage';
const img = require('../assets/images/notifications.png');


function NotifyMeScreen({ navigation }) {
  //const [isEnabled, setIsEnabled] = useState(false);
  const { isFirstTimeFunction } = React.useContext(AuthContext)
  storeData = async () => {
    try {
      await AsyncStorage.setItem(
        'isfirstTime',
        'false'
      );
      isFirstTimeFunction({})
    } catch (error) {
      // Error saving data
    }
  };
  nextHandler = () => {
    storeData()
    //navigation.navigate('MainScreen');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBoxComponent
          source={img}
        />
      </View>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.TextContainerHead}>Stay Notified</Text>
        <TextComponent onboarding={true} text="We use push notifications to deliver messages for important events,
          such as when you recieve a new vaccination certificate."/>

      </View>
      <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
        <PrimaryButton text="Enable Notifications" nextHandler={isFirstTimeFunction()} />
        <Text style={styles.TextContainerEnd}
          onPress={nextHandler()} >Continue without alerts</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  TextContainerEnd: {
    alignItems: 'center', justifyContent: 'center', color: PRIMARY_COLOR, paddingTop: 15
  },
  TextContainerHead: {
    alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold',
    fontSize: 32, flexDirection: 'column',
  },
});

export default NotifyMeScreen;