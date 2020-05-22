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
          <View style={styles.EmptyContainer}>

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
export default ConnectionsScreen;