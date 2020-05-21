
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
      <View style={styles.MainContainer}>
        {this.state.isCredentialAvailable &&
          <View>
            <Text style={styles.heading}>Credentials</Text>
            <CredentialsCard card_no="0000 0000 0000 0000" card_user="SAEED AHMAD" date="05/09/2020" card_logo={card_logo} />
          </View>
        }

        {!this.state.isCredentialAvailable &&
          <View style={styles.EmptyContainer}>
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
  MainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  EmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Imagesize: {
    marginBottom: 50,
    height: 300,
    width: 300,
    resizeMode: 'contain'
  },

  TextGuide: {
    color: '#708090',
    marginTop: 14,
    fontSize: 15,
    marginLeft: 50,
    marginRight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }
});

export default CredentialsScreen;