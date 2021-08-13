import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, View, StyleSheet, ActivityIndicator, Linking, TouchableOpacity, TouchableHighlight, Animated, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { SwipeListView } from 'react-native-swipe-list-view';
import FlatCard from '../components/FlatCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import ActionDialog from '../components/Dialogs/ActionDialog';
import HeadingComponent from '../components/HeadingComponent';
import BorderButton from '../components/BorderButton';

import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import { themeStyles } from '../theme/Styles';
import { BACKGROUND_COLOR, BLACK_COLOR, RED_COLOR, SECONDARY_COLOR, WHITE_COLOR } from '../theme/Colors';

import { getItem, ls_addConnection, deleteActionByConnId, deleteActionByCredId, deleteActionByVerID, ls_addCredential } from '../helpers/Storage';
import ConstantsList, { CONN_REQ, CRED_OFFER, VER_REQ } from '../helpers/ConfigApp';

import { AuthenticateUser } from '../helpers/Authenticate';
import { showMessage, showAskDialog } from '../helpers/Toast';
import { biometricVerification } from '../helpers/Biometric';
import { getActionHeader } from '../helpers/ActionList';

import { accept_credential } from '../gateways/credentials';
import { accept_connection, delete_connection } from '../gateways/connections';
import { delete_verification, submit_verification } from '../gateways/verifications';
import useNotification from '../hooks/useNotification';
import useCredentials from '../hooks/useCredentials';
import RNExitApp from 'react-native-exit-app';
import { checkNotifications } from 'react-native-permissions';

