import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  getItem,
  saveItem,
} from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import queryString from 'query-string';
import { Buffer } from 'buffer';
import NetInfo from '@react-native-community/netinfo';
import CustomProgressBar from '../components/CustomProgressBar';
import { showMessage } from '../helpers/Toast';
import { AuthenticateUser } from '../helpers/Authenticate'
import { addImageAndNameFromConnectionList } from '../helpers/ActionList';

function QRScreen({ route, navigation }) {
  const [scan, setScan] = useState(true);
  const [networkState, setNetworkState] = useState(false);
  const [connection_request, setConnectionRequest] = useState('');
  const [credential_request, setCredentialRequest] = useState('');
  const [proof_request, setProofRequest] = useState('');
  const [progress, setProgress] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Fetching Details');

  var cr_arr = [];
  var cred_arr = [];
  var arr2 = [];
  var hasToken = true;
  var credentialID = '';
  var userToken = '';
  var isConnected = false;

  // useEffect(() => {
  //   NetInfo.fetch().then((networkState) => {
  //     setNetworkState(networkState.isConnected);
  //   });
  //   getItem(ConstantsList.CONN_REQ)
  //     .then((data) => {
  //       if (data == null) {
  //         cr_arr = [];
  //       } else {
  //         try {
  //           cr_arr = JSON.parse(data);
  //         } catch (e) {
  //           cr_arr = [];
  //         }
  //       }
  //       setConnectionRequest(JSON.stringify(cr_arr));
  //       if (route.params != undefined) {
  //         setScan(false);
  //         const { request } = route.params;
  //         const qrJSON = JSON.parse(JSON.stringify(request));
  //         if (request.type == 'connection_request') {
  //           setProgress(true);
  //           getResponseUrl(request.metadata, qrJSON);
  //         }
  //       }
  //     })
  //     .catch((e) => {
  //       console.log('Error is ' + e);
  //     });

  //   getItem(ConstantsList.CRED_OFFER)
  //     .then((data) => {
  //       if (data == null) {
  //         cred_arr = [];
  //       } else {
  //         try {
  //           cred_arr = JSON.parse(data);
  //         } catch (e) {
  //           cred_arr = [];
  //         }
  //       }
  //       setCredentialRequest(JSON.stringify(cred_arr));
  //     })
  //     .catch((e) => {
  //       console.log('Error is ' + e);
  //     });

  //   getItem(ConstantsList.PROOF_REQ)
  //     .then((data) => {
  //       if (data == null) {
  //         arr2 = [];
  //       } else {
  //         try {
  //           arr2 = JSON.parse(data);
  //         } catch (e) {
  //           arr2 = [];
  //         }
  //       }
  //       setProofRequest(JSON.stringify(arr2));
  //     })
  //     .catch((e) => {
  //       console.log('Error is ' + e);
  //     });
  // }, [
  //   // networkState,
  //   // connection_request,
  //   // credential_request,
  //   // proof_request,
  //   // progress,
  //   // dialogTitle,
  //   // scan,
  // ]);

  useEffect(() => {
    NetInfo.fetch().then((networkState) => {
      setNetworkState(networkState.isConnected);
    });
    getItem(ConstantsList.CONN_REQ)
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
          const { request } = route.params;
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

    getItem(ConstantsList.CRED_OFFER)
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
        if (route.params != undefined) {
          setScan(false);
          const { request } = route.params;
          const qrJSON = JSON.parse(JSON.stringify(request));
          if (request.type == 'credential_offer') {
            setProgress(true);
            getCredential(request.metadata);
          }
        }
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
  }, [])

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
      qrJSON.connectionId = data['@id'];
      getItem(ConstantsList.CONNECTIONS).then((connectionList) => {
        let QRConnList = JSON.parse(connectionList);
        console.log('QRConnList => ', QRConnList)
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
            { cancelable: false },
          );
        } else {
          cr_arr.push(qrJSON);
          saveItem(ConstantsList.CONN_REQ, JSON.stringify(cr_arr))
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

  const getCredential = async (credID) => {
    let resp = await AuthenticateUser();
    if (resp.success) {
      await fetch(
        ConstantsList.BASE_URL +
        '/api/credential/get_credential' +
        `?credentialId=${credID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + resp.token,
          },
        },
      ).then((credential) =>
        credential.json().then(async (data) => {
          console.log("CRED DATA => ", data);
          if (data.success == false) {
            setProgress(false);
            Alert.alert(
              'ZADA',
              data.error,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('MainScreen'),
                },
              ],
              { cancelable: false },
            );
          } else if (data.success == true) {
            let qrJSON = data.credential;
            qrJSON.type = ConstantsList.CRED_OFFER;
            qrJSON = await addImageAndNameFromConnectionList(qrJSON);
            console.log('qrJSON => ', qrJSON);
            cred_arr.push(qrJSON);
            saveItem(ConstantsList.CRED_OFFER, JSON.stringify(cred_arr))
              .then(() => {
                setProgress(false);
                navigation.navigate('MainScreen');
              })
              .catch((e) => {
                setProgress(false);
                Alert.alert(
                  'ZADA',
                  'Failed in fetching details of credential',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('MainScreen'),
                    },
                  ],
                  { cancelable: false },
                );
              });
          } else {
            setProgress(false);
            Alert.alert(
              'ZADA',
              'Failed to fetch details of credential',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('MainScreen'),
                },
              ],
              { cancelable: false },
            );
          }
        }),
      );
    } else {
      showMessage('ZADA Wallet', resp.message);
    }
  };

  const onSuccess = (e) => {
    try {
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
      let extract = e.data.toString();
      if (Platform.OS == "ios") {
        extract = extract.replaceAll('\\', '');
      }
      const qrJSON = JSON.parse(extract);
      console.log(qrJSON);
      // if (qrJSON.type == 'connection_credential') {
      if (qrJSON.type == 'credential_offer') {
        setScan(false);
        setProgress(true);

        setDialogTitle('Fetching Credential Details');
        credentialID = qrJSON.metadata;
        getCredential();
      } else if (qrJSON.type == 'connection_request') {
        setDialogTitle('Fetching Connection Details');
        setScan(false);
        setProgress(true);
        getResponseUrl(qrJSON.metadata, qrJSON);
      } else if (qrJSON.type == 'connection_proof') {
        title = 'Digital Proof Request Added';
        arr2.push(qrJSON);
        saveItem(ConstantsList.PROOF_REQ, JSON.stringify(arr2))
          .then(() => { })
          .catch((e) => { });
      } else {
        title = 'Invalid QR Code';
      }
      setScan(false);
    } catch (error) {
      console.log(error.message);
      setProgress(false);
      setScan(false);
      Alert.alert(
        'ZADA',
        'Invalid QR Code, Please try with a different QR',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainScreen'),
          },
        ],
        { cancelable: false },
      );

    }
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
