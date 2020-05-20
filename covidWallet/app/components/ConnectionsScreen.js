import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import FlatCard from './FlatCard';
const image = require('../assets/images/visa.jpg')

class ConnectionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //This variable controls the Connections Visibility
      isConnectionsAvailable: false,
    };
  }

  render() {
    return (
      <View style={styles.MainContainer}>

        {this.state.isConnectionsAvailable &&
          <View>
            <Text>ConnectionsScreen</Text>
            <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world" />
            <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world" />
          </View>
        }
        {!this.state.isConnectionsAvailable &&
          <View style={{
            marginLeft: 30,
            marginRight: 30,
            flex: 8,
          }}>
            <View style={{
              flex: 1,
            }} />
            <Image style={styles.Imagesize} source={require('../assets/images/connectionsempty.png')} />
            <Text style={styles.TextGuide}>Once you establish a connection, it will show up here. Go ahead and connect with someone.</Text>

          </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
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
export default ConnectionsScreen;