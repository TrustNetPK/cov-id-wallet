import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {BLACK_COLOR, WHITE_COLOR, SECONDARY_COLOR} from '../theme/Colors';

function FlatCard(props) {
  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <View style={styles.row1}>
          <Image
            source={{
              uri: props.imageURL, // remove braces
            }}
            style={styles.logo}
          />
        </View>
        <View style={styles.row2}>
          <Text style={styles.heading}>{props.heading}</Text>
          <Text style={styles.text}>{props.text}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', //Centered vertically
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    paddingLeft: 12,
    color: SECONDARY_COLOR,
  },
  heading: {
    color: BLACK_COLOR,
    fontSize: 15,
    paddingLeft: 10,
  },
  card: {
    width: '100%',
    flex: 0,
    marginTop: 7,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: WHITE_COLOR,
    borderRadius: 20,
    borderColor: SECONDARY_COLOR,
    borderWidth: 0.5,
  },
  logo: {
    width: 50,
    backgroundColor: WHITE_COLOR,
    height: 50,
    resizeMode: 'contain',
  },
  row1: {
    width: '25%',
    paddingLeft: '6%',
  },
  row2: {
    width: '75%',
    paddingRight: 10,
  },
});

export default FlatCard;
