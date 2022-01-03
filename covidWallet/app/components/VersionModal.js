import React from 'react';
import { Dimensions, Image, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { BACKGROUND_COLOR, BLACK_COLOR, GREEN_COLOR, WHITE_COLOR } from '../theme/Colors';
import SimpleButton from './Buttons/SimpleButton';

const VersionModal = ({ isVisible, versionDetails }) => {
    return (
        <Modal
            isVisible={isVisible}
        >
            <View style={styles._mainContainer}>
                <Image
                    source={require('../assets/images/smartphone.png')}
                    resizeMode='contain'
                    style={{
                        width: Dimensions.get('window').width * 0.25,
                        height: Dimensions.get('window').width * 0.25,
                        alignSelf: 'center',

                    }}
                />
                <Text style={styles._heading}>New Version Available</Text>
                <Text style={styles._info}>
                    {`A new version ${versionDetails && versionDetails.version} of ZADA Wallet is available on `}{`${Platform.OS === 'android' ? 'Play' : 'App'}`}{`store. Kindly update your application and get back again.`}
                </Text>
                <SimpleButton
                    width={250}
                    title='Update'
                    titleColor={WHITE_COLOR}
                    buttonColor={GREEN_COLOR}
                    onPress={() => {
                        if (versionDetails != undefined && versionDetails != null) {
                            Linking.openURL(versionDetails.url);
                        }
                        else {
                            if (Platform.OS === 'android')
                                Linking.openURL('https://play.google.com/store/apps/details?id=com.zadanetwork.wallet');
                            else
                                Linking.openURL('https://apps.apple.com/us/app/zada-wallet/id1578666669');
                        }
                    }}
                    style={{
                        alignSelf: 'center',
                        marginTop: 20,
                    }}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    _mainContainer: {
        backgroundColor: BACKGROUND_COLOR,
        padding: 15,
        borderRadius: 10,
    },
    _heading: {
        textAlign: 'center',
        fontSize: 18,
        color: BLACK_COLOR,
        alignSelf: 'center',
        marginVertical: 10,
        fontFamily: 'Merriweather-Bold'
    },
    _info: {
        textAlign: 'center',
        fontSize: 14,
        color: BLACK_COLOR,
        width: '90%',
        alignSelf: 'center',
    },
})

export default VersionModal
