
import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function TextComponent({text, onboarding}) {

const styles = StyleSheet.create({
        TextGuide: {
            color:onboarding?'black':'#708090',
            marginTop: 14,
            fontSize: 15,
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