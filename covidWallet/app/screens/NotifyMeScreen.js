import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import { PRIMARY_COLOR } from '../theme/Colors';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import { AuthContext } from '../Navigation';
import GreenPrimaryButton from '../components/GreenPrimaryButton';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConstantsList from '../helpers/ConfigApp';
import NetInfo from '@react-native-community/netinfo';
import { getItem, saveItem } from '../helpers/Storage';
import { useEffect } from 'react/cjs/react.production.min';


const img = require('../assets/images/notifications.png');

function NotifyMeScreen({ navigation }) {
  const { isFirstTimeFunction } = React.useContext(AuthContext);

  function enableNotifications() {

    PushNotification.checkPermissions((permissions) => {
      if (permissions.badge !== true || permissions.alert !== true || permissions.sound !== false) {
        //activate notification permision if disabled
        PushNotification.requestPermissions();
      }
    });
    AsyncStorage.setItem('isfirstTime', 'false').then(() => {
      isFirstTimeFunction();
    });
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBoxComponent source={img} />
      </View>
      <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
        <GreenPrimaryButton
          text="ENABLE NOTIFICATIONS"
          nextHandler={enableNotifications}
        />
        {/* <TouchableOpacity onPress={isFirstTimeFunction}>
          <Text style={styles.TextContainerEnd}>Continue without alerts</Text>
        </TouchableOpacity> */}
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
