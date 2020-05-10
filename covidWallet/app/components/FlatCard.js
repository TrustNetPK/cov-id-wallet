
import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function FlatCard(props) {
  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <View style={styles.row1}>
          <Image source={props.image} style={styles.logo} />
        </View>
        <View style={styles.row2}>
          <Text style={styles.heading}>{props.heading}</Text>
          <Text style={styles.text}>{props.text}</Text>
        </View>
        <View style={styles.row3}>
          <Text style={styles.button}>New</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5973f2',
    color: 'white',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 7,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
  },
  text: {
    fontSize: 9,
    paddingLeft: 12,
    lineHeight: 9,
  },
  heading: {
    color: 'white',
    fontSize: 17,
    paddingLeft: 12,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  card: {
    width: 360,
    marginTop: 7,
    backgroundColor: '#bacff2',
    height: 55,
  },
  logo: {
    width: 50,
    backgroundColor: 'white',
    height: 40,
  },
  row1: {
    width: '15%',
  },
  row2: {
    width: '65%',
    paddingRight: 10,
  },
  row3: {
    width: '20%',
  },
});

export default FlatCard;