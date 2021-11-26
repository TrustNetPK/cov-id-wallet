import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { BLACK_COLOR, GRAY_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../theme/Colors';
import { themeStyles } from '../theme/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { delete_credential, get_signature } from '../gateways/credentials';
import { showMessage, showAskDialog, _showAlert } from '../helpers/Toast';
import { deleteCredentialByCredId } from '../helpers/Storage';
import OverlayLoader from '../components/OverlayLoader';
import moment from 'moment';
import { Buffer } from 'buffer';
import ConstantList from '../helpers/ConfigApp'

export default function DetailsScreen(props) {

    // Constants
    const data = props.route.params.data;

    // Sorting Values in alphabetical order
    let orderedValues = undefined;
    orderedValues = Object.keys(data.values).sort().reduce(
        (obj, key) => {
            obj[key] = data.values[key];
            return obj;
        },
        {}
    );

    // States
    const [isLoading, setIsLoading] = useState(false)
    const [qrLoading, setQRLoading] = useState(false);
    const [qr, setQR] = useState('');

    useLayoutEffect(() => {
        // Setting delete Icon
        props.navigation.setOptions({
            headerRight: () => (
                <MaterialIcons
                    onPress={() => !isLoading ? showAlert() : {}}
                    style={styles.headerRightIcon}
                    size={25}
                    name="delete"
                    padding={30}
                />
            ),
        })
    })

    async function onSuccess() {
        try {
            setIsLoading(true)

            // Delete credentials Api
            let result = await delete_credential(data.credentialId);
            if (result.data.success) {
                deleteCredentialByCredId(data.credentialId);
                showMessage('ZADA Wallet', 'Credential is deleted successfully');
                props.navigation.goBack();
            } else {
                showMessage('ZADA Wallet', result.data.message);
            }

            setIsLoading(false)
        } catch (e) {
            console.log(e);
            setIsLoading(false)
        }
    }

    function onReject() { }

    async function showAlert() {
        showAskDialog("Are you sure?", "Are you sure you want to delete this certificate?", onSuccess, onReject);
    }

    function renderTitleInput(title, index) {
        let value = orderedValues[title];

        if (title == 'Issue Time') {
            return (
                <View
                    key={index}
                    style={{
                        marginLeft: 16,
                        marginRight: 16,
                    }}>
                    <Text style={{ color: GRAY_COLOR, marginLeft: 8, marginTop: 8, marginBottom: 4, }}>{title}</Text>
                    <View style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        backgroundColor: WHITE_COLOR,
                        color: BLACK_COLOR,
                        height: 40,
                        marginBottom: 4,
                        borderRadius: 16,
                        justifyContent: "center"
                    }}>
                        <Text style={{ color: BLACK_COLOR }}>{moment(value).format('DD/MM/YYYY HH:MM A')}</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View
                    key={index}
                    style={{
                        marginLeft: 16,
                        marginRight: 16,
                    }}>
                    <Text style={{ color: GRAY_COLOR, marginLeft: 8, marginTop: 8, marginBottom: 4, }}>{title}</Text>
                    <View style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        backgroundColor: WHITE_COLOR,
                        color: BLACK_COLOR,
                        height: 40,
                        marginBottom: 4,
                        borderRadius: 16,
                        justifyContent: "center"
                    }}>
                        <Text style={{ color: BLACK_COLOR }}>{value}</Text>
                    </View>
                </View>
            )
        }

    }

    // Effect to fetch signature
    useEffect(() => {
        const fetch_signature = async () => {
            try {
                setQRLoading(true);
                const result = await get_signature(data.credentialId);
                if (result.data.success) {
                    // Converting values in base64
                    let objJsonStr = JSON.stringify(data.values);
                    let base64Values = Buffer.from(objJsonStr).toString("base64");

                    // Making QR based on signature and base 64 encoded data
                    let qrData = {
                        base64: base64Values,
                        signature: result.data.signature,
                        type: 'cred_ver'
                    }
                    setQR(`${ConstantList.QR_URL}${JSON.stringify(qrData)}`);
                }
                else {
                    _showAlert('ZADA Wallet', result.data.message);
                }
                setQRLoading(false);
            } catch (error) {
                setQRLoading(false);
                _showAlert('ZADA Wallet', error.message);
            }
        }
        fetch_signature();
    }, [])

    return (
        <View style={[themeStyles.mainContainer]}>
            {
                isLoading &&
                <OverlayLoader
                    text='Deleting credential...'
                />
            }
            <View style={styles.container}>
                <View style={styles.CredentialsCardContainer}>
                    {
                        qrLoading ? (
                            <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator
                                    size='small'
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={{ fontSize: 16, marginTop: 5 }}>Loading QR...</Text>
                            </View>
                        ) : (
                            <Image
                                source={{ uri: qr }}
                                resizeMode='contain'
                                style={{
                                    width: 160,
                                    height: 160,
                                    alignSelf: 'center'
                                }}
                            />
                        )
                    }
                </View>
            </View>


            <KeyboardAwareScrollView
                style={{
                    maxHeight: '70%',
                    marginTop: 16,
                }}>
                {
                    orderedValues != undefined && Object.keys(orderedValues).map((e, i) => {
                        return (
                            renderTitleInput(e, i)
                        )
                    })
                }
            </KeyboardAwareScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    headerRightIcon: {
        padding: 10,
        color: BLACK_COLOR
    },
    container: {
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    CredentialsCardContainer: {
        paddingTop: 5
    },
});
