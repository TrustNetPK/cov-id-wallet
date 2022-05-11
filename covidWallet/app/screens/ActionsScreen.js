import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {SwipeListView} from 'react-native-swipe-list-view';
import FlatCard from '../components/FlatCard';
import TextComponent from '../components/TextComponent';
import ActionDialog from '../components/Dialogs/ActionDialog';
import HeadingComponent from '../components/HeadingComponent';

import messaging from '@react-native-firebase/messaging';

import {themeStyles} from '../theme/Styles';
import {BLACK_COLOR, RED_COLOR, SECONDARY_COLOR} from '../theme/Colors';

import {
  getItem,
  ls_addConnection,
  deleteActionByConnId,
  deleteActionByCredId,
  deleteActionByVerID,
  saveItem,
} from '../helpers/Storage';
import ConstantsList, {
  CONN_REQ,
  CRED_OFFER,
  VER_REQ,
} from '../helpers/ConfigApp';

import {AuthenticateUser} from '../helpers/Authenticate';
import {showMessage, showAskDialog, _showAlert} from '../helpers/Toast';
import {biometricVerification} from '../helpers/Biometric';
import {
  addCredentialToActionList,
  addVerificationToActionList,
  getActionHeader,
} from '../helpers/ActionList';

import {
  accept_credential,
  delete_credential,
  fetch_signature_by_cred_id,
  getToken,
  get_credential,
} from '../gateways/credentials';
import {accept_connection, delete_connection} from '../gateways/connections';
import {
  delete_verification,
  submit_verification,
} from '../gateways/verifications';
import useNotification from '../hooks/useNotification';
import http_client from '../gateways/http_client';
import OverlayLoader from '../components/OverlayLoader';
import {analytics_log_action_screen} from '../helpers/analytics';
import PincodeModal from '../components/PincodeModal';
import {pincodeRegex} from '../helpers/validation';
import ConfirmPincodeModal from '../components/ConfirmPincodeModal';
import PullToRefresh from '../components/PullToRefresh';
import EmptyList from '../components/EmptyList';
import {_handleAxiosError} from '../helpers/AxiosResponse';
import VersionModal from '../components/VersionModal';

const DIMENSIONS = Dimensions.get('screen');

