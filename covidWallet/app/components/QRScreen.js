import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  TouchableOpacity,

} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import QRCodeScanner from 'react-native-qrcode-scanner';

const QRScreen = () => {

  const [scan, setScan] = useState(false)
  const [result, setResult] = useState()
  //This method gives the value of the QR Code
  onSuccess = (e) => {
    setResult(e.data)
    setScan(false)
    //TODO: Parse QR Values Here
    Alert.alert("The QR Code value is " + e.data)
  }

  startScan = () => {
    setScan(true)
    setResult()
  }

  return (

    <View style={styles.MainContainer}>

      {!scan &&
        <View style={styles.MainContainer}>
          <Image style={styles.Imagesize} source={require('../assets/images/qrc.png')} />
          <Text style={styles.TextGuide}>There are no actions to complete</Text>
          <TouchableOpacity style={styles.RoundButtonStyle} activeOpacity={0.8} onPress={this.startScan}>
            <Image
              source={require('../assets/images/qri.png')}
              style={styles.ImageIconStyle}
            />
            <Text style={styles.TextStyle}> SCAN CODE </Text>
          </TouchableOpacity>
        </View>


      }
      {scan &&
        <View style={styles.sectionContainer}>
          <QRCodeScanner
            reactivate={true}
            showMarker={true}
            ref={(node) => { this.scanner = node }}
            onRead={this.onSuccess}
            topContent={
              <Text style={styles.textBold}>
                Point your camera to a QR code to scan
                  </Text>
            }
            bottomContent={
              <TouchableOpacity style={styles.buttonTouchable} onPress={() => setScan(false)}>
                <Text style={styles.buttonText}>Cancel Scan</Text>
              </TouchableOpacity>
            }
          />
        </View>
      }
    </View>



  );
};

const styles = StyleSheet.create({

  sectionContainer: {
    backgroundColor: Colors.black,
  },
  textBold: {
    fontSize: 20,
    marginLeft: 70,
    marginRight: 70,
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
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
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