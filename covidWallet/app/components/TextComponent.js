
import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { GRAY_COLOR } from '../theme/Colors';

function TextComponent({ text, onboarding }) {

  const styles = StyleSheet.create({
    TextGuide: {
      color: onboarding ? 'black' : GRAY_COLOR,
      marginTop: 14,
      fontSize: 16,
      marginLeft: 35,
      marginRight: 35,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }
  });

  return (
    <View>
      <Text style={styles.TextGuide}>{text}</Text>
    </View>
  );
}



export default TextComponent;