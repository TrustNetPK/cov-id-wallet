import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";
const DROID_CHANNEL_ID = 'zada';

//Usage: showNotification("Test", `Test.`, '0', true, true);
function showLocalNotification(title, message, id, vibrate, sound, ongoing = false) {
    PushNotification.localNotification({
        /* Android Only Properties */
        channelId: id,
        autoCancel: true,
        vibrate: vibrate,
        vibration: vibrate ? 300 : undefined,
        priority: "high",
        visibility: "public",
        importance: "high",
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
    console.log("NEW NOTIFICATION:", notification);

    if (Platform.OS === 'ios') {
        //TODO: Process IOS notification here
        //MAKE SURE YOU DONT PROCESS IT TWICE AS iOSforegroundTrigger might also process it
        //Use identifier to make sure you dont process twice

        notification.finish(PushNotificationIOS.FetchResult.NoData);
    }

    if (Platform.OS === 'android') {
        showLocalNotification(notification.data.title, notification.data.body, DROID_CHANNEL_ID, true, true);
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
            let notificationsProcessed = []
            notifications.forEach((notification) => {
                console.log(notification.userInfo.type + ' : ' + notification.userInfo.metadata);
                notificationsProcessed.push(notification.identifier);
            });
            PushNotificationIOS.removeDeliveredNotifications(notificationsProcessed);

        }
    });

}

function onRegisterEventListener(token) {
    console.log("TOKEN:", token);
    PushNotification.checkPermissions((permissions) => {
        console.log(permissions);
        if (permissions.badge !== true || permissions.alert !== true) {
            //activate notification permision if disabled
        }
    });

    //TODO: make API call to middleware /api/enableNotifications with 
}

function onActionEventListener(notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
    // process the action
}

function onRegistrationErrorEventListener(err) {
    console.error(err.message, err);
}

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