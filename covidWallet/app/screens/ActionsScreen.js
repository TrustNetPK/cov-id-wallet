import React, {useLayoutEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, ToastAndroid, Linking} from 'react-native';
import FlatCard from '../components/FlatCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import {themeStyles} from '../theme/Styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ConfirmationDialog from '../components/ConfirmationDialog';
import {getItem, deleteActionByConnId, saveItem} from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import NetInfo from '@react-native-community/netinfo';
import {ScrollView} from 'react-native-gesture-handler';
import BorderButton from '../components/BorderButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BACKGROUND_COLOR, BLACK_COLOR} from '../theme/Colors';

function ActionsScreen({navigation}) {
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

  const getUrl = async () => {
    const initialUrl = await Linking.getInitialURL();
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

  React.useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
    if (!deepLink) getUrl();
  }, [deepLink]);
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
      .catch((e) => {});
  };

  const toggleModal = (v) => {
    setSelectedItem(JSON.stringify(v));
    setModalData(JSON.parse(JSON.stringify(v)));
    setModalVisible(true);
  };

  const AuthenticateUser = () => {
    if (networkState) {
      fetch(ConstantsList.BASE_URL + `/api/authenticate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: Uid,
          secretPhrase: secret,
        }),
      }).then((credsResult) =>
        credsResult.json().then((data) => {
          try {
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              saveItem(ConstantsList.USER_TOKEN, response.token);
              acceptModal();
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
  };

  const acceptModal = async (v) => {
    let selectedItemObj = JSON.parse(selectedItem);
    let baseURL = 'https://trinsic.studio/url/';
    let iUrl = baseURL + modalData.metadata;
    let userToken = await getItem(ConstantsList.USER_TOKEN);
    let userID = await getItem(ConstantsList.USER_ID);
    let walletSecret = await getItem(ConstantsList.WALLET_SECRET);
    storeUid(userID);
    storeSecret(walletSecret);
    // make API call
    await fetch(ConstantsList.BASE_URL + `/api/connection/accept_connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        inviteUrl: iUrl,
      }),
    })
      .then((inviteResult) =>
        inviteResult.json().then((data) => {
          if (data.success == false && data.hasTokenExpired == true) {
            getItem(ConstantsList.USER_ID).then((userID) => {
              getItem(ConstantsList.WALLET_SECRET).then((walletSecret) => {
                if (hasToken) AuthenticateUser(userID, walletSecret);
                setTokenExpired(false);
              });
            });
          } else if (data.success == true) {
            setModalVisible(false);
            deleteActionByConnId(
              selectedItemObj.type,
              selectedItemObj.metadata,
            ).then((actions) => {
              updateActionsList();
            });
            //Move item to connection screen
            let conns = [];
            getItem(ConstantsList.CONNECTIONS).then((connectionsdata) => {
              if (connectionsdata == null) {
                conns = conns.concat(data.connection);
              } else {
                try {
                  conns = JSON.parse(connectionsdata);
                  conns = conns.concat(data.connection);
                } catch (e) {
                  console.log('Error Occurred ' + e);
                  conns = [];
                }
              }
              saveItem(ConstantsList.CONNECTIONS, JSON.stringify(conns));
            });
          } else {
            //Remove item from actions
            setModalVisible(false);
          }
        }),
      )
      .catch((e) => console.log(e));

    //======For FingerPrint Authentication
    // } else {
    //   // do nothing
    //   setModalVisible(false);
    // }
    //================================
  };

  const rejectModal = (v) => {
    let selectedItemObj = JSON.parse(selectedItem);
    setModalVisible(false);
    deleteActionByConnId(selectedItemObj.type, selectedItemObj.metadata).then(
      (actions) => {
        updateActionsList();
      },
    );
  };

  const dismissModal = (v) => {
    setModalVisible(false);
  };

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Actions" />
      {isAction ? (
        <>
          <View>
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
                  console.log('Image Url ' + imgURI);
                  return (
                    <TouchableOpacity key={i} onPress={() => toggleModal(v)}>
                      <FlatCard
                        imageURL={imgURI}
                        heading={header}
                        text={subtitle}
                      />
                    </TouchableOpacity>
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
        </>
      )}
    </View>
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
