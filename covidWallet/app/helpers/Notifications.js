import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";

//Usage: showNotification("Test", `Test.`, '0', true, true);
function showLocalNotification(title, message, id, vibrate, sound, ongoing = false) {
    PushNotification.localNotification({
        /* Android Only Properties */
        id: id,
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
    return PushNotification.getDeliveredNotifications((notifications) => {
        console.log(notifications);
        return notifications;
    });
}

function receiveNotificationEventListener(notification) {
    console.log("NEW NOTIFICATION:", notification);

    if (Platform.OS === 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    }

    if (Platform.OS === 'android') {
        showLocalNotification(notification.data.title, notification.data.body, '0', true, true);
        console.log(notification.data.type + ' : ' + notification.data.metadata);
    }
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
};