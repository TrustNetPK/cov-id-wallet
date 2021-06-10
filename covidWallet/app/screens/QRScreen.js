import * as React from 'react';
import {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Alert, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {getItem, saveItem} from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import queryString from 'query-string';
import {Buffer} from 'buffer';
import CustomProgressBar from '../components/CustomProgressBar';

function QRScreen({navigation}) {
  const [scan, setScan] = useState(true);
  const [certificate_request, setCertificateRequest] = useState('');
  const [connection_request, setConnectionRequest] = useState('');
  const [proof_request, setProofRequest] = useState('');
  const [progress, setProgress] = useState(false);
  var cr_arr = [];
  var arr = [];
  var arr2 = [];

  useEffect(() => {
    getItem(ConstantsList.CONNEC_REQ)
      .then(data => {
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
      })
      .catch(e => {
        setError('Error');
      });

    getItem(ConstantsList.CERT_REQ)
      .then(data => {
        if (data == null) {
          arr = [];
        } else {
          try {
            arr = JSON.parse(data);
          } catch (e) {
            arr = [];
          }
        }
        setCertificateRequest(JSON.stringify(arr));
      })
      .catch(e => {
        setError('Error');
      });

    getItem(ConstantsList.PROOF_REQ)
      .then(data => {
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
      .catch(e => {
        setError('Error');
      });
  }, []);

  const getResponseUrl = async (inviteID, qrJSON) => {
    let baseURL = 'https://trinsic.studio/url/';
    await fetch(baseURL + inviteID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then(response => {
      const parsed = queryString.parse(response.url, true);
      let urlData = Object.values(parsed)[0];
      var data = JSON.parse(Buffer.from(urlData, 'base64').toString());
      qrJSON.organizationName = data.label;
      qrJSON.imageUrl = data.imageUrl;
      cr_arr.push(qrJSON);
      saveItem(ConstantsList.CONNEC_REQ, JSON.stringify(cr_arr))
        .then(() => {
          setProgress(false);
          Alert.alert(
            'ZADA',
            'Connection has been added in Actions',
            [{text: 'OK', onPress: () => navigation.navigate('MainScreen')}],
            {cancelable: false},
          );
        })
        .catch(e => {
          setProgress(false);
          Alert.alert(
            'ZADA',
            'Failed in fetching details of connection',
            [{text: 'OK', onPress: () => navigation.navigate('MainScreen')}],
            {cancelable: false},
          );
        });
    });
  };

  const onSuccess = e => {
    let title = '';
    try {
      cr_arr = JSON.parse(connection_request);
      arr = JSON.parse(certificate_request);
      arr2 = JSON.parse(proof_request);
    } catch {
      cr_arr = [];
      arr = [];
      arr2 = [];
    }

    const qrJSON = JSON.parse(e.data);
    if (qrJSON.type == 'connection_credential') {
      title = 'Digital Certificate Request Added';
      arr.push(qrJSON);
      saveItem(ConstantsList.CERT_REQ, JSON.stringify(arr))
        .then(() => {})
        .catch(e => {});
    } else if (qrJSON.type == 'connection_request') {
      setProgress(true);
      getResponseUrl(qrJSON.data, qrJSON);
    } else if (qrJSON.type == 'connection_proof') {
      title = 'Digital Proof Request Added';
      arr2.push(qrJSON);
      saveItem(ConstantsList.PROOF_REQ, JSON.stringify(arr2))
        .then(() => {})
        .catch(e => {});
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
          ref={node => {
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
            <CustomProgressBar
              isVisible={true}
              text="Fetching Connection Details"
            />
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
