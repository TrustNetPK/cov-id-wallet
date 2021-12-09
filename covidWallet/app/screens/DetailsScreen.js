import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import { BLACK_COLOR, GRAY_COLOR, GREEN_COLOR, WHITE_COLOR } from '../theme/Colors';
import { themeStyles } from '../theme/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { delete_credential, generate_credential_qr } from '../gateways/credentials';
import { showMessage, showAskDialog, _showAlert } from '../helpers/Toast';
import { deleteCredentialByCredId, getItem, saveItem } from '../helpers/Storage';
import OverlayLoader from '../components/OverlayLoader';
import SimpleButton from '../components/Buttons/SimpleButton';
import { analytics_log_show_cred_qr } from '../helpers/analytics';
import { PreventScreenshots } from 'react-native-prevent-screenshots';
import CredQRModal from '../components/CredQRModal';
import RenderValues from '../components/RenderValues';
import ConstantsList from '../helpers/ConfigApp';
import { Buffer } from 'buffer';

function DetailsScreen(props) {

    // Credential
    const data = props.route.params.data;

    // States
    const [isLoading, setIsLoading] = useState(false)
    const [showQRModal, setShowQRModal] = useState(false);
    const [isGenerating, setGenerating] = useState(false);

    // Setting delete Icon
    useLayoutEffect(() => {
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

    async function showAlert() {
        showAskDialog("Are you sure?", "Are you sure you want to delete this certificate?", onSuccess, () => { });
    }

    async function generateQrCode() {
        try {
            setGenerating(true);
            let credentialId = data.credentialId;

            const result = await generate_credential_qr(credentialId);
            if (result.data.success) {
                let signature = result.data.signature;
                let tenantId = result.data.tenantId;
                let keyVersion = result.data.keyVersion;

                // Making QR based on signature and base 64 encoded data
                let qrData = {
                    data: Buffer.from(JSON.stringify(data.values)).toString('base64'),
                    signature: signature,
                    tenantId: tenantId,
                    keyVersion: keyVersion,
                    type: 'cred_ver',
                };

                let QR = `${ConstantsList.QR_URL}${JSON.stringify(qrData)}`;

                // Get all credentials
                let credentials = JSON.parse(await getItem(ConstantsList.CREDENTIALS));

                // Find this credential and update it with QR
                let index = credentials.findIndex(item => item.credentialId == credentialId)
                credentials[index].qrCode = QR;
                await saveItem(ConstantsList.CREDENTIALS, JSON.stringify(credentials));

                // Open QR After Updating Credentials
                data.qrCode = QR;
            }
            else {
                _showAlert('ZADA Wallet', error.message);
            }
            setGenerating(false);
        } catch (error) {
            setGenerating(false);
            _showAlert('ZADA Wallet', error.message);
        }
    }

    useEffect(() => {
        const focusEvent = props.navigation.addListener('focus', () => {
            PreventScreenshots.start();
        });
        const blurEvent = props.navigation.addListener('blur', () => {
            PreventScreenshots.stop();
        });

        return (() => {
            focusEvent;
            blurEvent;
        })
    }, [])

    return (
        <View style={[themeStyles.mainContainer]}>

            {
                isLoading &&
                <OverlayLoader
                    text='Deleting credential...'
                />
            }

            {
                isGenerating &&
                <OverlayLoader
                    text='Generating credential QR...'
                />
            }

            {data.qrCode != undefined && <CredQRModal
                isVisible={showQRModal}
                onCloseClick={() => { setShowQRModal(false) }}
                qrCode={data.qrCode}
            />}

            {
                data.qrCode != undefined ? (
                    <View style={styles.topContainer}>
                        <Image
                            source={require('../assets/images/qr-code.png')}
                            style={styles.topContainerImage}
                        />
                        <SimpleButton
                            onPress={() => {
                                setShowQRModal(true);
                                analytics_log_show_cred_qr();
                            }}
                            title='Show QR'
                            titleColor='white'
                            buttonColor={GREEN_COLOR}
                        />
                    </View>
                ) : (
                    <View style={{ margin: 15 }}>
                        <Text style={styles._noQr}>You do not have QR of your credential.</Text>
                        <SimpleButton
                            width={250}
                            onPress={generateQrCode}
                            width={Dimensions.get('window').width * 0.25}
                            title='Get QR'
                            titleColor={WHITE_COLOR}
                            buttonColor={GREEN_COLOR}
                            style={{
                                marginTop: 10,
                                alignSelf: 'center',
                            }}
                        />
                    </View>
                )
            }


            <RenderValues
                listStyle={{
                    marginTop: 10,
                }}
                listContainerStyle={{
                    paddingBottom: '10%',
                    paddingHorizontal: 15,
                }}
                inputBackground={WHITE_COLOR}
                inputTextColor={BLACK_COLOR}
                labelColor={GRAY_COLOR}
                values={data.values}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    topContainer: {
        width: 200,
        height: 200,
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    topContainerImage: {
        width: '100%',
        height: '100%',
        tintColor: '#C1C1C1',
        position: 'absolute',
    },
    headerRightIcon: {
        paddingRight: 15,
        color: BLACK_COLOR
    },
    _noQr: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        alignSelf: 'center',
    },
});

export default DetailsScreen;
