import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { BLACK_COLOR, GRAY_COLOR, GREEN_COLOR, WHITE_COLOR } from '../theme/Colors';
import { themeStyles } from '../theme/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { delete_credential } from '../gateways/credentials';
import { showMessage, showAskDialog, _showAlert } from '../helpers/Toast';
import { deleteCredentialByCredId } from '../helpers/Storage';
import OverlayLoader from '../components/OverlayLoader';
import SimpleButton from '../components/Buttons/SimpleButton';
import { analytics_log_show_cred_qr } from '../helpers/analytics';
import { PreventScreenshots } from 'react-native-prevent-screenshots';
import CredQRModal from '../components/CredQRModal';
import RenderValues from '../components/RenderValues';
import CredentialsCard from '../components/CredentialsCard';
import moment from 'moment';

function DetailsScreen(props) {

    // Credential
    const data = props.route.params.data;

    // States
    const [isLoading, setIsLoading] = useState(false)
    const [showQRModal, setShowQRModal] = useState(false);

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
                        <CredentialsCard
                            schemeId={data.values.schemaId}
                            card_title={data.name}
                            card_type={data.type}
                            issuer={data.organizationName}
                            card_user=""
                            date={moment(data.values['Issue Time']).format('DD/MM/YYYY')}
                            card_logo={{ uri: data.imageUrl }} />
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
});

export default DetailsScreen;
