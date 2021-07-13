import React, { useLayoutEffect, useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ActivityIndicator, Linking, Platform } from 'react-native';
import FlatCard from '../components/FlatCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ConfirmationDialog from '../components/ConfirmationDialog';
import CredConfirmationDialog from '../components/CredConfirmationDialog';
import { getItem, deleteActionByConnId, saveItem, deleteActionByCredId } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import NetInfo from '@react-native-community/netinfo';
import { ScrollView } from 'react-native-gesture-handler';
import BorderButton from '../components/BorderButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BACKGROUND_COLOR, BLACK_COLOR } from '../theme/Colors';
import { AuthenticateUser } from '../helpers/Authenticate';
import { showMessage } from '../helpers/Toast';
import { RefreshContext } from '../context/RefreshContextProvider';
import { accept_credential, get_all_credentials } from '../gateways/credentials';
import { accept_connection } from '../gateways/connections';
import { initNotifications, receiveNotificationEventListener } from '../helpers/Notifications';
// import { useCredentials } from '../hooks/addCredentialToActionList'

function ActionsScreen({ navigation }) {
  //Context
  const { refreshState, setRefreshState } = useContext(RefreshContext);
  // let useCred = useCredentials();
  const [isLoading, setIsLoading] = useState(false);
  const [credModalVisible, setCredModalVisible] = useState(false);
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
  var requestArray = [];
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
    // Setting up notifications
    initNotifications(localReceiveNotificationEventListener);

    // Setting listener for deeplink
    if (!deepLink) {
      Linking.addEventListener('url', ({ url }) => {
        getUrl(url);
      });
    }
    return () => Linking.removeAllListeners();
  }, [])

  function onRegister(token) {
    console.log(token);
  }

  function onNotif(notification) {
    console.log('notification => ', notification);
  }

  useEffect(() => {
    if (refreshState) {
      setRefreshState(false);
      updateActionsList();
    }
  }, [refreshState])

  useFocusEffect(
    React.useCallback(() => {
      updateActionsList();
      return;
    }, [isAction]),
  );


  React.useLayoutEffect(() => {
    navigation
      .dangerouslyGetParent()
      .setOptions(isAction ? headerOptions : undefined);
  }, [isAction, navigation]);

  // Notification Receiver
  const localReceiveNotificationEventListener = async (notification) => {
    await receiveNotificationEventListener(notification);
    setRefreshState(true);
  }

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
      //RootNavigation.navigate('Details');
    }
  };

  const updateActionsList = () => {
    var connList = null;
    getItem(ConstantsList.CONNECTIONS)
      .then((connectionList) => {
        if (connectionList != null) {
          let cList = JSON.parse(connectionList);
          return cList;
        }
      })
      .then((connections) => {
        if (connections != undefined) connList = connections;
      });
    getItem(ConstantsList.CONNEC_REQ)
      .then((actions) => {
        if (actions != null) {
          let credActionsList = JSON.parse(actions);
          return credActionsList;
        }
      })
      .then((credlist) => {
        var finalObj = [];
        if (credlist != undefined) {
          finalObj = finalObj.concat(credlist);
        }
        getItem(ConstantsList.CRED_REQ).then((actions2) => {
          if (actions2 != null) {
            let credentialRequestList = JSON.parse(actions2);
            if (
              credentialRequestList != null ||
              credentialRequestList != undefined
            ) {
              for (let j = 0; j < credentialRequestList.length; j++) {
                if (connList != null) {
                  for (let k = 0; k < connList.length; k++) {
                    if (
                      credentialRequestList[j].connectionId ===
                      connList[k].connectionId
                    ) {
                      credentialRequestList[j].imageUrl = connList[k].imageUrl;
                      credentialRequestList[j].organizationName =
                        connList[k].name;
                    }
                    console.log(connList[k].connectionId);
                  }
                }
              }
            }
            finalObj = finalObj.concat(credentialRequestList);
          }

          if (finalObj.length > 0) {
            setActionsList(finalObj);
            setAction(true);
          } else {
            setAction(false);
          }
        });
      })
      .catch((e) => {
        console.log(e)
      });
  };

  const toggleModal = (v) => {
    setSelectedItem(JSON.stringify(v));

    let data = {};
    data = JSON.parse(JSON.stringify(v));

    if (data.type == ConstantsList.CONNEC_REQ) {
      setModalData(data);
      setModalVisible(true);
    } else if (data.type == ConstantsList.CRED_REQ) {
      setModalData(data);
      setCredModalVisible(true);
    }
  };

  const acceptModal = async (v) => {
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
            updateActionsList();
          } else {
            showMessage('ZADA Wallet', result.data.error);
            return
          }

          // Update connection screen.
          let conns = [];
          let connectionsdata = await getItem(ConstantsList.CONNECTIONS)
          if (connectionsdata == null) {
            conns = conns.concat(result.data.connection);
          } else {
            try {
              conns = JSON.parse(connectionsdata);
              conns = conns.concat(result.data.connection);
            } catch (e) {
              console.log('Error Occurred ' + e);
              conns = [];
            }
            saveItem(ConstantsList.CONNECTIONS, JSON.stringify(conns));
            setIsLoading(false);
          }
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

  const acceptCredModal = async () => {
    let selectedItemObj = JSON.parse(selectedItem);
    try {
      setCredModalVisible(false);
      setIsLoading(true);

      // Accept credentials Api call.
      let result = await accept_credential(selectedItemObj.credentialId);
      if (result.data.success) {
        await deleteActionByCredId(ConstantsList.CRED_REQ, selectedItemObj.credentialId)
        updateActionsList();
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

  const rejectModal = (v) => {
    let selectedItemObj = JSON.parse(selectedItem);
    setModalVisible(false);

    if (selectedItemObj.type === ConstantsList.CONNEC_REQ) {
      deleteActionByConnId(ConstantsList.CONNEC_REQ, selectedItemObj.metadata).then(
        (actions) => {
          updateActionsList();
        },
      );
    }

    if (selectedItemObj.type === ConstantsList.CRED_REQ) {
      setCredModalVisible(false);
      deleteActionByCredId(ConstantsList.CRED_REQ, selectedItemObj.credentialId).then(
        (actions) => {
          updateActionsList();
        },
      );
    }
  };

  const dismissModal = (v) => {
    setModalVisible(false);
  };

  const dismissCredModal = () => {
    setCredModalVisible(false)
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
            <ScrollView showsVerticalScrollIndicator={true}>
              <ConfirmationDialog
                isVisible={isModalVisible}
                toggleModal={toggleModal}
                rejectModal={rejectModal}
                data={modalData}
                dismissModal={dismissModal}
                acceptModal={acceptModal}
                text=" has invited you to connect."
                modalType="action"
                isIconVisible={true}
              />
              <CredConfirmationDialog
                isVisible={credModalVisible}
                toggleModal={toggleModal}
                rejectModal={rejectModal}
                data={modalData}
                dismissModal={dismissCredModal}
                acceptModal={acceptCredModal}
                text=" has sent you a credential offer do you want to accept it?"
                modalType="action"
                isIconVisible={true}
              />
              {actionsList !== undefined &&
                actionsList.map((v, i) => {
                  let header = String(
                    v.type === 'connection_request'
                      ? 'Connection Request'
                      : 'Credential Request',
                  );
                  let subtitle =
                    'Click to view the ' +
                    header.toLowerCase() +
                    ' from ' +
                    v.organizationName;
                  let imgURI = v.imageUrl;
                  return (
                    <FlatCard
                      onPress={() => toggleModal(v)}
                      imageURL={imgURI}
                      heading={header}
                      text={subtitle}
                    />
                  );
                })}
            </ScrollView>
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
              flex: 1,
              justifyContent: "center"
            }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  navigation.navigate('QRScreen');
                }}>
                <BorderButton
                  text="QR CODE"
                  color={BLACK_COLOR}
                  textColor={BLACK_COLOR}
                  backgroundColor={BACKGROUND_COLOR}
                  isIconVisible={true}
                />
              </TouchableOpacity>
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
});

export default ActionsScreen;
