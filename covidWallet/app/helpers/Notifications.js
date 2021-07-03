import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { saveItem } from './Storage';
import ConstantsList from '../helpers/ConfigApp';
import { AuthenticateUser } from '../helpers/Authenticate';
import { addCredentialToActionList } from '../helpers/Credential';
const DROID_CHANNEL_ID = 'zada';

//Usage: showNotification("Test", `Test.`, '0', true, true);
function showLocalNotification(
  title,
  message,
  id,
  vibrate,
  sound,
  ongoing = false,
) {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: id,
    autoCancel: true,
    vibrate: vibrate,
    vibration: vibrate ? 300 : undefined,
    priority: 'high',
    visibility: 'public',
    importance: 'high',
    ongoing: ongoing,

    /* iOS only properties */
    //alertAction: 'view',
    userInfo: { id: id }, // required for ios local notification

    /* iOS and Android properties */
    title: title,
    message: message, // (required)
    playSound: sound,
    soundName: sound ? 'default' : undefined,
    // number: number // silly library, iOS requires number, while android string...
  });
}

function accumulateBadgeNumber(count) {
  PushNotification.getApplicationIconBadgeNumber((badgeCount) => {
    PushNotification.setApplicationIconBadgeNumber(badgeCount + count);
  });
}

function clearBadgeNumber() {
  PushNotification.setApplicationIconBadgeNumber(0);
}

function clearAllNotifications() {
  PushNotification.clearAllNotifications();
  clearBadgeNumber();
}

function getAllDeliveredNotifications() {
  PushNotification.getDeliveredNotifications((notifications) => {
    console.log(notifications);
  });
}

//Android: Automatically triggered on notification arrival for android
//IOS: Triggered on clicking notification from notification center
function receiveNotificationEventListener(notification) {
  console.log('NEW NOTIFICATION:', notification);

  if (Platform.OS === 'ios') {
    //TODO: Process IOS notification here
    //MAKE SURE YOU DONT PROCESS IT TWICE AS iOSforegroundTrigger might also process it
    //Use identifier to make sure you dont process twice
    if (notification.data.type === 'credential_offer') {
      let x = addCredentialToActionList(notification.data.metadata);
      console.log('HX2' + x);
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }

  if (Platform.OS === 'android') {
    showLocalNotification(
      notification.data.title,
      notification.data.body,
      DROID_CHANNEL_ID,
      true,
      true,
    );
    //TODO: Process Android notification here
    console.log(notification.data.type + ' : ' + notification.data.metadata);
  }
}

/*
This function triggers automatically every 5 second *ONLY ON IOS*
because receiveNotificationEventListener is not called automatically 
when notification is received.
*/
function iOSforegroundTrigger() {
  PushNotification.getDeliveredNotifications((notifications) => {
    if (notifications.length !== 0) {
      //TODO: Process IOS notification here
      //MAKE SURE YOU DONT PROCESS IT TWICE AS receiveNotificationEventListener might also process it
      //Use identifier to make sure you dont process twice
      let notificationsProcessed = [];
      notifications.forEach((notification) => {
        console.log(
          notification.userInfo.type + ' : ' + notification.userInfo.metadata,
        );
        if (notification.userInfo.type === 'credential_offer') {
          let x = addCredentialToActionList(notification.userInfo.metadata);
          console.log('HX1' + x);
        }
        notificationsProcessed.push(notification.identifier);
      });
      PushNotificationIOS.removeDeliveredNotifications(notificationsProcessed);
    }
  });
}

function onRegisterEventListener(token) {
  console.log('TOKEN:', token);
  PushNotification.checkPermissions((permissions) => {
    if (permissions.badge !== true || permissions.alert !== true) {
      //activate notification permision if disabled
    }
  });

  AuthenticateUser().then((response) => {
    registerDeviceToken(Platform.OS, token.token, response.token);
  });

}

function onActionEventListener(notification) {
  console.log('ACTION:', notification.action);
  console.log('NOTIFICATION:', notification);
  // process the action
}

function onRegistrationErrorEventListener(err) {
  console.error(err.message, err);
}

function registerDeviceToken(devicePlatform, devicePushToken, userToken) {
  fetch(ConstantsList.BASE_URL + '/api/enableNotifications', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + userToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      platform: devicePlatform,
      deviceToken: devicePushToken,
    }),
  }).then((registerDevice) =>
    registerDevice.json().then((data) => {
      try {
        console.log('Response ' + JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    }),
  );
};

module.exports = {
  showLocalNotification: showLocalNotification,
  accumulateBadgeNumber: accumulateBadgeNumber,
  clearBadgeNumber: clearBadgeNumber,
  clearAllNotifications: clearAllNotifications,
  getAllDeliveredNotifications: getAllDeliveredNotifications,
  receiveNotificationEventListener: receiveNotificationEventListener,
  onRegisterEventListener: onRegisterEventListener,
  onActionEventListener: onActionEventListener,
  onRegistrationErrorEventListener: onRegistrationErrorEventListener,
  getAllDeliveredNotifications: getAllDeliveredNotifications,
  iOSforegroundTrigger: iOSforegroundTrigger,
  DROID_CHANNEL_ID: DROID_CHANNEL_ID,
};
