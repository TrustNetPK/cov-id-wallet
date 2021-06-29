import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  getItem,
  saveItem,
  searchConnectionByOrganizationName,
} from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import queryString from 'query-string';
import {Buffer} from 'buffer';
import NetInfo from '@react-native-community/netinfo';
import CustomProgressBar from '../components/CustomProgressBar';

function QRScreen({route, navigation}) {
  const [scan, setScan] = useState(true);
  const [networkState, setNetworkState] = useState(false);
  const [certificate_request, setCertificateRequest] = useState('');
  const [connection_request, setConnectionRequest] = useState('');
  const [credential_request, setCredentialRequest] = useState('');
  const [proof_request, setProofRequest] = useState('');
  const [progress, setProgress] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Fetching Details');
  // const [credentialID, setCredentialID] = useState('cvc');
  // const [hasToken, setTokenExpired] = useState(true);
  var cr_arr = [];
  var cred_arr = [];
  var arr2 = [];
  var hasToken = true;
  var credentialID = '';
  var userToken = '';
  var isConnected = false;

  useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
    getItem(ConstantsList.CONNEC_REQ)
      .then((data) => {
        if (data == null) {
          cr_arr = [];
        } else {
          try {
            cr_arr = JSON.parse(data);
          } catch (e) {
            cr_arr = [];
          }
        }
        setConnectionRequest(JSON.stringify(cr_arr));
        if (route.params != undefined) {
          setScan(false);
          const {request} = route.params;
          console.log(typeof request.metadata);
          console.log(request);
          console.log(typeof JSON.stringify(request));
          const qrJSON = JSON.parse(JSON.stringify(request));
          if (request.type == 'connection_request') {
            setProgress(true);
            getResponseUrl(request.metadata, qrJSON);
          }
        }
      })
      .catch((e) => {
        console.log('Error is ' + e);
      });

    getItem(ConstantsList.CRED_REQ)
      .then((data) => {
        if (data == null) {
          cred_arr = [];
        } else {
          try {
            cred_arr = JSON.parse(data);
          } catch (e) {
            cred_arr = [];
          }
        }
        setCredentialRequest(JSON.stringify(cred_arr));
      })
      .catch((e) => {
        console.log('Error is ' + e);
      });

    getItem(ConstantsList.PROOF_REQ)
      .then((data) => {
        if (data == null) {
          arr2 = [];
        } else {
          try {
            arr2 = JSON.parse(data);
          } catch (e) {
            arr2 = [];
          }
        }
        setProofRequest(JSON.stringify(arr2));
      })
      .catch((e) => {
        console.log('Error is ' + e);
      });
  }, [
    networkState,
    connection_request,
    credential_request,
    proof_request,
    progress,
    dialogTitle,
    scan,
  ]);

  const getResponseUrl = async (inviteID, qrJSON) => {
    console.log('Get TResponse URL function Called');
    let baseURL = 'https://trinsic.studio/url/';
    await fetch(baseURL + inviteID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => {
      const parsed = queryString.parse(response.url, true);
      let urlData = Object.values(parsed)[0];
      var data = JSON.parse(Buffer.from(urlData, 'base64').toString());
      qrJSON.organizationName = data.label;
      qrJSON.imageUrl = data.imageUrl;
      getItem(ConstantsList.CONNECTIONS).then((connectionList) => {
        let QRConnList = JSON.parse(connectionList);
        let connectionExists = false;
        if (QRConnList != null) {
          for (let j = 0; j < QRConnList.length; j++) {
            //Connection Request Found in Connection List
            if (QRConnList[j].name === data.label) {
              connectionExists = true;
              break;
            } else connectionExists = false;
          } // for Loop Ends
        }
        if (connectionExists) {
          setProgress(false);
          Alert.alert(
            'ZADA',
            'Connection with ' + data.label + ' has already been created',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('MainScreen'),
              },
            ],
            {cancelable: false},
          );
        } else {
          cr_arr.push(qrJSON);
          saveItem(ConstantsList.CONNEC_REQ, JSON.stringify(cr_arr))
            .then(() => {
              setProgress(false);
              navigation.navigate('MainScreen');
            })
            .catch((e) => {
              setProgress(false);
            });
        }
      });
    });
  };

  const AuthenticateUser = (walletSecret, userID) => {
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
            console.log('Authenticate Response ' + JSON.stringify(data));
            let response = JSON.parse(JSON.stringify(data));
            if (response.success == true) {
              saveItem(ConstantsList.USER_TOKEN, response.token).then(() => {
                setDialogTitle('Fetching Credential Details');
                getCredential(response.token);
              });
            } else {
              ToastAndroid.show(response.error, ToastAndroid.SHORT);
              navigation.navigate('MainScreen');
            }
          } catch (error) {
            console.error(error);
          } finally {
            setProgress(false);
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

  const getCredential = async (userToken) => {
    console.log('Credential ID ===>' + credentialID);
    console.log('User ID ==>' + userToken);
    await fetch(
      ConstantsList.BASE_URL +
        '/api/credential/get_credential' +
        `?credentialId=${credentialID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
      },
    ).then((credentialRequest) =>
      credentialRequest.json().then((data) => {
        console.log(JSON.stringify(data));
        if (data.success == false && data.hasTokenExpired == true) {
          //Refresh the Token
          setDialogTitle('Refreshing User Token');
          getItem(ConstantsList.USER_ID).then((userID) => {
            getItem(ConstantsList.WALLET_SECRET).then((walletSecret) => {
              console.log('UID ====>' + userID);
              console.log('SEcret Phrase ====>' + walletSecret);
              if (hasToken) {
                hasToken = false;
                AuthenticateUser(walletSecret, userID);
              }
            });
          });
        } else if (data.success == true) {
          let qrJSON = data.credential;
          qrJSON.type = 'credential_offer';
          // qrJSON.connectionId = '151b5e1a-cefe-4f91-b9a3-bd5d54cc9668';
          cred_arr.push(qrJSON);
          saveItem(ConstantsList.CRED_REQ, JSON.stringify(cred_arr))
            .then(() => {
              setProgress(false);
              //navigation.navigate('MainScreen');
              //========Showing Dialog after Success
              Alert.alert(
                'ZADA',
                'Credential has been added in Actions',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('MainScreen'),
                  },
                ],
                {cancelable: false},
              );
            })
            .catch((e) => {
              setProgress(false);
              Alert.alert(
                'ZADA',
                'Failed in fetching details of connection',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('MainScreen'),
                  },
                ],
                {cancelable: false},
              );
            });
        } else {
          setProgress(false);
          Alert.alert(
            'ZADA',
            'Failed to fetch Details of Credentials',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('MainScreen'),
              },
            ],
            {cancelable: false},
          );
        }
      }),
    );
  };

  const onSuccess = (e) => {
    let title = '';
    try {
      cr_arr = JSON.parse(connection_request);
      cred_arr = JSON.parse(credential_request);
      arr2 = JSON.parse(proof_request);
    } catch {
      cr_arr = [];
      cred_arr = [];
      arr2 = [];
    }

    const qrJSON = JSON.parse(e.data);
    // if (qrJSON.type == 'connection_credential') {
    if (qrJSON.type == 'credential_offer') {
      setScan(false);
      setProgress(true);

      setDialogTitle('Fetching Credential Details');
      credentialID = qrJSON.metadata;
      getItem(ConstantsList.USER_TOKEN).then((uToken) => {
        userToken = uToken;
        getCredential(userToken);
      });

      // cred_arr.push(qrJSON);
      // saveItem(ConstantsList.CRED_REQ, JSON.stringify(cred_arr))
      //   .then(() => {})
      //   .catch((e) => {});
    } else if (qrJSON.type == 'connection_request') {
      setDialogTitle('Fetching Connection Details');
      setScan(false);
      setProgress(true);
      getResponseUrl(qrJSON.metadata, qrJSON);
    } else if (qrJSON.type == 'connection_proof') {
      title = 'Digital Proof Request Added';
      arr2.push(qrJSON);
      saveItem(ConstantsList.PROOF_REQ, JSON.stringify(arr2))
        .then(() => {})
        .catch((e) => {});
    } else {
      title = 'Invalid QR Code';
    }
    setScan(false);
  };
  return (
    <View style={styles.MainContainer}>
      {scan ? (
        <QRCodeScanner
          reactivate={true}
          showMarker={true}
          customMarker={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  height: 250,
                  width: 250,
                  borderWidth: 2,
                  borderColor: 'white',
                  backgroundColor: 'transparent',
                }}
              />
            </View>
          }
          ref={(node) => {
            scanner = node;
          }}
          onRead={onSuccess}
          topContent={
            <Text style={styles.textBold}>
              Point your camera to a QR code to scan
            </Text>
          }
          bottomContent={
            <TouchableOpacity
              style={styles.buttonTouchable}
              onPress={() => {
                navigation.navigate('MainScreen');
              }}>
              <Text style={styles.buttonText}>Cancel Scan</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        progress && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}>
            <CustomProgressBar isVisible={true} text={dialogTitle} />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: Colors.black,
  },
  textBold: {
    fontSize: 20,
    marginLeft: 70,
    marginRight: 70,
    zIndex: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
  },
  buttonText: {
    fontSize: 21,
    color: '#4178CD',
  },
  buttonTouchable: {
    padding: 16,
  },

  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: 'red',
  },

  MainContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Imagesize: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },

  RoundButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4178CD',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    width: 150,
    borderRadius: 20,
    margin: 5,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 15,
    width: 15,
    marginLeft: 15,
  },
  TextGuide: {
    color: 'black',
    marginTop: 14,
    marginLeft: 5,
    marginBottom: 30,
  },
  TextStyle: {
    color: 'white',
    marginTop: 14,
    marginLeft: 5,
    marginBottom: 15,
  },
  SeparatorLine: {
    backgroundColor: '#fff',
    width: 1,
    height: 40,
  },
});

export default QRScreen;
