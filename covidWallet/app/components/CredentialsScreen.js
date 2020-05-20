
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CredentialsCard from './CredentialsCard';

const card_logo = require('../assets/images/visa.jpg')

class CredentialsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //This variable controls the Credentials Visibility
      isCredentialAvailable: false,
    };
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        {this.state.isCredentialAvailable &&
          <View>
            <Text style={styles.heading}>Credentials</Text>
            <CredentialsCard card_no="0000 0000 0000 0000" card_user="SAEED AHMAD" date="05/09/2020" card_logo={card_logo} />
          </View>
        }

        {!this.state.isCredentialAvailable &&
          <View style={{
            marginLeft: 30,
            marginRight: 30,
            flex: 8,
          }}>
            <View style={{
              flex: 1,
            }} />
            <Image style={styles.Imagesize} source={require('../assets/images/credentialsempty.png')} />
            <Text style={styles.TextGuide}>There are no credentials in your wallet. Once you receive a credential, it will show up here.</Text>

          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: "600",
    fontSize: 30,
  },
  Imagesize: {
    alignItems: 'center',
    height: 300,
    position: 'relative',
    width: 300,
    flex: 5,
    marginBottom: 50,
  },

  TextGuide: {
    color: 'gray',
    marginTop: 14,
    flex: 2,
    fontSize: 18,
    marginLeft: 1,
    marginRight: 1,
    textAlign: 'center',

  }
});

export default CredentialsScreen;