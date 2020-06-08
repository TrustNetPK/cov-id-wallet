import * as React from 'react';
import { View, Image, Text, StyleSheet, Linking } from 'react-native';
import { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { PRIMARY_COLOR } from '../theme/Colors';
import ImageBoxComponent from './ImageBoxComponent';

const img = require('../assets/images/notifications.png');

function NotfiyMeScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);

  nextHandler = () => {
    navigation.navigate('MainScreen');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBoxComponent
          source={img}
        />
      </View>
      <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.TextContainer}>
          We use push notifications to deliver messages for important events,
          such as when you recieve a new credential.
        </Text>
      </View>
      <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
        <PrimaryButton title="Enable Notifications" nextHandler={nextHandler} />
        <Text style={styles.TextContainerEnd}
          onPress={() => navigation.navigate('MainScreen')} >Continue without alerts</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  TextContainer: {
    padding: 30, color: 'black', fontSize: 15,
    textAlign: 'center',
    marginTop: 70, alignItems: 'center', justifyContent: 'center', color: 'black',
  },
  TextContainerEnd: {
    alignItems: 'center', justifyContent: 'center', color: PRIMARY_COLOR, paddingTop: 15
  },
});

export default NotfiyMeScreen;