function ActionsScreen({ navigation }) {

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isAction, setAction] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [actionsList, setActionsList] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [hasToken, setTokenExpired] = useState(true);
  const [Uid, storeUid] = useState();
  const [secret, storeSecret] = useState('');
  const [networkState, setNetworkState] = useState(false);
  const [deepLink, setDeepLink] = useState(false);

  // Credentials hook
  const { credentials } = useCredentials(!isLoading);
  // Notification hook
  const { notificationReceived } = useNotification();

  var requestArray = [];

  // Setting right icon
  const headerOptions = {
    headerRight: () => (
      <MaterialCommunityIcons
        onPress={() => {
          navigation.navigate('QRScreen');
        }}
        style={styles.headerRightIcon}
        size={30}
        name="qrcode"
        padding={30}
      />
    ),
  };

  useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
    if (!deepLink) getUrl();
  }, [deepLink]);


  useEffect(() => {
    // Setting listener for deeplink
    if (!deepLink) {
      Linking.addEventListener('url', ({ url }) => {
        getUrl(url);
      });
    }

    return () => Linking.removeAllListeners();
  }, [])

  //Checking Notification Status
  useLayoutEffect(()=>{

    const _checkPermission = async () => {
      const authorizationStatus = await messaging().hasPermission();
      if(authorizationStatus !== messaging.AuthorizationStatus.AUTHORIZED){
        console.log("Notification Permission => NOT AUTHORIZED");
        Alert.alert(
          "Zada Wallet",
          `Sorry! without notification's permission you cannot use the application`,
          [
            {
              text: "Okay",
              onPress: () => RNExitApp.exitApp(),
              style: "cancel",
            },
          ],
          {
            cancelable: false,
          }
        )
      }
    };

    _checkPermission();
    // ask for notification permission
   
    // PushNotification.checkPermissions((permissions) => {
    //   if (permissions.badge !== true && permissions.alert !== true && permissions.sound !== false) {
    //     Alert.alert(
    //       "Zada Wallet",
    //       `Sorry! without notification's permission you cannot use the application`,
    //       [
    //         {
    //           text: "Okay",
    //           onPress: () => RNExitApp.exitApp(),
    //           style: "cancel",
    //         },
    //       ],
    //       {
    //         cancelable: false,
    //       }
    //     )
    //   }
    // });
    return;
  },[]);

  // Update Actionlist if notificationReceived is true.
  useEffect(() => {
    if (notificationReceived) {
      updateActionsList();
    }
  }, [notificationReceived])

  useFocusEffect(
    React.useCallback(() => {
      updateActionsList();
      return;
    }, [isAction]),
  );


  React.useLayoutEffect(() => {
    navigation
      .dangerouslyGetParent()
      .setOptions(headerOptions);
    // navigation
    //   .dangerouslyGetParent()
    //   .setOptions(isAction ? headerOptions : undefined);
  }, [isAction, navigation]);


  const getUrl = async (url) => {
    let initialUrl = '';
    if (url != undefined) {
      initialUrl = url;
    } else {
      initialUrl = await Linking.getInitialURL()
    }
    console.log('url =>', url);
    console.log('initialUrl =>', initialUrl);
    if (initialUrl === null) {
      setDeepLink(true);
      return;
    } else {
      const parsed = initialUrl.split('/');
      var item = {};
      item['type'] = parsed[3];
      item['metadata'] = parsed[4];
      requestArray.push(item);
      const requestJson = JSON.parse(JSON.stringify(item));
      setDeepLink(true);
      navigation.navigate('QRScreen', {
        request: requestJson,
      });
    }

    if (initialUrl.includes('Details')) {
      Alert.alert(initialUrl);
    }
  };

  const updateActionsList = async () => {

    let finalObj = [];

    // /** CONNECTION OFFER */

    // Get Connection Request
    let connection_request = JSON.parse(await getItem(ConstantsList.CONN_REQ) || null);

    // If connection_request available
    if (connection_request != null) {
      finalObj = finalObj.concat(connection_request)
    };


    /** CREDENTIALS OFFER */
    // Get Credential Offers
    let credential_offer = JSON.parse(await getItem(ConstantsList.CRED_OFFER) || null);

    // If credential_offer available
    if (credential_offer != null) {
      finalObj = finalObj.concat(credential_offer)
    };


    /** VERIFICATION OFFER */
    // Get verification Offers
    let verification_offers = JSON.parse(await getItem(ConstantsList.VER_REQ) || null);

    // If credential_offer available
    if (verification_offers != null) {
      finalObj = finalObj.concat(verification_offers)
    };

    // SetState ActionList
    if (finalObj.length > 0) {
      setActionsList(finalObj);
      setAction(true);
    } else {
      setAction(false);
    }
  };

  const toggleModal = (v) => {
    setSelectedItem(JSON.stringify(v));

    let data = JSON.parse(JSON.stringify(v));

    setModalData(data);
    setModalVisible(true);
  };

  const acceptModal = async (v) => {
    if(!isLoading){
      if (v.type == CRED_OFFER) handleCredentialRequest();

      else if (v.type == VER_REQ) handleVerificationRequests(v);

      else if (v.type == CONN_REQ) handleConnectionRequest(v);
    }
  }

  // Handle Connection Request
  const handleConnectionRequest = async () => {
    if (networkState) {
      setIsLoading(true);
      
      let resp = await AuthenticateUser();
      if (resp.success) {
        let selectedItemObj = JSON.parse(selectedItem)
        let userID = await getItem(ConstantsList.USER_ID);
        let walletSecret = await getItem(ConstantsList.WALLET_SECRET);
        storeUid(userID);
        storeSecret(walletSecret);


        setModalVisible(false);

        try {
          // Accept connection Api call.
          let result = await accept_connection(selectedItemObj.metadata);
          if (result.data.success) {
            
            await deleteActionByConnId(selectedItemObj.type, selectedItemObj.metadata)
            // Update connection screen.
            await ls_addConnection(result.data.connection)

            updateActionsList();
            setTimeout(() => {
              _showSuccessAlert('conn');
            }, 500);
          } else {
            showMessage('ZADA Wallet', result.data.error);
            return
          }

          setIsLoading(false);
        }
        catch (e) {
          setIsLoading(false);
          console.log(e)
        }
      } else {
        showMessage('ZADA Wallet', resp.message);
        setIsLoading(false);
      }
    }
    else {
      showMessage('ZADA Wallet', 'Internet Connection is not available')
    }
  }

  // Handle Certificate Request
  const handleCredentialRequest = async () => {
    let selectedItemObj = JSON.parse(selectedItem);
    try {
      setModalVisible(false);
      setIsLoading(true);

      // Accept credentials Api call.
      let result = await accept_credential(selectedItemObj.credentialId);
      if (result.data.success) {
        // Delete Action
        await deleteActionByCredId(ConstantsList.CRED_OFFER, selectedItemObj.credentialId)

        // Update ActionList
        updateActionsList();

        setTimeout(() => {
          _showSuccessAlert('cred');
        }, 500);
      } else {
        console.log(result.data);
        showMessage('ZADA Wallet', result.message);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  // Handle Verification Request
  const handleVerificationRequests = async (data) => {
    let selectedItemObj = JSON.parse(selectedItem);
    let credential_arr = JSON.parse(await getItem(CRED_OFFER) || null);

    // Return if null
    if (credential_arr == null) return

    // Biometric Verification
    let BioResult = await biometricVerification();


    if (BioResult) {
      setModalVisible(false);
      setIsLoading(true);
      try {

        let policyName = selectedItemObj.policy.attributes[0].policyName;

        // Submit Verification Api call
        let result = await submit_verification(selectedItemObj.verificationId, data.credentialId, policyName);
        if (result.data.success) {
          await deleteActionByVerID(selectedItemObj.verificationId)
          updateActionsList();

          _showSuccessAlert("ver");

        } else {
          showMessage('Zada', result.data.error)
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        console.log(e)
      }
    } else {
      console.log('failed')
    }
  }


  // Reject Modal
  const rejectModal = async (v) => {
    let selectedItemObj = {};
    if (v.connectionId != undefined) {
      selectedItemObj = v
    } else {
      selectedItemObj = JSON.parse(selectedItem);
    }

    setModalVisible(false);

    if (selectedItemObj.type === ConstantsList.CONN_REQ) {
      // Delete connection api call.
      delete_connection(selectedItemObj.connectionId);

      // Delete connection locally.
      deleteActionByConnId(ConstantsList.CONN_REQ, selectedItemObj.metadata).then(
        (actions) => {
          updateActionsList();
        },
      );
    }

    if (selectedItemObj.type === ConstantsList.CRED_OFFER) {
      setModalVisible(false);
      deleteActionByCredId(ConstantsList.CRED_OFFER, selectedItemObj.credentialId).then(
        (actions) => {
          updateActionsList();
        },
      );
    }

    if (selectedItemObj.type === ConstantsList.VER_REQ) {
      // Biometric Verification
      let BioResult = await biometricVerification();

      if (BioResult) {
        setIsLoading(true);
        setModalVisible(false);
        try {

          // Submit Verification Api call
          let result = await delete_verification(selectedItemObj.verificationId);

          if (result.data.success) {
            await deleteActionByVerID(selectedItemObj.verificationId)
            updateActionsList();
          } else {
            showMessage('Zada', result.data.error)
          }

          setIsLoading(false);

        } catch (e) {
          setIsLoading(false);
          console.log(e)
        }
      } else {
        console.log('failed')
      }
    }
  };

  // Function that will show alert on acceptance of connection and credential
  const _showSuccessAlert = (action) => {

    let message = '';
    if(action == 'conn')
      message = "Your connection is created successfully.";
    else if(action == 'cred')
      message = "You have received a certificate successfully.";
    else if(action == 'ver')
      message = "Your verification request is fulfilled successfully.";

    Alert.alert(
      "Zada Wallet",
      `${message}`,
      [
        {
          text: "Okay",
          onPress: () => console.log('Success Alert Dismiss'),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    )
  }

  const dismissModal = (v) => {
    setModalVisible(false);
    setModalVisible(false);
  };

  // async function handleDeletePressed(v) {
  //   // Get connection id
  //   console.log('conenctionId => ', v)
  //   // try {
  //   //   let result = await delete_connection();
  //   // }
  // }
  function onSwipeValueChange(v) {
    console.log(v);
    // console.log(Math.abs(v.value / 75))
    // animatedScaling[key].setValue(Math.abs(value));
  }

  const onDeletePressed = (item) => {
    showAskDialog("Are you sure?", "Are you sure you want to delete this request?", () => rejectModal(item), () => { });
  }


  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Actions" />
      {isLoading &&
        <View style={{ zIndex: 10, position: "absolute", left: 0, right: 0, bottom: 0, top: 0, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={"#000"} size={"large"} />
        </View>
      }
      {isAction ? (
        <>
          <View pointerEvents={isLoading ? 'none' : 'auto'}>
            {
              isModalVisible &&
              <ActionDialog
                isVisible={isModalVisible}
                toggleModal={toggleModal}
                rejectModal={rejectModal}
                data={modalData}
                dismissModal={dismissModal}
                acceptModal={acceptModal}
                modalType="action"
                isIconVisible={true}
              />
            }
            <SwipeListView
              useFlatList
              disableRightSwipe
              disableLeftSwipe
              data={actionsList}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 50,
              }}
              keyExtractor={(rowData, index) => {
                return index;
              }}
              renderItem={(rowData, rowMap) => {
                let header = getActionHeader(rowData.item.type);

                let subtitle =
                  'Click to view the ' +
                  header.toLowerCase() +
                  ' from ' +
                  rowData.item.organizationName;
                let imgURI = rowData.item.imageUrl;
                return (
                  <FlatCard
                    onPress={() => toggleModal(rowData.item)}
                    imageURL={imgURI}
                    heading={header}
                    text={subtitle}
                  />
                )
              }}
              renderHiddenItem={({ item, index }) => (
                <View key={index} style={styles.rowBack}>
                  <TextComponent text="" />
                  <Animated.View>
                    <TouchableOpacity onPress={() => onDeletePressed(item)} activeOpacity={0.8}
                      style={[
                        styles.swipeableViewStyle,
                        // {
                        //   transform: [{ scale: animatedScaling }]
                        // }
                      ]}
                    >
                      <MaterialCommunityIcons
                        size={30}
                        name="delete"
                        padding={30}
                        color={RED_COLOR}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}
              leftOpenValue={75}
              rightOpenValue={-75}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.EmptyContainer}>
            <TextComponent text="There are no actions to complete, Please scan a QR code to either get a digital certificate or to prove it." />
            <ImageBoxComponent
              source={require('../assets/images/action.png')}
            />
            <View style={{
              alignItems: "center",
              position: 'absolute',
              bottom: '12%',
            }}>
              <BorderButton
                nextHandler={() => {
                  navigation.navigate('QRScreen')
                }}
                text="QR CODE"
                color={BLACK_COLOR}
                textColor={BLACK_COLOR}
                backgroundColor={BACKGROUND_COLOR}
                isIconVisible={true}
              />
            </View>
          </View>
        </>
      )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  EmptyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bottom: {
    width: 50,
    height: 50,
  },
  headerRightIcon: {
    padding: 10,
    color: BLACK_COLOR,
  },
  imageProps: {},
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  swipeableViewStyle: {
    width: 60,
    height: 60,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: SECONDARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    marginBottom: 8,
  }
});

export default ActionsScreen;
