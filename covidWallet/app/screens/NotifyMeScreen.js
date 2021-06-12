import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PRIMARY_COLOR } from '../theme/Colors';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import { AuthContext } from '../Navigation';
import GreenPrimaryButton from '../components/GreenPrimaryButton';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

const img = require('../assets/images/notifications.png');

function NotifyMeScreen({ navigation }) {
  const { isFirstTimeFunction } = React.useContext(AuthContext);


  function enableNotifications() {

    console.log('i am here');

    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
        AsyncStorage.setItem('isfirstTime', 'false').then(() => {
          isFirstTimeFunction();
        });
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
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
