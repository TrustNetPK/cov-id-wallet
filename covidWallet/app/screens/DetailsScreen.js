import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { BACKGROUND_COLOR, BLACK_COLOR, GRAY_COLOR, WHITE_COLOR } from '../theme/Colors';
import { themeStyles } from '../theme/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { delete_credential } from '../gateways/credentials';
import { showMessage, showAskDialog, _showAlert } from '../helpers/Toast';
import { deleteCredentialByCredId } from '../helpers/Storage';
import OverlayLoader from '../components/OverlayLoader';
import moment from 'moment';
import Modal from 'react-native-modal';
import HeadingComponent from '../components/HeadingComponent';

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
    const [showQRModal, setShowQRModal] = useState(false);

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

    return (
        <View style={[themeStyles.mainContainer]}>

            <Modal
                isVisible={showQRModal}
                onBackdropPress={() => { setShowQRModal(false) }}
                onBackButtonPress={() => { setShowQRModal(false) }}
            >
                <View style={styles._qrContainer}>
                    <HeadingComponent
                        text={`Scan QR to \n verify credential`}
                    />
                    <Image
                        source={{ uri: data.qrCode }}
                        resizeMode='contain'
                        style={{
                            width: Dimensions.get('screen').width * 0.6,
                            height: Dimensions.get('screen').width * 0.6,
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => { setShowQRModal(false) }}
                        style={{ marginTop: 15 }}
                    >
                        <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {
                isLoading &&
                <OverlayLoader
                    text='Deleting credential...'
                />
            }
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => { setShowQRModal(true) }}
                    activeOpacity={0.9}
                    style={styles.CredentialsCardContainer}
                >
                    {
                        data.qrCode ? (
                            <ImageBackground
                                source={require('../assets/images/blur_qrcode.png')}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Show QR Code</Text>
                            </ImageBackground>
                        ) : (
                            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>Certificate has no QR Code to verify</Text>
                            </View>
                        )
                    }

                </TouchableOpacity>

            </View>


            <KeyboardAwareScrollView
                style={{
                    maxHeight: '70%',
                    marginTop: 16,
                }}
                contentContainerStyle={{
                    paddingBottom: '10%'
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
        width: 200,
        height: 200,
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden'
    },
    _qrContainer: {
        backgroundColor: BACKGROUND_COLOR,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
});
