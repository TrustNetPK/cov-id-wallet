import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    ScrollView
} from 'react-native';
import { InputComponent } from '../components/Input/inputComponent';
import { emailRegex, nameRegex } from '../helpers/validation';
import { BLACK_COLOR, WHITE_COLOR } from '../theme/Colors';

const ProfileScreen = () => {

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [disableName, setDisableName] = useState(true);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [disableEmail, setDisableEmail] = useState(true);

    // Saving Name
    const _onNameSave = () => {
        if (!nameRegex.test(name)) {
            setNameError("Please enter a name between 2-1000 alphabetical characters long. No numbers or special characters.")
            return
        }
        setNameError('');

        // call update profile api for name

    }

    //Saving Email
    const _onEmailSave = () => {
        // Check if email is valid
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address.")
            return
        }
        setEmailError('');
    }

    return (
        <View style={styles._mainContainer}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles._scrollContainer}
            >
                {/* General Items */}
                <Text style={styles._parent}>General</Text>
                
                {/* Name */}
                <View style={styles._itemContainer}>
                    <Text style={styles._itemLabel}>Name</Text>
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
                                }}
                                disabled={disableEmail}
                            />
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
