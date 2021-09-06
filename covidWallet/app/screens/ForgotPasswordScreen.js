import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

import PhoneInput from "react-native-phone-number-input";
import HeadingComponent from '../components/HeadingComponent';
import { BACKGROUND_COLOR, GREEN_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../theme/Colors';
import SimpleButton from '../components/Buttons/SimpleButton';
import { _showAlert } from '../helpers/Toast';
import BackButton from '../components/Buttons/BackButton';
import { _sendPasswordResetAPI } from '../gateways/auth';
import { analytics_log_reset_password } from '../helpers/analytics';

const ForgotPasswordScreen = ({navigation}) => {

    const [phone, setPhone] = useState('');
    const phoneInput = useRef(null);
    const [isLoading, setLoading] = useState(false);

    // Send reset password link to inputted phone
    const _onSendClick = async () => {
        // Check if phone number is valid
        const checkValid = phoneInput.current?.isValidNumber(phone);
        if (!checkValid) {
            _showAlert('Zada Wallet', 'Please enter a valid phone number.')
            return
        }
        
        // calling api to send password reset link
        try {
            setLoading(true);

            const result = await _sendPasswordResetAPI(phone);
            if(result.data.success){

                analytics_log_reset_password();

                navigation.goBack();
                _showAlert('Zada Wallet','A password reset link has been sent to your number');
            }
            else{
                _showAlert('Zada Wallet',result.data.error);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            _showAlert('Zada Wallet',error.toString());
        }
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles._mainContainer}
        >
            <BackButton 
                onPress={()=>{
                    navigation.goBack();
                }}
                color={WHITE_COLOR}
            />

            <ScrollView
                style={{
                    flexGrow: 0,
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles._inputMainContainer}
            >
                {/* Heading */}
                <View style={{ marginLeft: 50, marginRight: 50 }}>
                    <HeadingComponent text="Reset Password!" />
                </View>

                {/* Phone Input */}
                <PhoneInput
                    ref={phoneInput}
                    defaultValue={phone}
                    defaultCode="MM"
                    layout="second"
                    containerStyle={styles._phoneInputContainer}
                    textInputStyle={styles._phoneTextStyle}
                    countryPickerButtonStyle={styles._countryPickerBtn}
                    textContainerStyle={styles._phoneTextContainer}
                    codeTextStyle={styles._codeTextStyle}
                    onChangeFormattedText={(text) => {
                        setPhone(text);
                    }}
                    disableArrowIcon
                    withShadow
                />

                {/* Send Button */}
                <SimpleButton 
                    isLoading={isLoading}
                    loaderColor={WHITE_COLOR}
                    onPress={_onSendClick}
                    width={250}
                    title='SEND RESET LINK'
                    titleColor={WHITE_COLOR}
                    buttonColor={GREEN_COLOR}
                    style={{
                        alignSelf: 'center',
                        marginTop: 10,
                        marginBottom: 25,
                    }}
                />

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    _mainContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PRIMARY_COLOR
    },
    _inputMainContainer:{
        backgroundColor: BACKGROUND_COLOR,
        alignContent: 'center',
        width: width - 40,
        justifyContent: 'space-around',
        borderRadius: 10,
    },
    _phoneInputContainer:{
        flexDirection: "row",
        backgroundColor: WHITE_COLOR,
        borderRadius: 10,
        height: 45,
        marginTop: 8,
        alignSelf: "center",
        width: '88%',
        marginLeft: 4,
    },
    _phoneTextContainer:{
        fontSize: 16, 
        padding: 0, 
        borderRadius: 10, 
        backgroundColor: WHITE_COLOR
    },
    _phoneTextStyle:{
        fontSize: 14, 
        height: 45
    },
    _countryPickerBtn:{
        width: 65, 
        borderRightColor: "#000040", 
        borderRightWidth: 0.5
    },
    _codeTextStyle:{
        fontSize: 14,
        textAlign: "center", 
        textAlignVertical: "center", 
        padding: 0, 
        margin: 0
    },
})

export default ForgotPasswordScreen;
