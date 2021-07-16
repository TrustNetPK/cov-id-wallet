import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { initNotifications, receiveNotificationEventListener } from '../helpers/Notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { addCredentialToActionList } from "../helpers/ActionList";
import { Platform } from "react-native";

const useNotification = () => {

    const [notificationReceived, setNotificationReceived] = useState(false);

    useEffect(() => {
        initNotifications(localReceiveNotificationEventListener)
        if (Platform.OS === 'ios') {
            setInterval(() => {
                iOSforegroundTrigger();
            }, 5000)
        }
    }, [])


    function iOSforegroundTrigger() {
        PushNotification.getDeliveredNotifications((notifications) => {
            if (notifications.length !== 0) {
                setNotificationReceived(true);
            }
        })
    }


    async function localReceiveNotificationEventListener(notification) {
        await receiveNotificationEventListener(notification);
        setNotificationReceived(true);
        setTimeout(() => {
            setNotificationReceived(false);
        }, 1000);
    }

    useEffect(() => {
        const iOSTriggerForeground = async () => {
            PushNotification.getDeliveredNotifications(async (notifications) => {
                if (notifications.length !== 0) {
                    //TODO: Process IOS notification here
                    //MAKE SURE YOU DONT PROCESS IT TWICE AS receiveNotificationEventListener might also process it
                    //Use identifier to make sure you dont process twice
                    let notificationsProcessed = [];
                    for (let i = 0; i < notifications.length; i++) {
                        if (notifications[i].userInfo.type === 'credential_offer') {
                            let x = await addCredentialToActionList(notifications[i].userInfo.metadata);
                            console.log('HX1' + x);
                        }
                        notificationsProcessed.push(notifications[i].identifier);
                        setNotificationReceived(false);
                    }
                    PushNotificationIOS.removeDeliveredNotifications(notificationsProcessed);
                }
            });
        }
        if (notificationReceived) {
            if (Platform.OS == "ios") {
                iOSTriggerForeground();
            }
        }
    }, [notificationReceived]);

    return { notificationReceived };
};
export default useNotification;