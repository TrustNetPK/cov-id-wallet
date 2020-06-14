import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import FlatCard from '../components/FlatCard';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const image = require('../assets/images/visa.jpg')

function ConnectionsScreen(props) {
  const [isConnection, setConnection] = useState(true);
  return (
    <View style={themeStyles.mainContainer}>
      {isConnection &&
        <View>
          <HeadingComponent text="Connections" />
          <TouchableOpacity>
            <FlatCard image={image} heading="Connection Request" text="Tap to view the connection request from Agha Khan Hospital, Karachi" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FlatCard image={image} heading="Vaccination Certificate" text="Tap to accept the immunity certificate from Agha Khan Hospital, Karachi" />
          </TouchableOpacity>
        </View>}
      {!isConnection &&
        <View style={styles.EmptyContainer}>
          <ImageBoxComponent source={require('../assets/images/connectionsempty.png')} />
          <TextComponent text="Once you establish a connection, it will show up here. Go ahead and connect with someone." />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  EmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConnectionsScreen;