import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {formatDateWithHyphen, get_local_issue_time} from '../helpers/time';
import {GRAY_COLOR} from '../theme/Colors';

const RenderValues = ({
  values,
  labelColor,
  inputTextColor,
  inputBackground,
  width,
  mainStyle,
  listStyle,
  listContainerStyle,
  inputTextWeight,
  inputTextSize,
}) => {
  values = Object.keys(values)
    .sort()
    .reduce((obj, key) => {
      obj[key] = values[key];
      return obj;
    }, {});

  let credentialDetails =
    values != undefined &&
    Object.keys(values).map((key, index) => {
      let value = values[key];

      console.log('key', key);

      if (key.match(/Issue Time/)) {
        value = get_local_issue_time(value);
      }
      if (key.match(/Date Of Birth|Birth Date|Administered Date/)) {
        value = formatDateWithHyphen(value);
      }

      return (
        <View
          key={index}
          style={[styles._mainContainer, mainStyle, {width: width}]}>
          <Text style={[styles._labelStyle, {color: labelColor}]}>{key}</Text>
          <View
            style={[
              styles._inputContainer,
              {backgroundColor: inputBackground},
            ]}>
            <Text
              style={[
                styles._inputText,
                {
                  color: inputTextColor,
                  fontWeight: inputTextWeight ? inputTextWeight : null,
                  fontSize: inputTextSize ? inputTextSize : null,
                },
              ]}>
              {value}
            </Text>
          </View>
        </View>
      );
    });

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={listStyle}
      contentContainerStyle={listContainerStyle}>
      {credentialDetails}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  _mainContainer: {
    marginBottom: 15,
  },
  _labelStyle: {
    color: GRAY_COLOR,
    marginLeft: 10,
    marginBottom: 5,
  },
  _inputContainer: {
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  _inputText: {},
});

export default RenderValues;
