import * as React from 'react';
import {Text, StyleSheet} from 'react-native';
import {BLACK_COLOR} from '../theme/Colors';

function HeadingComponent(props) {
  const styles = StyleSheet.create({
    heading: {
      fontSize: 30,
      fontFamily: 'Merriweather-Bold',
      marginTop: 15,
      marginBottom: 15,
      color: BLACK_COLOR,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
  });

  return <Text style={styles.heading}>{props.text}</Text>;
}

export default HeadingComponent;
