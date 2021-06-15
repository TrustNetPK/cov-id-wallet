/**
 * @format
 */
import PushNotification from "react-native-push-notification";
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { iOSforegroundTrigger, receiveNotificationEventListener, onRegisterEventListener, onActionEventListener, onRegistrationErrorEventListener } from './app/helpers/Notifications';

//Run every 5 seconds
if (Platform.OS === 'ios') {
    setInterval(() => {
        iOSforegroundTrigger();
    }, 5000)
}
// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)

    onRegister: onRegisterEventListener,

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: receiveNotificationEventListener,

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: onActionEventListener,

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: onRegistrationErrorEventListener,

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
    requestPermissions: false,
});

AppRegistry.registerComponent(appName, () => App);
