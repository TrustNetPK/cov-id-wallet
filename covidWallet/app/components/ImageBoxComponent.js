
import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function ImageBoxComponent({source}) {
  return (
    <View>
        <Image style={styles.Imagesize} source={source} />
    </View>
  );
}

const styles = StyleSheet.create({
    Imagesize: {
      height: 300,
      width: 200,
      resizeMode:'contain'
    },
  });

export default ImageBoxComponent;