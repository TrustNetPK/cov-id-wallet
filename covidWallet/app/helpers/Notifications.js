import PushNotification from "react-native-push-notification";


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
        return notifications;
    });
}