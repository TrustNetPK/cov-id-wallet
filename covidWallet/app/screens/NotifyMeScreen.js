import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {PRIMARY_COLOR} from '../theme/Colors';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import {AuthContext} from '../Navigation';
import GreenPrimaryButton from '../components/GreenPrimaryButton';
const img = require('../assets/images/notifications.png');

function NotifyMeScreen({navigation}) {
  const {isFirstTimeFunction} = React.useContext(AuthContext);
  storeData = async () => {
    try {
      await AsyncStorage.setItem('isfirstTime', 'false');
      isFirstTimeFunction({});
    } catch (error) {
      // Error saving data
    }
  };
  nextHandler = () => {
    storeData();
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          flex: 4,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
        <Text style={styles.TextContainerHead}>Get notified</Text>
        <TextComponent
          onboarding={true}
          text="We use push notifications to deliver messages for important events,
          such as when you recieve a new digital certificate."
        />
      </View>
      <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
        <ImageBoxComponent source={img} />
      </View>
      <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
        <GreenPrimaryButton
          text="ENABLE NOTIFICATIONS"
          nextHandler={isFirstTimeFunction}
        />
        <TouchableOpacity onPress={isFirstTimeFunction}>
          <Text style={styles.TextContainerEnd}>Continue without alerts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  TextContainerEnd: {
    alignItems: 'center',
    justifyContent: 'center',
    color: PRIMARY_COLOR,
    paddingTop: 10,
  },
  TextContainerHead: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 32,
    flexDirection: 'column',
  },
});

export default NotifyMeScreen;
