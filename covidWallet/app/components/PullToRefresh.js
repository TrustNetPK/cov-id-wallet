import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';

const PullToRefresh = ({style, isLoading}) => {
  return (
    <View
      style={[styles._mainContainer, {marginTop: isLoading ? 25 : 0}, style]}>
      <AntIcon name="arrowdown" size={15} color={'#7e7e7e'} />
      <Text style={styles._textStyle}>Pull to refresh</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  _mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  _textStyle: {
    alignSelf: 'center',
    color: '#7e7e7e',
    marginLeft: 5,
  },
});

export default PullToRefresh;
