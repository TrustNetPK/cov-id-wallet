import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import TouchableComponent from '../../Buttons/TouchableComponent';

interface INProps {
  children: any;
  setSelected: Function;
  item: object;
  isChecked: boolean;
}

const RadioButton = (props: INProps) => {
  // Toggle checkbox
  const toggleCheck = () => {
    props.setSelected(props.item);
  };

  return (
    <TouchableComponent
      onPress={toggleCheck}
      style={{flexDirection: 'row', height: 40, alignItems: 'center'}}>
      <CheckBox
        containerStyle={{padding: 0}}
        checked={props.isChecked}
        onPress={toggleCheck}
      />
      {props.children}
    </TouchableComponent>
  );
};

export default RadioButton;
