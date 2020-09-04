import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function ImageBoxComponent({ source }) {
  return (
    <View>
      <Image style={styles.Imagesize} source={source} />
    </View>
  );
}

const styles = StyleSheet.create({
  Imagesize: {
    height: 350,
    width: 250,
    resizeMode: 'contain'
  },
});

export default ImageBoxComponent;