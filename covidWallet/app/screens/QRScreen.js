import React, {useState, useEffect} from 'react';

import {StyleSheet, View, Text, Alert, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import queryString from 'query-string';
import {getItem, ls_addConnection, saveItem} from '../helpers/Storage';
import ConstantsList, {ZADA_AUTH_CONNECTION_ID} from '../helpers/ConfigApp';
import {Buffer} from 'buffer';
import CustomProgressBar from '../components/CustomProgressBar';
import {showMessage, showNetworkMessage, _showAlert} from '../helpers/Toast';
import {AuthenticateUser} from '../helpers/Authenticate';
import {addImageAndNameFromConnectionList} from '../helpers/ActionList';
import {
  accept_connection,
  add_session,
  find_auth_connection,
  save_did,
  send_zada_auth_verification_request,
} from '../gateways/connections';
import SuccessModal from '../components/SuccessModal';
import FailureModal from '../components/FailureModal';
import CredValuesModal from '../components/CredValuesModal';
import {
  analytics_log_unverified_credential,
  analytics_log_verified_credential,
  analytics_log_verify_cred_qr,
} from '../helpers/analytics';
import {submit_cold_verification} from '../gateways/credentials';
import useNetwork from '../hooks/useNetwork';
import {_handleAxiosError} from '../helpers/AxiosResponse';

function QRScreen({route, navigation}) {
  const {isConnected} = useNetwork();

  const [scan, setScan] = useState(true);
  const [connection_request, setConnectionRequest] = useState('');
  const [credential_request, setCredentialRequest] = useState('');
  const [proof_request, setProofRequest] = useState('');
  const [progress, setProgress] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Fetching Details');
  const [values, setValues] = useState(undefined);
  const [credentialData, setCredentialData] = useState(null);

  // For Modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isScanning, setScanning] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  var cr_arr = [];
  var cred_arr = [];
  var arr2 = [];

  useEffect(() => {
    if (isConnected) {
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
            const {request} = route.params;
            const qrJSON = JSON.parse(JSON.stringify(request));
            if (request.type == 'connection_request') {
              setProgress(true);
              getResponseUrl(request.metadata, qrJSON);
            }
          }
        })
        .catch((e) => {
          console.log(e);
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
            const {request} = route.params;
            const qrJSON = JSON.parse(JSON.stringify(request));
            if (request.type == 'credential_offer') {
              setProgress(true);
              getCredential(request.metadata);
            }
          }
        })
        .catch((e) => {
          console.log(e);
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
          console.log(e);
        });
    } else {
      showNetworkMessage();
    }
  }, []);

  const getResponseUrl = async (inviteID, qrJSON) => {
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
    try {
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
                {cancelable: false},
              );
            } else if (data.success == true) {
              let qrJSON = data.credential;
              qrJSON.type = ConstantsList.CRED_OFFER;
              qrJSON = await addImageAndNameFromConnectionList(qrJSON);
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
                    {cancelable: false},
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
                {cancelable: false},
              );
            }
          }),
        );
      } else {
        showMessage('ZADA Wallet', resp.message);
      }
    } catch (error) {
      _handleAxiosError(error, 'Unable to fetch credential', true);
    }
  };

  // Handling zada auth connection requests
  const _handleZadaAuth = async (data) => {
    try {
      setDialogTitle('Processing...');
      setScan(false);
      setProgress(true);

      const userId = await getItem(ConstantsList.USER_ID);

      // Saving Session
      const sessionResult = await add_session(userId, data.sessionId);

      if (sessionResult.data.success) {
        // Find Connection
        const response = await find_auth_connection(userId, data.tenantId);
        if (response.data.success) {
          const sendResult = await send_zada_auth_verification_request(
            response.data.data.did,
          );

          if (sendResult.data.success) {
            setProgress(false);
            navigation.navigate('MainScreen');
          } else {
            setProgress(false);
            _showAlert('Zada Wallet', sendResult.data.error);
          }
        } else {
          // Accept connection
          const result = await accept_connection(ZADA_AUTH_CONNECTION_ID);
          if (result.data.success) {
            // Adding in user connections
            await ls_addConnection(result.data.connection);

            // Saving DID
            const didResult = await save_did(
              userId,
              data.tenantId,
              result.data.connection.myDid,
            );
            if (didResult.data.success) {
              navigation.navigate('MainScreen');
              //_showAlert('Zada Wallet', 'Connection is accepted successfully');
            } else {
              navigation.navigate('MainScreen');
              _showAlert('Zada Wallet', result.data.message);
            }
          } else {
            _showAlert('Zada Wallet', result.data.message);
          }
          setProgress(false);
        }
      } else {
        setProgress(false);
        _showAlert('Zada Wallet', sessionResult.data.error);
      }
      setProgress(false);
    } catch (error) {
      setProgress(false);
      _handleAxiosError(error);
    }
  };

  const onSuccess = (e) => {
    try {
      if (isConnected) {
        let unEscapedStr = e.data;
        unEscapedStr = unEscapedStr.replace(/\\/g, '');
        unEscapedStr = unEscapedStr.replace(/“/g, '"');
        try {
          if (JSON.parse(unEscapedStr).type == 'cred_ver') {
            handle_cred_verification(JSON.parse(unEscapedStr));
          }
          if (JSON.parse(unEscapedStr).type == 'zadaauth') {
            _handleZadaAuth(JSON.parse(e.data));
          } else {
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

              const qrJSON = JSON.parse(unEscapedStr);
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
                  .then(() => {})
                  .catch((e) => {});
              } else {
                title = 'Invalid QR Code';
              }
              setScan(false);
            } catch (error) {
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
                {cancelable: false},
              );
            }
          }
        } catch (error) {
          console.log('error', error);
          _showAlert('Zada WAllet', 'Not a valid ZADA QR');
          navigation.goBack();
        }
      } else {
        showNetworkMessage();
      }
    } catch (error) {
      _handleAxiosError(error, 'Unable to process your request, try again');
    }
  };

  function arrangeValues(values) {
    let orderedValues = undefined;
    orderedValues = Object.keys(values)
      .sort()
      .reduce((obj, key) => {
        obj[key] = values[key];
        return obj;
      }, {});
    return orderedValues;
  }

  // Function to handle credential verification
  const handle_cred_verification = (credQrData) => {
    try {
      let credValues = Buffer.from(credQrData.data, 'base64').toString();
      var orderValues = arrangeValues(JSON.parse(credValues));
      setCredentialData({
        data: Buffer.from(JSON.stringify(orderValues)).toString('base64'),
        signature: credQrData.signature,
        tenantId: credQrData.tenantId,
        keyVersion: credQrData.keyVersion,
      });
      setValues(orderValues);
      setTimeout(() => {
        setShowVerifyModal(true);
      }, 500);
    } catch (error) {
      _showAlert('ZADA Wallet', error.message);
    }
  };

  // When user will click on verification button
  const on_verify_click = async () => {
    try {
      if (isConnected) {
        analytics_log_verify_cred_qr();

        setScanning(true);

        const result = await submit_cold_verification(
          credentialData.data,
          credentialData.signature,
          credentialData.tenantId,
          credentialData.keyVersion,
        );

        if (result.data.success) {
          setScanning(false);
          setShowVerifyModal(false);
          setTimeout(() => {
            setShowSuccessModal(true);
          }, 500);
          analytics_log_verified_credential();
        } else {
          setErrMsg('Failed to validate credential');
          setScanning(false);
          setShowVerifyModal(false);
          setTimeout(() => {
            setShowErrorModal(true);
          }, 500);
          analytics_log_unverified_credential();
        }
      } else {
        showNetworkMessage();
      }
    } catch (error) {
      setErrMsg('Unable to verify credential');
      setScanning(false);
      setShowVerifyModal(false);
      setTimeout(() => {
        setShowErrorModal(true);
      }, 500);
      analytics_log_unverified_credential();
    }
  };

  return (
    <View style={styles.MainContainer}>
      <CredValuesModal
        values={values}
        isVisible={showVerifyModal}
        heading={isScanning ? `Verifying...` : `Credential\nInformation`}
        isScanning={isScanning}
        onCloseClick={() => {
          setShowVerifyModal(false);
          setScan(true);
        }}
        onVerifyPress={() => {
          on_verify_click();
        }}
      />

      <SuccessModal
        isVisible={showSuccessModal}
        heading="Success"
        info="Credential is verified successfully"
        onCloseClick={() => {
          setShowSuccessModal(false);
        }}
        onOkayPress={() => {
          setShowSuccessModal(false);
          setScan(true);
        }}
      />

      <FailureModal
        isVisible={showErrorModal}
        heading="Invalid Credential"
        info={errMsg}
        onCloseClick={() => {
          setShowErrorModal(false);
        }}
        onOkayPress={() => {
          setShowErrorModal(false);
          setScan(true);
        }}
      />

      {scan ? (
        <QRCodeScanner
          reactivate={true}
          showMarker={true}
          reactivateTimeout={1000}
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
