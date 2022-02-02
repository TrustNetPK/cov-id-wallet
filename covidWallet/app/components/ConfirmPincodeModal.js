import React, { useState } from 'react';
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
import { BACKGROUND_COLOR, GREEN_COLOR, SECONDARY_COLOR, WHITE_COLOR } from '../theme/Colors';
import HeadingComponent from './HeadingComponent';
import { InputComponent } from './Input/inputComponent';
const window = Dimensions.get('window');

const ConfirmPincodeModal = ({isVisible, onCloseClick, onContinueClick, pincode, pincodeError, onPincodeChange }) => {

    const [pincodeSecurity, setPincodeSecurity] = useState(true);

    // Toggle pincode eye icon
    const _togglePincodeSecurity = () => {
        setPincodeSecurity(!pincodeSecurity);
    }

    return (
        <Modal
            isVisible={isVisible}
            animationIn={'slideInLeft'}
            animationOut={'slideOutRight'}
        >
            <KeyboardAvoidingView
                style={{ height: window.height * 0.5, alignItems: 'center', justifyContent: 'center' }}
                behavior={Platform.OS == 'ios' ? 'position' : 'height'}
            >
                <View style={[styles._mainContainer, {backgroundColor: BACKGROUND_COLOR}]}>
                <HeadingComponent 
                    text='Verify Request!'
                />

                <Text style={styles._infoText}>Please enter your 6 digit pincode to verify request</Text>

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
                        inputContainerStyle={{ width: '80%' }}
                        inputContainerStyle={styles.inputView}
                        setStateValue={onPincodeChange}
                    />
                </View>

                {/* Buttons */}
                <View style={styles._btnContainer}>
                    <TouchableOpacity
                        onPress={onCloseClick}
                        style={[styles._button, {backgroundColor: SECONDARY_COLOR}]}
                    >
                        <Text style={styles._btnTitle}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onContinueClick}
                        style={[styles._button, {backgroundColor: GREEN_COLOR}]}
                    >
                        <Text style={styles._btnTitle}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>

            </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    _mainContainer:{
        borderRadius: 10,
    },
    _infoText:{
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
    _btnContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    _button:{
        width: '45%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 5,
    },
    _btnTitle:{
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: WHITE_COLOR
    }
});

export default ConfirmPincodeModal;
