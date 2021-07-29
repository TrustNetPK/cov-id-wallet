import * as React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { BLACK_COLOR, WHITE_COLOR, SECONDARY_COLOR } from '../theme/Colors';
import TouchableComponent from './Buttons/TouchableComponent';

function FlatCard(props) {
  return (
    <View style={{ paddingLeft: 4, paddingRight: 4 }}>
      <View style={styles.card}>
        <TouchableComponent android_ripple={{ borderless: false }} style={styles.touchableStyle} onPress={() => props.onPress()}>
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
        </TouchableComponent>
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
    paddingLeft: 1,
    marginTop: 4,
    color: SECONDARY_COLOR,
  },
  heading: {
    color: BLACK_COLOR,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
    paddingLeft: 1,
  },
  card: {
    width: '100%',
    flex: 0,
    backgroundColor: WHITE_COLOR,
    borderRadius: 15,
    borderColor: SECONDARY_COLOR,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: SECONDARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logo: {
    width: 50,
    backgroundColor: WHITE_COLOR,
    height: 50,
    resizeMode: 'contain',
    marginTop: 5,
    borderRadius: 4,
  },
  row1: {
    width: '25%',
    paddingLeft: '6%',
  },
  row2: {
    width: '75%',
    paddingRight: 10,
  },
  touchableStyle: {
    paddingTop: 8,
    paddingBottom: 12,
    borderRadius: 16,
  }
});

export default FlatCard;
