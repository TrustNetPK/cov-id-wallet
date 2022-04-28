import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

import Modal from 'react-native-modal';
import {
  BACKGROUND_COLOR,
  GREEN_COLOR,
  SECONDARY_COLOR,
  WHITE_COLOR,
} from '../theme/Colors';
import HeadingComponent from './HeadingComponent';
import {InputComponent} from './Input/inputComponent';
const window = Dimensions.get('window');

const PincodeModal = ({
  isVisible,
  onCloseClick,
  onContinueClick,
  pincode,
  pincodeError,
  onPincodeChange,
  confirmPincode,
  confirmPincodeError,
  onConfirmPincodeChange,
}) => {
  const [pincodeSecurity, setPincodeSecurity] = useState(true);
  const [confirmPincodeSecurity, setConfirmPincodeSecurity] = useState(true);

  // Toggle pincode eye icon
  const _togglePincodeSecurity = () => {
    setPincodeSecurity(!pincodeSecurity);
  };

  // Toggle Confirm pincode eye icon
  const _toggleConfirmPincodeSecurity = () => {
    setConfirmPincodeSecurity(!confirmPincodeSecurity);
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn={'fadeInLeft'}
      animationOut={'fadeOutRight'}
      animationInTiming={500}
      animationOutTiming={500}>
      <KeyboardAvoidingView
        style={{
          height: window.height * 0.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        behavior={Platform.OS == 'ios' ? 'position' : 'height'}>
        <View
          style={[styles._mainContainer, {backgroundColor: BACKGROUND_COLOR}]}>
          <HeadingComponent text="Set Pincode!" />

          <Text style={styles._infoText}>
            Please set a 6 digit pincode e.g 123456
          </Text>

          {/* Pincode */}
          <View>
            <InputComponent
              type={'secret'}
              toggleSecureEntry={_togglePincodeSecurity}
              placeholderText="Pincode"
              errorMessage={pincodeError}
              value={pincode}
              keyboardType="number-pad"
              isSecureText={pincodeSecurity}
              autoCapitalize={'none'}
              inputContainerStyle={styles.inputView}
              setStateValue={onPincodeChange}
            />
          </View>

          {/* Confirm Pincode */}
          <View>
            <InputComponent
              type={'secret'}
              toggleSecureEntry={_toggleConfirmPincodeSecurity}
              placeholderText="Confirm pincode"
              errorMessage={confirmPincodeError}
              value={confirmPincode}
              keyboardType="number-pad"
              isSecureText={confirmPincodeSecurity}
              autoCapitalize={'none'}
              inputContainerStyle={styles.inputView}
              setStateValue={onConfirmPincodeChange}
            />
          </View>

          {/* Buttons */}
          <View style={styles._btnContainer}>
            <TouchableOpacity
              onPress={onContinueClick}
              style={[styles._button, {backgroundColor: GREEN_COLOR}]}>
              <Text style={styles._btnTitle}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  _mainContainer: {
    borderRadius: 10,
  },
  _infoText: {
    paddingHorizontal: 20,
  },
  inputView: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    width: '94%',
    marginLeft: 10,
    height: 45,
    marginTop: 8,
    paddingLeft: 16,
    borderBottomWidth: 0,
  },
  _btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  _button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  _btnTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: WHITE_COLOR,
  },
});

export default PincodeModal;
