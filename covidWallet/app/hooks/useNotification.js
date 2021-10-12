import { useEffect, useState } from "react";
import { initNotifications, receiveNotificationEventListener } from '../helpers/Notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { addCredentialToActionList, addVerificationToActionList } from "../helpers/ActionList";
import { Platform } from "react-native";
import { CRED_OFFER, VER_REQ } from "../helpers/ConfigApp";

const useNotification = () => {

    const [isZadaAuth, setZadaAuth] = useState(false);
    const [authData, setAuthData] = useState(null);
    const [notificationReceived, setNotificationReceived] = useState(false);

    useEffect(() => {
        initNotifications(localReceiveNotificationEventListener)
        if (Platform.OS === 'ios') {
            setInterval(() => {
                iOSforegroundNotificationCheck();
            }, 5000)
        }
    }, [])


    function iOSforegroundNotificationCheck() {
        PushNotification.getDeliveredNotifications((notifications) => {
            if (notifications.length !== 0) {
                iOSTriggerForeground();
            }
        })
    }


    async function localReceiveNotificationEventListener(notification) {
        const verData = await receiveNotificationEventListener(notification);
        console.log("ANDROID => ",verData);
        if(verData.auth_verification){
            setAuthData(verData.data);
            setZadaAuth(true);
        }
        else{
            setAuthData(null);
            setZadaAuth(false);
        }
        refreshScreen();
    }

    async function refreshScreen() {
        setNotificationReceived(true);
        setTimeout(() => {
            setNotificationReceived(false);
        }, 1000);
    }

    const iOSTriggerForeground = async () => {
        PushNotification.getDeliveredNotifications(async (notifications) => {
            if (notifications.length !== 0) {
                //TODO: Process IOS notification here
                //MAKE SURE YOU DONT PROCESS IT TWICE AS receiveNotificationEventListener might also process it
                //Use identifier to make sure you dont process twice
                let notificationsProcessed = [];
                for (let i = 0; i < notifications.length; i++) {
                    console.log(`notif${i}`,notifications[i]);
                    switch (notifications[i].userInfo.type) {
                        case CRED_OFFER:
                            await addCredentialToActionList(notifications[i].userInfo.metadata);
                            break;
                        case VER_REQ:
                            console.log("VERIFICATION REQUESTS");
                            console.log('verification request => ', notifications[i])
                            const verData = await addVerificationToActionList();
                            
                            console.log("IOS => ",verData);
                            if(verData.isZadaAuth){
                                setAuthData(verData.data);
                                setZadaAuth(true);
                            }
                            else{
                                setAuthData(null);
                                setZadaAuth(false);
                            }

                            break;
                        default:
                            console.log('notification type not found!');
                    }
                    notificationsProcessed.push(notifications[i].identifier);
                    console.log('notificationsProcessed => ', notificationsProcessed)
                }
                PushNotificationIOS.removeDeliveredNotifications(notificationsProcessed);
                refreshScreen();
            }
        });
    }

    return { notificationReceived, isZadaAuth, authData, setZadaAuth, setAuthData };
};
export default useNotification;