import * as React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {GRAY_COLOR, GREEN_COLOR, WHITE_COLOR} from '../theme/Colors';
const img = require('../assets/images/t&c.png');
const action = require('../assets/images/action.gif');

import Swiper from 'react-native-swiper';

const Slides = [
  {
    image: img,
    text: 'You are about to take control of your own identity. Swipe through these slides fora run-down of this app,or click "Get Started" to dive right in.',
  },
  {
    image: img,
    text: 'Connect with other organizations and users to begin exchanging information. Scan their QR code to connect.',
  },
  {
    image: action,
    text: 'Collect credentials issued by different organizations.These are pieces of information that prove your identity.',
  },
  {
    image: img,
    text: 'Once you have a few credentials under your belt, others can request information from you through a proof request. You control the information you share and with whom.',
  },
];

function IntroScreen({navigation}) {
  const nextHandler = () => {
    navigation.navigate('WelcomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}> Welcome! </Text>
      <View style={styles.containerSwiper}>
        <Swiper
          style={styles.wrapper}
          showsButtons={true}
          showsPagination={true}>
          {Slides.map((item, index) => {
            return (
              <View style={styles.slide1}>
                <Image
                  resizeMode="contain"
                  style={styles.swiperImage}
                  source={item.image}
                />
                <Text style={styles.swiperText}>{item.text}</Text>
              </View>
            );
          })}
        </Swiper>
      </View>

      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.primaryButton} onPress={nextHandler}>
          <Text style={styles.text}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    borderColor: GREEN_COLOR,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: GREEN_COLOR,
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 10,
    paddingRight: 20,
    width: 250,
  },
  welcomeText: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
  },

  swiperImage: {
    width: '40%',
    height: '40%',
  },
  swiperText: {
    marginHorizontal: 40,
    color: GRAY_COLOR,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  text: {
    color: WHITE_COLOR,
    alignSelf: 'center',
    fontFamily: 'Merriweather-Bold',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE_COLOR,
  },

  containerSwiper: {
    height: '60%',
  },

  buttonView: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default IntroScreen;
