import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import {PRIMARY_COLOR} from '../theme/Colors';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import {AuthContext} from '../Navigation';
import GreenPrimaryButton from '../components/GreenPrimaryButton';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConstantsList from '../helpers/ConfigApp';
import NetInfo from '@react-native-community/netinfo';
import {getItem, saveItem} from '../helpers/Storage';
import {useEffect} from 'react/cjs/react.production.min';

const img = require('../assets/images/notifications.png');

function NotifyMeScreen({navigation}) {
  const {isFirstTimeFunction} = React.useContext(AuthContext);
  const [networkState, setNetworkState] = useState(false);
  const [hasToken, setTokenExpired] = useState(true);

  function enableNotifications() {
    PushNotification.checkPermissions((permissions) => {
      console.log('PERMISSIONS' + JSON.stringify(permissions));
      if (
        permissions.badge !== true ||
        permissions.alert !== true ||
        permissions.sound !== false
      ) {
        //activate notification permision if disabled
        PushNotification.requestPermissions();
      }
    });
    AsyncStorage.setItem('isfirstTime', 'false').then(() => {
      isFirstTimeFunction();
    });
  }

  const AuthenticateUser = async (walletSecret) => {
    console.log('Authenticate User');
    await getItem(ConstantsList.USER_ID).then((userID) => {
      if (networkState) {
        fetch(ConstantsList.BASE_URL + `/api/authenticate`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userID,
            secretPhrase: walletSecret,
          }),
        }).then((credsResult) =>
          credsResult.json().then((data) => {
            try {
              let response = JSON.parse(JSON.stringify(data));

              if (response.success == true) {
                saveItem(ConstantsList.USER_TOKEN, response.token);
                getItem(ConstantsList.DEVICE_TOKEN).then((deviceToken) => {
                  registerDeviceToken(Platform.OS, deviceToken);
                });
              } else {
                ToastAndroid.show(response.error, ToastAndroid.SHORT);
              }
            } catch (error) {
              console.error(error);
            } finally {
              // setProgress(false);
            }
          }),
        );
      } else {
        //  setProgress(false);
        ToastAndroid.show(
          'Internet Connection is not available',
          ToastAndroid.LONG,
        );
      }
    });
  };

  const registerDeviceToken = async (
    devicePlatform,
    devicePushToken,
    userToken,
    walletSecret,
  ) => {
    if (networkState) {
      await fetch(ConstantsList.BASE_URL + '/api/enableNotifications', {
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
            console.log('Response ' + JSON.stringify(registerDevice));
            if (data.success == false && data.hasTokenExpired == true) {
              if (hasToken) AuthenticateUser(walletSecret);
              setTokenExpired(false);
            } else {
              console.log('Response ' + JSON.stringify(data));
              let response = JSON.parse(JSON.stringify(data));
              if (response.success == true) {
                enableNotifications();
              } else {
                ToastAndroid.show(response.error, ToastAndroid.SHORT);
              }
            }
          } catch (error) {
            console.error(error);
          } finally {
            // setProgress(false);
          }
        }),
      );
    } else {
      ToastAndroid.show(
        'Internet Connection is not available',
        ToastAndroid.LONG,
      );
    }
  };
  const enablePushAPI = async () => {
    getItem(ConstantsList.DEVICE_TOKEN).then((deviceToken) => {
      if (deviceToken != null) {
        getItem(ConstantsList.USER_TOKEN).then((userToken) => {
          if (userToken != null) {
            getItem(ConstantsList.WALLET_SECRET).then((walletSecret) => {
              registerDeviceToken(
                Platform.OS,
                deviceToken,
                userToken,
                walletSecret,
              );
            });
          }
        });

        // console.log('Device Token Available ' + deviceToken);
      } else {
        Alert.alert(
          'ZADA',
          'Device is not registered for Push Notifications',
          [{text: 'OK'}],
          {cancelable: false},
        );
      }
    });
  };

  React.useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
  }, [networkState]);

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
          nextHandler={enablePushAPI}
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