function ActionsScreen({navigation}) {
  // States
  const [loaderText, setLoaderText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAction, setAction] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [actionsList, setActionsList] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [Uid, storeUid] = useState();
  const [secret, storeSecret] = useState('');
  const [networkState, setNetworkState] = useState(false);
  const [deepLink, setDeepLink] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  // For Pincode
  const [isPincodeSet, setIsPincode] = useState(false);
  const [isPicodeChecked, setPincodeChecked] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [confirmPincode, setConfirmPincode] = useState('');
  const [confirmPincodeError, setConfirmPincodeError] = useState('');

  // Confirming pin
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [verifyPincode, setVerifyPincode] = useState('');
  const [verifyPincodeError, setVerifyPincodeError] = useState('');

  // Notification hook
  const {notificationReceived, isZadaAuth, authData, setZadaAuth, setAuthData} =
    useNotification();

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

  useLayoutEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
  }, []);

  useEffect(() => {
    if (!deepLink) getUrl();
  }, [deepLink]);

  useEffect(() => {
    if (isZadaAuth) {
      toggleModal(authData);
    }
  }, [isZadaAuth, authData]);

  useEffect(() => {
    // Setting listener for deeplink
    let deepEvent = undefined;
    if (!deepLink) {
      deepEvent = Linking.addEventListener('url', ({url}) => {
        getUrl(url);
      });
    }
    return () => deepEvent && deepEvent;
  }, []);

  //Checking Notification Status
  useLayoutEffect(() => {
    const _checkPermission = async () => {
      const authorizationStatus = await messaging().hasPermission();
      if (authorizationStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
        _fetchActionList();
        Alert.alert(
          'Zada Wallet',
          'Notifications are disabled. You will not be able to receive alerts for the actions. Pull down to refresh and receive the latest actions.',
          [
            {
              text: 'Okay',
              onPress: () => {},
              style: 'cancel',
            },
          ],
          {
            cancelable: true,
          },
        );
      }
    };
    _checkPermission();
    return;
  }, []);

  // Update Actionlist if notificationReceived is true.
  useEffect(() => {
    if (notificationReceived) {
      updateActionsList();
    }
  }, [notificationReceived]);

  useFocusEffect(
    React.useCallback(() => {
      updateActionsList();
      return;
    }, [isAction]),
  );

  React.useLayoutEffect(() => {
    navigation.dangerouslyGetParent().setOptions(headerOptions);
  }, [isAction, navigation]);

  const getUrl = async (url) => {
    let initialUrl = '';
    if (url != undefined) {
      initialUrl = url;
    } else {
      initialUrl = await Linking.getInitialURL();
    }
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
    let connection_request = JSON.parse(
      (await getItem(ConstantsList.CONN_REQ)) || null,
    );

    // If connection_request available
    if (connection_request != null) {
      if (connection_request.find((element) => element == null) !== null)
        finalObj = finalObj.concat(connection_request);
    }

    /** CREDENTIALS OFFER */
    // Get Credential Offers

    let credential_offer = JSON.parse(
      (await getItem(ConstantsList.CRED_OFFER)) || null,
    );

    // If credential_offer available
    if (credential_offer != null) {
      if (credential_offer.find((element) => element == null) !== null)
        finalObj = finalObj.concat(credential_offer);
    }

    /** VERIFICATION OFFER */
    // Get verification Offers
    let verification_offers = JSON.parse(
      (await getItem(ConstantsList.VER_REQ)) || null,
    );

    // If credential_offer available
    if (verification_offers != null) {
      if (verification_offers.find((element) => element == null) !== null)
        finalObj = finalObj.concat(verification_offers);
    }

    finalObj = finalObj.filter((element) => {
      if (element.organizationName) {
        return element;
      } else {
        delete_credential_offer_request(element);
      }
    });

    // SetState ActionList
    if (finalObj.length > 0) {
      setActionsList(finalObj);
      setAction(true);
    } else {
      setAction(false);
    }
  };

  const _fetchActionList = async () => {
    setRefreshing(true);
    let credentials = [],
      connections = [];

    const token = await getToken();

    // Fetching Connections and Saving in Connections
    try {
      let result = await http_client({
        method: 'GET',
        url: '/api/connection/get_all_connections',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (result.data.success) {
        connections = result.data.connections;
        await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(connections));
      } else {
        console.log(result.data.error);
      }
    } catch (error) {
      _handleAxiosError(error);
    }

    // Fetching Credentials offers
    try {
      let result = await http_client({
        method: 'GET',
        url: '/api/credential/get_all_credential_offers',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (result.data.success) {
        credentials = result.data.offers;

        for (let i = 0; i < result.data.offers.length; ++i) {
          await addCredentialToActionList(result.data.offers[i].credentialId);
        }
      } else {
        console.log(result.data.error);
      }
    } catch (error) {
      _handleAxiosError(error);
    }

    await addVerificationToActionList();

    updateActionsList();
    setRefreshing(false);
  };

  const toggleModal = (v) => {
    setSelectedItem(JSON.stringify(v));

    let data = JSON.parse(JSON.stringify(v));

    setModalData(data);
    setModalVisible(true);
  };

  const acceptModal = async (v) => {
    if (!isLoading) {
      if (v.type == CRED_OFFER) {
        setLoaderText(
          'Please wait! we are receiving your certificate this may take around ~10 seconds...',
        );
        handleCredentialRequest();
      } else if (v.type == VER_REQ) {
        setLoaderText(
          'Please wait! we are verifying your certificate this may take around ~10 seconds...',
        );
        handleVerificationRequests(v);
      } else if (v.type == CONN_REQ) {
        setLoaderText(
          'Please wait! we are creating a connection this may take around ~10 seconds...',
        );
        handleConnectionRequest(v);
      }
    }
  };

  // Checks is connection already exists or not using name
  const _isConnectionAlreadyExist = async () => {
    let selectedItemObj = JSON.parse(selectedItem);
    let find = false;

    const connections = JSON.parse(await getItem(ConstantsList.CONNECTIONS));

    for (let i = 0; i < connections.length; ++i) {
      if (
        connections[i].name.toLowerCase() ===
        selectedItemObj.organizationName.toLowerCase()
      )
        find = true;
    }

    // Delete connection action
    if (find) {
      await deleteActionByConnId(
        selectedItemObj.type,
        selectedItemObj.credentialId,
      );
      updateActionsList();
    }

    return find;
  };

  // Checks is credential already exists or not using name
  const _isCredentialAlreadyExist = async () => {
    let selectedItemObj = JSON.parse(selectedItem);
    let find = false;

    const credentials = JSON.parse(await getItem(ConstantsList.CREDENTIALS));

    for (let i = 0; i < credentials.length; ++i) {
      if (credentials[i].credentialId === selectedItemObj.credentialId)
        find = true;
    }

    // Delete credential action
    if (find) {
      await deleteActionByCredId(
        selectedItemObj.type,
        selectedItemObj.credentialId,
      );
      updateActionsList();
    }

    return find;
  };

  // Checks is verification request already exists or not using name
  const _isVerRequestAlreadyExist = async () => {
    let selectedItemObj = JSON.parse(selectedItem);
    let find = false;

    const ver_requests = JSON.parse(await getItem(ConstantsList.VER_REQ));

    for (let i = 0; i < ver_requests.length; ++i) {
      if (ver_requests[i].verificationId === selectedItemObj.verificationId)
        find = true;
    }

    // Delete credential action
    if (find) {
      await deleteActionByVerID(selectedItemObj.verificationId);
      updateActionsList();
    }

    return find;
  };

  // Handle Connection Request
  const handleConnectionRequest = async () => {
    if (networkState) {
      setIsLoading(true);

      if (!(await _isConnectionAlreadyExist())) {
        // Connection is not exist
        let resp = await AuthenticateUser();

        if (resp.success) {
          let selectedItemObj = JSON.parse(selectedItem);

          let userID = await getItem(ConstantsList.USER_ID);
          let walletSecret = await getItem(ConstantsList.WALLET_SECRET);

          storeUid(userID);
          storeSecret(walletSecret);

          setModalVisible(false);

          try {
            // Accept connection Api call.
            let result = await accept_connection(selectedItemObj.metadata);

            if (result.data.success) {
              await deleteActionByConnId(
                selectedItemObj.type,
                selectedItemObj.credentialId,
              );
              // Update connection screen.
              await ls_addConnection(result.data.connection);

              updateActionsList();
              setTimeout(() => {
                _showSuccessAlert('conn');
              }, 500);
            } else {
              showMessage('ZADA Wallet', result.data.error);
              return;
            }
            setIsLoading(false);
          } catch (e) {
            setIsLoading(false);
          }
        } else {
          showMessage('ZADA Wallet', resp.data.message);
          setIsLoading(false);
        }
      } else {
        // Connection is already exists
        setModalVisible(false);
        setIsLoading(false);
        showMessage('ZADA Wallet', 'Connection is already accepted');
      }
    } else {
      showMessage('ZADA Wallet', 'Internet Connection is not available');
    }
  };

  // Handle Certificate Request
  const handleCredentialRequest = async () => {
    let selectedItemObj = JSON.parse(selectedItem);
    try {
      setModalVisible(false);
      setIsLoading(true);

      if (!(await _isCredentialAlreadyExist())) {
        // Accept credentials Api call.
        let result = await accept_credential(selectedItemObj.credentialId);

        if (result.data.success) {
          // Delete Action
          await deleteActionByCredId(
            ConstantsList.CRED_OFFER,
            selectedItemObj.credentialId,
          );

          // Update ActionList
          updateActionsList();

          // Fetching credential details
          const credResponse = await get_credential(
            selectedItemObj.credentialId,
          );
          const cred = credResponse.data.credential;

          // fetching local connections and credentials
          let connections = await getItem(ConstantsList.CONNECTIONS);
          let credentials = await getItem(ConstantsList.CREDENTIALS);

          // Parsing JSON
          let connectionsList = JSON.parse(connections) || [];
          let credentialsList = JSON.parse(credentials) || [];

          // Finding corresponsing connection to this credential
          let item = connectionsList.find(
            (c) => c.connectionId == cred.connectionId,
          );

          const qr_code = await fetch_signature_by_cred_id(
            selectedItemObj.credentialId,
            selectedItemObj.values,
          );

          // Putting image, type and title in credential
          let obj = {
            ...cred,
            imageUrl: item.imageUrl,
            organizationName: item.name,
            qrCode: qr_code.success ? qr_code.qrcode : undefined,
            type:
              cred.values != undefined && cred.values.Type != undefined
                ? cred.values.Type
                : (cred.values != undefined || cred.values != null) &&
                  cred.values['Vaccine Name'] != undefined &&
                  cred.values['Vaccine Name'].length != 0 &&
                  cred.values['Dose'] != undefined &&
                  cred.values['Dose'].length != 0
                ? 'COVIDpass (Vaccination)'
                : 'Digital Certificate',
          };

          // Adding updated credential object to credentials list
          credentialsList.unshift(obj);

          // Saving updated credentials list in local storage
          await saveItem(
            ConstantsList.CREDENTIALS,
            JSON.stringify(credentialsList),
          );

          setTimeout(() => {
            _showSuccessAlert('cred');
          }, 500);
        } else {
          showMessage('ZADA Wallet', 'Invalid Credential Offer');
        }
        setIsLoading(false);
      } else {
        // Credential is already exist
        setModalVisible(false);
        setIsLoading(false);
        showMessage('ZADA Wallet', 'Credential offer is already accepted');
      }
    } catch (e) {
      showMessage('ZADA Wallet', e);
      setIsLoading(false);
    }
  };

  // put analytic for action screen
  const _sendActionScreenAnalytic = async () => {
    const value = await getItem('action_analytic');
    if (value != null && value != undefined) {
      analytics_log_action_screen();
      await getItem('action_analytic', '1');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      _sendActionScreenAnalytic();
    }, []),
  );

  const accept_verification_request = async (selectedItemObj, data) => {
    let alreadyExist = await _isVerRequestAlreadyExist();

    if (alreadyExist) {
      try {
        let policyName = selectedItemObj.policy.attributes[0].policyName;

        // Submit Verification Api call
        let result = await submit_verification(
          selectedItemObj.verificationId,
          data.credentialId,
          policyName,
        );

        if (result.data.success) {
          await deleteActionByVerID(selectedItemObj.verificationId).then(() => {
            updateActionsList();
          });

          _showAlert(
            'Zada Wallet',
            'Verification request has been submitted successfully',
          );
        } else {
          showMessage('Zada', result.data.error);
        }

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      setModalVisible(false);
      setIsLoading(false);
      showMessage('ZADA Wallet', 'Verification request is already accepted');
    }
  };

  // Handle Verification Request
  const handleVerificationRequests = async (data) => {
    setDialogData(data);

    let selectedItemObj = JSON.parse(selectedItem);

    let checkbiometric = await biometricVerification();

    if (checkbiometric) {
      setModalVisible(false);
      accept_verification_request(selectedItemObj, data);
    } else {
      // showMessage(
      //   'ZADA Wallet',
      //   'Biometric verification is required for accepting verification request',
      // );

      // Check Either pincode set or not
      if (isPincodeSet) {
        setModalVisible(false);
        setTimeout(() => {
          setShowConfirmModal(true);
        }, 100);
      }
    }

    // biometricVerification()
    //   .then((res) => {
    //     setModalVisible(false);
    //     setIsLoading(true);
    //   })
    //   .catch(() => {
    //     showMessage(
    //       'ZADA Wallet',
    //       'Biometric verification is required for accepting verification request',
    //     );
    //   });
  };

  const delete_credential_offer_request = async (req) => {
    if (req.type === ConstantsList.CRED_OFFER) {
      try {
        delete_credential(req.credentialId);
        deleteActionByCredId(ConstantsList.CRED_OFFER, req.credentialId).then(
          (actions) => {
            //  updateActionsList();
          },
        );
      } catch (e) {
        console.log('error', e);
      }
    }
    if (req.type === ConstantsList.VER_REQ) {
      try {
        // Submit Verification Api call
        let result = await delete_verification(req.verificationId);

        if (result.data.success) {
          await deleteActionByVerID(req.verificationId);
        }
      } catch (e) {}
    }
  };

  const delete_verification_request = async (selectedItemObj) => {
    try {
      // Submit Verification Api call
      let result = await delete_verification(selectedItemObj.verificationId);

      if (result.data.success) {
        await deleteActionByVerID(selectedItemObj.verificationId);
        updateActionsList();

        setZadaAuth(false);
        setAuthData(null);
      } else {
        showMessage('Zada', result.data.error);
      }

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }

    _showAlert(
      'Zada Wallet',
      'Verification request has been deleted successfully',
    );
  };
  // Reject Modal
  const rejectModal = async (v) => {
    let selectedItemObj = {};
    if (v.connectionId != undefined) {
      selectedItemObj = v;
    } else {
      selectedItemObj = JSON.parse(selectedItem);
    }

    setModalVisible(false);

    if (selectedItemObj.type === ConstantsList.CONN_REQ) {
      // Delete connection api call.
      delete_connection(selectedItemObj.connectionId);

      // Delete connection locally.
      deleteActionByConnId(
        ConstantsList.CONN_REQ,
        selectedItemObj.credentialId,
      ).then((actions) => {
        updateActionsList();
      });
    }

    if (selectedItemObj.type === ConstantsList.CRED_OFFER) {
      setModalVisible(false);

      // Delete connection locally.
      deleteActionByConnId(
        ConstantsList.CRED_OFFER,
        selectedItemObj.credentialId,
      )
        .then((actions) => {
          updateActionsList();
        })
        .catch((error) => {
          console.log('error', error);
        });

      delete_credential(selectedItemObj.credentialId).then((actions) => {
        updateActionsList();
      });
    }

    if (selectedItemObj.type === ConstantsList.VER_REQ) {
      // Biometric Verification

      let checkbiometric = await biometricVerification();

      if (checkbiometric) {
        setModalVisible(false);
        delete_verification_request(selectedItemObj);
      } else if (isPincodeSet) {
        setModalVisible(false);
        setTimeout(() => {
          setShowConfirmModal(true);
        }, 100);
      }
      // biometricVerification()
      //   .then((res) => {
      //     console.log('res', res);
      //     setModalVisible(false);
      //     delete_verification_request(selectedItemObj);
      //   })
      //   .catch(() => {
      //     if (isPincodeSet) {
      //       setModalVisible(false);
      //       setTimeout(() => {
      //         setShowConfirmModal(true);
      //       }, 100);

      //       // delete_verification_request(selectedItemObj);
      //     }
      //   });
    }
  };

  // Function that will show alert on acceptance of connection and credential
  const _showSuccessAlert = (action) => {
    let message = '';
    if (action == 'conn') message = 'Your connection is created successfully.';
    else if (action == 'cred')
      message = 'You have received a certificate successfully.';
    else if (action == 'ver')
      message = 'Your verification request is fulfilled successfully.';

    Alert.alert(
      'Zada Wallet',
      `${message}`,
      [
        {
          text: 'Okay',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const dismissModal = (v) => {
    setModalVisible(false);
    setModalVisible(false);
  };

  const onDeletePressed = (item) => {
    showAskDialog(
      'Are you sure?',
      'Are you sure you want to delete this request?',
      () => rejectModal(item),
      () => {},
    );
  };

  // Checking is Pincode set or not
  const _checkPinCode = async () => {
    try {
      const isPincode = await getItem(ConstantsList.PIN_CODE);
      if (isPincode != null && isPincode != undefined && isPincode.length != 0)
        setIsPincode(true);
      else setIsPincode(false);
    } catch (error) {
      setPincodeChecked(false);
      showMessage('Zada Wallet', error.toString());
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      _checkPinCode();
    }, []),
  );

  const _setPinCode = async () => {
    if (pincode.length == 0) {
      setPincodeError('Pincode is required.');
      return;
    }
    setPincodeError('');

    if (!pincodeRegex.test(pincode)) {
      setPincodeError('Pincode should contain only 6 digits.');
      return;
    }
    setPincodeError('');

    if (confirmPincode.length == 0) {
      setConfirmPincodeError('Confirm pincode is required.');
      return;
    }
    setConfirmPincodeError('');

    if (!pincodeRegex.test(confirmPincode)) {
      setConfirmPincodeError('Confirm pincode should contain only 6 digits.');
      return;
    }
    setConfirmPincodeError('');

    if (pincode != confirmPincode) {
      showMessage(
        'Zada Wallet',
        'Pincode and confirm pincode are not same. Please check them carefully',
      );
    }

    // Saving pincode in async
    try {
      await saveItem(ConstantsList.PIN_CODE, pincode.toString());

      setIsPincode(true);
      showMessage(
        'Zada Wallet',
        'Your pincode is set successfully. Please keep it safe and secure.',
      );
      setPincode('');
      setConfirmPincode('');
    } catch (error) {
      showMessage('Zada Wallet', error.toString());
    }
  };

  const _confirmingPincode = async () => {
    if (verifyPincode.length == 0) {
      setVerifyPincodeError('Pincode is required.');
      return;
    }
    setVerifyPincodeError('');

    if (!pincodeRegex.test(verifyPincode)) {
      setVerifyPincodeError('Pincode should contain only 6 digits.');
      return;
    }
    setVerifyPincodeError('');

    const code = await getItem(ConstantsList.PIN_CODE);
    if (verifyPincode == code) {
      setShowConfirmModal(false);
      setModalVisible(false);
      setIsLoading(true);

      // process request further
      let selectedItemObj = JSON.parse(selectedItem);

      try {
        // Delet Verification Api call
        if (dialogData == null) {
          if (!isLoading) {
            setLoaderText('Deleting Request...');
            delete_verification_request(selectedItemObj);
          }
        } else {
          // Submit Verification Api call
          let policyName = selectedItemObj.policy.attributes[0].policyName;
          let result = await submit_verification(
            selectedItemObj.verificationId,
            dialogData.credentialId,
            policyName,
          );

          if (result.data.success) {
            await deleteActionByVerID(selectedItemObj.verificationId);
            updateActionsList();
            _showAlert(
              'Zada Wallet',
              'Verification request has been submitted successfully',
            );
          } else {
            _showAlert('Zada Wallet', result.data.error);
          }
        }

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        _showAlert('ZADA Wallet', e.toString());
      }
    } else {
      showMessage(
        'Zada Wallet',
        'You entered incorrect pincode. Please check your pincode and try again',
      );
    }
  };

  return (
    <View style={themeStyles.mainContainer}>
      <ConfirmPincodeModal
        isVisible={showConfirmModal}
        pincode={verifyPincode}
        pincodeError={verifyPincodeError}
        onPincodeChange={(text) => {
          setVerifyPincode(text);
          if (text.length == 0 || text == undefined) setVerifyPincodeError('');
        }}
        onCloseClick={() => {
          setShowConfirmModal(!showConfirmModal);
        }}
        onContinueClick={_confirmingPincode}
      />

      {/* PinCode Modal */}
      {isPicodeChecked && (
        <PincodeModal
          isVisible={!isPincodeSet}
          pincode={pincode}
          onPincodeChange={(text) => {
            setPincode(text);
            if (text.length == 0) setPincodeError('');
          }}
          pincodeError={pincodeError}
          confirmPincode={confirmPincode}
          onConfirmPincodeChange={(text) => {
            setConfirmPincode(text);
            if (text.length == 0) setConfirmPincodeError('');
          }}
          confirmPincodeError={confirmPincodeError}
          onCloseClick={() => {
            setIsPincode(true);
          }}
          onContinueClick={_setPinCode}
        />
      )}

      <PullToRefresh isLoading={isLoading} />

      <HeadingComponent text="Actions" />

      {isLoading ? <OverlayLoader text={loaderText} /> : null}

      {isAction ? (
        <>
          <View pointerEvents={isLoading ? 'none' : 'auto'}>
            {isModalVisible && (
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
            )}
            <SwipeListView
              refreshControl={
                <RefreshControl
                  tintColor={'#7e7e7e'}
                  refreshing={refreshing}
                  onRefresh={_fetchActionList}
                />
              }
              useFlatList
              disableRightSwipe
              data={actionsList}
              style={{
                flexGrow: 1,
              }}
              contentContainerStyle={{
                width: '100%',
                height: DIMENSIONS.height,
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
                );
              }}
              renderHiddenItem={({item, index}) => (
                <View key={index} style={styles.rowBack}>
                  <TextComponent text="" />
                  <Animated.View>
                    <TouchableOpacity
                      onPress={() => onDeletePressed(item)}
                      activeOpacity={0.8}
                      style={[styles.swipeableViewStyle]}>
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
        <EmptyList
          refreshing={refreshing}
          onRefresh={_fetchActionList}
          text="There are no actions to complete, Please scan a QR code to either get a digital certificate or to prove it."
          image={require('../assets/images/action.png')}
          onPress={() => {
            navigation.navigate('QRScreen');
          }}
          screen="actions"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRightIcon: {
    padding: 10,
    color: BLACK_COLOR,
  },
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
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: SECONDARY_COLOR,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    marginBottom: 8,
  },
});

export default ActionsScreen;
