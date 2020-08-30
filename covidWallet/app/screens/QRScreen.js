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
import { getCredentials, saveCredentials } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
function QRScreen({ navigation }) {
  const [scan, setScan] = useState(true);
  const [certificate_request, setCertificateRequest] = useState("");
  const [proof_request, setProofRequest] = useState('');
  var arr = [];

  useEffect(() => {

    getCredentials(ConstantsList.CERT_REQ).then((data) => {
      //console.log("Wallet " + data);
      if (data == null) {
        arr = [];
      }
      else {
        try {
          arr = JSON.parse(data);
          //arr.push(JSON.parse(data));
        }
        catch (e) {
          arr = [];
        }

      }
      // console.log("CERT_REQ: " + JSON.stringify(arr));
      console.log("data value " + data);
      // console.log("arr length get credential " + arr.length);
      setCertificateRequest(JSON.stringify(arr));
    }).catch(e => {
      setError('Error');
    })
  }, []);

  const onSuccess = (e) => {
    let title = "";
    //arr = [];
    //console.log("Condition length>0 " + arr.length != 0);
    try {
      arr = JSON.parse(certificate_request);
      //console.log("Certificate Request" + JSON.stringify(arr));
    }
    catch{
      arr = [];
    }

    const qrJSON = JSON.parse(e.data);
    if (qrJSON.type == "connection_credential") {
      title = "Vaccination Certificate Request Added";

      //title = JSON.stringify (arr);
      arr.push(qrJSON);
      console.log("arrs length " + arr.length);
      saveCredentials(ConstantsList.CERT_REQ, JSON.stringify(arr)).then(() => {
        //title = "safi" + certificate_request;

        //console.log("Certificate Request" + JSON.stringify(arr));
      }).catch(e => {

      })
    }
    else if (qrJSON.type == "connection_proof") {
      title = "Vaccination Proof Request Added";
      setProofRequest(JSON.stringify(arr.push(qrJSON)));
      saveCredentials(ConstantsList.PROOF_REQ, certificate_request).then(() => {

      }).catch(e => {

      })
    }
    else {
      title = "Invalid QR Code";
    }
    Alert.alert(
      'VACCIFY',
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