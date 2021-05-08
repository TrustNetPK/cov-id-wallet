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
    height: 280,
    width: 280,
    resizeMode: 'contain',
    opacity:0.1
  },
});

export default ImageBoxComponent;