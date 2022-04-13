import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Animated} from 'react-native';
import {Input, Overlay, Divider} from 'react-native-elements';
import ConstantsList from '../../helpers/ConfigApp';

import {
  GRAY_COLOR,
  BLACK_COLOR,
  SECONDARY_COLOR,
  RED_COLOR,
  YELLOW_COLOR,
  GREEN_COLOR,
} from '../../theme/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// import Animated, {Easing} from 'react-native-reanimated';

interface InputIProps {
  title?: string;
  isLoading?: boolean;
  style?: any;
  textInputStyle?: any;
  placeholderText?: string;
  leftIconName?: string;
  rightIcon?: any;
  isSecureText?: boolean;
  toggleSecureEntry?: any;
  value?: any;
  keyboardType?: string;
  disabled?: boolean;
  setStateValue?: any;
  errorMessage?: string;
  onBlur?: Function;
  infoText?: string;
  inputContainerStyle?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  type: 'default' | 'secret';
  height: Number;
  strengthMessage: string;
}

export function InputComponent(props: InputIProps) {
  //const [secureInputValue, setSecureInputValue] = useState(props.isSecureText);
  const [inputValue, setInputValue] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [showStrenghtMessage, setShowStrenghtMessage] = useState(false);

  const [messageColor, setMessageColor] = useState(RED_COLOR);

  const [isOverlay, setOverlay] = useState(false);
  const toggleOverlay = () => {
    setOverlay(!isOverlay);
  };

  useEffect(() => {
    setShowStrenghtMessage(props.strengthMessage != undefined ? true : false);
    strengthMessageColor(props.strengthMessage);
    toggleShowStrengthMessage();
  }, [props.strengthMessage]);

  const [animationValue, setAnimationValue] = useState(new Animated.Value(0));

  const renderLeftIcon = () => {
    switch (props.leftIconName) {
      case 'key':
        return <Foundation name="key" size={24} color={GRAY_COLOR} />;
      case 'user':
        return <AntDesign name={'user'} size={24} color={GRAY_COLOR} />;
      case 'wallet':
        return (
          <Ionicons name="ios-wallet-outline" size={24} color={GRAY_COLOR} />
        );
      default:
        break;
    }
  };

  function toggleErrorMessage() {
    if (showErrorMessage == true) {
      Animated.timing(animationValue, {
        toValue: 0,
        timing: 1500,
        duration: 100,
        useNativeDriver: false,
      }).start(() => {
        setShowErrorMessage(!showErrorMessage);
      });
    } else {
      setShowErrorMessage(!showErrorMessage);
      Animated.timing(animationValue, {
        toValue: 30,
        timing: 1500,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }

  function toggleShowStrengthMessage() {
    if (showStrenghtMessage == true) {
      Animated.timing(animationValue, {
        toValue: 0,
        timing: 1500,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }

  const strengthMessageColor = (text: string) => {
    if (text == ConstantsList.STRONG) {
      setMessageColor(GREEN_COLOR);
    } else if (text === ConstantsList.MEDIUM) {
      setMessageColor(YELLOW_COLOR);
    } else if (text === ConstantsList.WEAK) {
      setMessageColor(RED_COLOR);
    }
  };

  return (
    <>
      <Input
        maxFontSizeMultiplier={1}
        placeholder={props.placeholderText}
        inputStyle={[styles.textInput, props.textInputStyle]}
        value={props.value}
        disabled={props.disabled}
        disabledInputStyle={{color: BLACK_COLOR}}
        secureTextEntry={props.isSecureText}
        // errorMessage={showErrorMessage ? props.errorMessage : ''}
        leftIcon={renderLeftIcon()}
        onBlur={() => (props.onBlur ? props.onBlur() : {})}
        autoCapitalize={
          props.autoCapitalize ? props.autoCapitalize : 'sentences'
        }
        keyboardType={
          props.keyboardType != undefined ? props.keyboardType : 'default'
        }
        rightIcon={
          props.errorMessage ? (
            <View style={styles.rightIconView}>
              <TouchableOpacity onPress={toggleErrorMessage}>
                <AntDesign
                  name={'exclamationcircleo'}
                  size={25}
                  color={RED_COLOR}
                  style={{
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : props.type == 'secret' ? (
            <FontAwesome
              onPress={props.toggleSecureEntry}
              name={props.isSecureText ? 'eye-slash' : 'eye'}
              size={25}
              color={GRAY_COLOR}
              style={{
                paddingRight: 5,
              }}
            />
          ) : (
            props.rightIcon
          )
        }
        onChangeText={(newText) => {
          setShowErrorMessage(newText.length > 1 ? false : true);

          setInputValue(newText);
          props.setStateValue(newText);
        }}
        containerStyle={[
          props.style,
          {height: props.height ? props.height : 55},
        ]}
        inputContainerStyle={props.inputContainerStyle}
      />
      {showErrorMessage && (
        <Animated.View
          style={{height: animationValue, justifyContent: 'center'}}>
          <Text style={styles.errorStyle}>{props.errorMessage}</Text>
        </Animated.View>
      )}

      {props.strengthMessage && (
        <Animated.View
          style={{
            flexDirection: 'row',
            paddingTop: 3,
            paddingBottom: 10,
          }}>
          <Text style={[styles.strenghtMsgstyle, {color: GRAY_COLOR}]}>
            {`Password Strength:  `}
          </Text>

          <Text
            style={{
              fontSize: 10,
              //  paddingRight: 16,
              color: messageColor,
            }}>
            {props.strengthMessage}
          </Text>
        </Animated.View>
      )}
    </>
  );
} // end of function

const styles = StyleSheet.create({
  titleStyle: {
    alignSelf: 'center',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  textInput: {
    paddingLeft: 10,
    fontSize: 14,
  },
  rightIconView: {
    flexDirection: 'row',
  },
  errorStyle: {
    color: RED_COLOR,
    fontSize: 10,
    paddingLeft: 24,
    paddingRight: 16,
  },

  strenghtMsgstyle: {
    fontSize: 10,
    paddingLeft: 24,
    // paddingRight: 16,
  },

  modalContainer: {
    width: '80%',
    borderRadius: 15,
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: GRAY_COLOR,
    height: 0.5,
  },
  closeBtn: {
    display: 'flex',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    color: SECONDARY_COLOR,
  },
  overlayHeaderContainerStyle: {
    alignItems: 'center',
  },
  overlayHeaderTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
});
