// export default ActionsScreen;

import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import FlatCard from './FlatCard';

const image = require('../assets/images/visa.jpg')

class ActionsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //This variable controls the Action Visibility
      isActionAvailable: false,
    };
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        {this.state.isActionAvailable &&
          <View>
            <Text>Actions</Text>
            <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world" />
            <FlatCard image={image} heading="VISA MasterCard" text="Mastercard enables you to pay at 2 billion plus kiosks throughout the world" />
          </View>
        }

        {!this.state.isActionAvailable &&
          <View style={{
            marginLeft: 30,
            marginRight: 30,
            flex: 8,
          }}>
            <View style={{
              flex: 1,
            }} />
            <Image style={styles.Imagesize} source={require('../assets/images/actionempty.png')} />
            <Text style={styles.TextGuide}>There are no actions to complete.</Text>

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
export default ActionsScreen;