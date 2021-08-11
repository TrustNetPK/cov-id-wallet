import React from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {GREEN_COLOR} from '../theme/Colors';

function CustomProgressBar(props) {
  return (
    <Modal onRequestClose={() => null} visible={props.isVisible}>
      <View
        style={{
          borderRadius: 10,
          backgroundColor: 'white',
          padding: 25,
          flexDirection: 'row',
        }}>
        <ActivityIndicator color={GREEN_COLOR} size="large" />
        <Text
          style={{
            paddingLeft: 20,
            alignSelf: 'center',
            alignContent: 'center',
            textAlign: 'center',
            fontSize: 15,
            fontFamily: 'Merriweather-Bold',
          }}>
          {props.text}
        </Text>
      </View>
    </Modal>
  );
}

export default CustomProgressBar;
