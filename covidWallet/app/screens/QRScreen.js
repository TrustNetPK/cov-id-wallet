import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,

} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { getItem, saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
function QRScreen({ navigation }) {
  const [scan, setScan] = useState(true);
  const [certificate_request, setCertificateRequest] = useState("");
  const [proof_request, setProofRequest] = useState("");
  var arr = [];
  var arr2 = [];

  useEffect(() => {
    getItem(ConstantsList.CERT_REQ).then((data) => {
      if (data == null) {
        arr = [];
      }
      else {
        try {
          arr = JSON.parse(data);
        }
        catch (e) {
          arr = [];
        }
      }

      setCertificateRequest(JSON.stringify(arr));
    }).catch(e => {
      setError('Error');
    })

    getItem(ConstantsList.PROOF_REQ).then((data) => {
      if (data == null) {
        arr2 = [];
      }
      else {
        try {
          arr2 = JSON.parse(data);
        }
        catch (e) {
          arr2 = [];
        }
      }
      setProofRequest(JSON.stringify(arr2));
    }).catch(e => {
      setError('Error');
    })

  }, []);

  const onSuccess = (e) => {
    let title = "";
    try {
      arr = JSON.parse(certificate_request);
      arr2 = JSON.parse(proof_request);
    }
    catch{
      arr = [];
      arr2 = [];
    }

    const qrJSON = JSON.parse(e.data);
    if (qrJSON.type == "connection_credential") {
      title = "Vaccination Certificate Request Added";
      arr.push(qrJSON);
      saveItem(ConstantsList.CERT_REQ, JSON.stringify(arr)).then(() => {
      }).catch(e => {

      })
    }
    else if (qrJSON.type == "connection_proof") {
      title = "Vaccination Proof Request Added";
      arr2.push(qrJSON)
      saveItem(ConstantsList.PROOF_REQ, JSON.stringify(arr2)).then(() => {

      }).catch(e => {

      })
    }
    else {
      title = "Invalid QR Code";
    }
    Alert.alert(
      'Vaccify',
      title,
      [
        { text: 'OK', onPress: () => navigation.navigate('MainScreen') }
      ],
      { cancelable: false }

    );
    setScan(false);
    //setScan(false);

  }
  return (
    <View style={styles.MainContainer}>
      {scan &&
        <QRCodeScanner
          reactivate={true}
          showMarker={true}
          customMarker={
            <View style={
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent'
              }
            }>
              <View style={
                {
                  height: 250,
                  width: 250,
                  borderWidth: 2,
                  borderColor: 'white',
                  backgroundColor: 'transparent'
                }
              } />
            </View>
          }
          ref={(node) => { scanner = node }}
          onRead={onSuccess}
          topContent={
            <Text style={styles.textBold}>
              Point your camera to a QR code to scan
            </Text>
          }
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable} onPress={() => {
              navigation.navigate('MainScreen')
            }}>
              <Text style={styles.buttonText}>Cancel Scan</Text>
            </TouchableOpacity>
          }

        />
      }

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
    color: '#fff'
  },
  buttonText: {
    fontSize: 21,
    color: '#4178CD'
  },
  buttonTouchable: {
    padding: 16
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
    marginTop: 40
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
    marginLeft: 15

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