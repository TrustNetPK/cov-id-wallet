import React, {useLayoutEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import FlatCard from '../components/FlatCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import {themeStyles} from '../theme/Styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ConfirmationDialog from '../components/ConfirmationDialog';
import {getItem, deleteActionByConnId, saveItem} from '../helpers/Storage';
import {authenticate} from '../helpers/Authenticate';
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
  React.useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
  });
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
  }, [isAction]);

  const updateActionsList = () => {
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
        getItem(ConstantsList.PROOF_REQ).then((actions2) => {
          if (actions2 != null) {
            let proofActionsList = JSON.parse(actions2);
            finalObj = finalObj.concat(proofActionsList);
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
              ToastAndroid.show('Token has been refreshed', ToastAndroid.SHORT);
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
    //Move item to connection screen
    let conns = [];
    let data = await getItem(ConstantsList.CONNECTIONS);
    if (data == null) {
      conns = conns.concat(selectedItemObj);
    } else {
      try {
        conns = JSON.parse(data);
        conns = conns.concat(selectedItemObj);
      } catch (e) {
        conns = [];
      }
    }
    await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(conns));
    //======For FingerPrint Authentication
    // let authResult = await authenticate();
    // if (authResult == true) {
    //fetch wallet credentials
    //=========================================
    let baseURL = 'https://trinsic.studio/url/';
    let inviteUrl = baseURL + modalData.data;
    let userToken = await getItem(ConstantsList.USER_TOKEN);
    let userID = await getItem(ConstantsList.USER_ID);
    let walletSecret = await getItem(ConstantsList.WALLET_SECRET);
    storeUid(userID);
    storeSecret(walletSecret);
    // make API call
    await fetch(ConstantsList.BASE_URL + `/api/connection/accept_connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        inviteUrl: inviteUrl,
      }),
    })
      .then((inviteResult) =>
        inviteResult.json().then((data) => {
          if (data.success == false && data.hasTokenExpired == true) {
            if (hasToken) AuthenticateUser();
            setTokenExpired(false);
          } else {
            console.log('Token Available');
            //Remove item from actions
            setModalVisible(false);
            deleteActionByConnId(
              selectedItemObj.type,
              selectedItemObj.data,
            ).then((actions) => {
              updateActionsList();
            });
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
    deleteActionByConnId(selectedItemObj.type, selectedItemObj.data).then(
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
                      : 'Digital Proof Request',
                  );
                  let subtitle =
                    'Click to view the ' +
                    header.toLowerCase() +
                    ' from ' +
                    v.organizationName;
                  let imgURI = {uri: v.imageUrl};
                  return (
                    <TouchableOpacity key={i} onPress={() => toggleModal(v)}>
                      <FlatCard
                        image={imgURI}
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
