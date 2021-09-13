import React, { useEffect, useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    ScrollView
} from 'react-native';
import { InputComponent } from '../components/Input/inputComponent';
import OverlayLoader from '../components/OverlayLoader';
import { _fetchProfileAPI, _updateProfileAPI } from '../gateways/auth';
import { _showAlert } from '../helpers/Toast';
import { emailRegex, nameRegex, validateIfLowerCased } from '../helpers/validation';
import { BLACK_COLOR, GREEN_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../theme/Colors';
import { saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import SimpleButton from '../components/Buttons/SimpleButton';
import EmailWarning from '../components/EmailWarning';

const ProfileScreen = () => {

    const [isLoading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [disableName, setDisableName] = useState(true);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailWarning, setEmailWarning] = useState(false);
    const [disableEmail, setDisableEmail] = useState(true);

    const [isCurrPassSecure, setCurrPassSecure] = useState(true);
    const [currPassword, setCurrPassword] = useState('');
    const [currPasswordError, setCurrPasswordError] = useState('');

    const [isNewPassSecure, setNewPassSecure] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');

    // toggle current password security
    const _toggleCurrPassSecurity = () => {
        setCurrPassSecure(!isCurrPassSecure);
    }

    // toggle new password security
    const _toggleNewPassSecurity = () => {
        setNewPassSecure(!isNewPassSecure);
    }

    // Saving Name
    const _onNameSave = async () => {
        if (!nameRegex.test(name)) {
            setNameError("Please enter a name between 2-1000 alphabetical characters long. No numbers or special characters.")
            return
        }
        setNameError('');

        // call update profile api for name
        try {
            setLoading(true);

            let data = {
                name: name.trim().toString()
            };
    
            const result = await _updateProfileAPI(data);
            if(result.data.success){
                _showAlert('Zada Wallet','Profile has been updated successfully');
                setDisableName(true);
            }
            else{
                _showAlert('Zada Wallet',result.data.error)
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            _showAlert('Zada Wallet',error.toString());
        }

    }

    //Saving Email
    const _onEmailSave = async () => {
        // Check if email is valid
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address.")
            return
        }
        setEmailError('');

        // call api to update email
        try {
            setLoading(true);
            setEmailWarning(false);

            let data = {
                email: email.toLowerCase().trim().toString()
            };
    
            const result = await _updateProfileAPI(data);
            if(result.data.success){
                _showAlert('Zada Wallet','Profile has been updated successfully');
                setDisableEmail(true);
            }
            else{
                _showAlert('Zada Wallet',result.data.error)
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            _showAlert('Zada Wallet',error.toString());
        }
    }

    // Fetching user profile
    const _fetchProfile = async () => {
        try {
            setProfileLoading(true);
            const result = await _fetchProfileAPI();
            if(result.data.success){
                await saveItem(ConstantsList.USER_PROFILE, JSON.stringify(result.data.user))
                setName(result.data.user.name);
                setEmail(result.data.user.email);
            }
            else{
                _showAlert('Zada Wallet', result.data.error.toString());
            } 
            setProfileLoading(false);  
        } catch (error) {
            setProfileLoading(false); 
            _showAlert('Zada Wallet', error.toString());
        }
    }

    // Function to update user password
    const _onUpdatePasswordClick = async () => {
        if (currPassword == "") {
            setCurrPasswordError('Current password is required.');
            return;
        }
        if (!validateIfLowerCased(currPassword)) {
            setSecretError('Current password must be in lowercase.')
            return
        }
        setCurrPasswordError('');
    
        if (newPassword == "") {
            setNewPasswordError('New password is required.');
            return;
        }
        
        if (!validateIfLowerCased(newPassword)) {
            setNewPasswordError('New password must be in lowercase.')
            return
        }

        setNewPasswordError('');

        // call api to update password
        try {
            setLoading(true);

            let data = {
                oldSecretPhrase: currPassword.trim(),
                newSecretPhrase: newPassword.trim(),
            };
    
            const result = await _updateProfileAPI(data);
            if(result.data.success){
                await saveItem(ConstantsList.WALLET_SECRET, newPassword.trim());
                _showAlert('Zada Wallet','Password has been updated successfully');
                setCurrPassword('');
                setNewPassword('');
            }
            else{
                _showAlert('Zada Wallet',result.data.error)
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            _showAlert('Zada Wallet',error.toString());
        }
    
    }

    // Effect to fetch user profile
    useEffect(()=>{
        _fetchProfile();
    },[])

    return (
        <View style={styles._mainContainer}>

            {
                isLoading &&
                <OverlayLoader 
                    text='Updating your profile...'
                />
            }

            {
                profileLoading &&
                <OverlayLoader 
                    text='Fetching your profile'
                />
            }

            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles._scrollContainer}
            >
                {/* General Items */}
                <Text style={styles._parent}>General</Text>
                
                {/* Name */}
                <View style={styles._itemContainer}>
                    <Text style={styles._itemLabel}>Full Name (Official Name)</Text>
                    <View style={styles._row}>
                        
                        <View style={{width: '85%'}}>
                            <InputComponent
                                height={45}
                                placeholderText="Name"
                                errorMessage={nameError}
                                value={name}
                                isSecureText={false}
                                inputContainerStyle={styles._inputView}
                                setStateValue={(text) =>{
                                    setName(text);
                                }}
                                disabled={disableName}
                            />
                        </View>
                        
                        <Text 
                            onPress={()=>{
                                disableName ? (
                                    setDisableName(!disableName)
                                ):(
                                    _onNameSave()
                                )
                                
                            }} 
                            style={styles._editText}
                        >
                            {disableName ? 'Edit' : 'Save'}
                        </Text>
                    </View>
                </View>
            
                {/* Email */}
                <View style={styles._itemContainer}>
                    <Text style={styles._itemLabel}>Email</Text>
                    <View style={styles._row}>
                        
                        <View style={{width: '85%'}}>
                            <InputComponent
                                height={45}
                                placeholderText="Email"
                                errorMessage={emailError}
                                value={email}
                                isSecureText={false}
                                inputContainerStyle={styles._inputView}
                                setStateValue={(text) =>{
                                    setEmail(text);
                                    let domain = text.split('@');
                                    if(domain.length == 2){

                                        let domainName = domain[1].toLowerCase();

                                        if(domainName !== 'gmail.com' && domainName !== 'yahoo.com' && domainName !== 'outlook.com'){
                                            setEmailWarning(true);
                                            return
                                        }
                                        
                                        setEmailWarning(false);
                                        return

                                    }
                                    else
                                        setEmailWarning(false);
                                }}
                                disabled={disableEmail}
                            />
                            {
                                emailWarning &&
                                <EmailWarning 
                                    style={{
                                        marginLeft: 12,
                                        marginRight: 12,
                                        marginTop: 5,
                                    }}
                                />
                            }
                        </View>
                        
                        <Text 
                            onPress={()=>{
                                disableEmail ? (
                                    setDisableEmail(!disableEmail)
                                ):(
                                    _onEmailSave()
                                )
                                
                            }}
                            style={styles._editText}
                        >
                            {disableEmail ? 'Edit' : 'Save'}
                        </Text>
                    </View>
                </View>
            
                {/* Change Password */}
                <Text style={styles._parent}>Change Password</Text>
                
                {/* Current Password */}
                <View style={styles._itemContainer}>
                    <View style={{width: '100%'}}>
                        <InputComponent
                            height={45}
                            type={'secret'}
                            toggleSecureEntry={_toggleCurrPassSecurity}
                            placeholderText="Current password"
                            errorMessage={currPasswordError}
                            value={currPassword}
                            keyboardType="default"
                            isSecureText={isCurrPassSecure}
                            autoCapitalize={'none'}
                            inputContainerStyle={styles._inputView}
                            setStateValue={(text) => {
                                setCurrPassword(text.replace(',', ''));
                            }}
                        />
                    </View>
                </View>

                {/* New Password */}
                <View style={styles._itemContainer}>
                    <View style={{width: '100%'}}>
                        <InputComponent
                            height={45}
                            type={'secret'}
                            toggleSecureEntry={_toggleNewPassSecurity}
                            placeholderText="New password"
                            errorMessage={newPasswordError}
                            value={newPassword}
                            keyboardType="default"
                            isSecureText={isNewPassSecure}
                            autoCapitalize={'none'}
                            inputContainerStyle={styles._inputView}
                            setStateValue={(text) => {
                                setNewPassword(text.replace(',', ''));
                            }}
                        />
                    </View>
                </View>

                {/* Update Password Button */}
                <View style={styles._itemContainer}>
                    <View style={{width: 250, alignSelf: 'center'}}>
                        <SimpleButton 
                            onPress={_onUpdatePasswordClick}
                            width={'100%'}
                            title='Update Password'
                            titleColor={WHITE_COLOR}
                            buttonColor={GREEN_COLOR}
                            style={{
                                marginTop: 10,
                            }}
                        />
                    </View>
                </View>
                
            
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    _mainContainer:{
        flex: 1,
    },
    _scrollContainer:{
        flex: 1,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#f7f7f7',
    },
    _parent:{
        marginHorizontal: 5,
        marginTop: 20,
        fontSize: 15,
        color: '#6f6f6f',
        marginBottom: 10,
    },
    _itemContainer:{
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    _itemLabel:{
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: BLACK_COLOR,
        marginLeft: 10,
        marginBottom: 5,
    },
    _row:{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    _inputView:{
        backgroundColor: WHITE_COLOR,
        borderRadius: 10,
        width: '100%',
        height: 45,
        paddingLeft: 15,
        paddingRight: 10,
        borderBottomWidth: 0,
    },
    _editText:{
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        marginRight: 14,
    },
});

export default ProfileScreen;
