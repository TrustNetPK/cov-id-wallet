import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';

import Modal from 'react-native-modal';
import { BACKGROUND_COLOR, GRAY_COLOR, GREEN_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../theme/Colors';
import SimpleButton from './Buttons/SimpleButton';
import FeatherIcon from 'react-native-vector-icons/Feather';

const ZignSecModal = ({ isVisible, onContinueClick, onLaterClick }) => {

    return (
        <Modal
            animationIn={'zoomIn'}
            animationInTiming={700}
            animationOut={'zoomOut'}
            animationOutTiming={700}
            onBackButtonPress={onLaterClick}
            onBackdropPress={onLaterClick}
            isVisible={isVisible}
        >
            <View style={styles._mainContainer}>
                <FeatherIcon
                    name='info'
                    size={Dimensions.get('window').width * 0.2}
                    color={PRIMARY_COLOR}
                />
                <Text style={styles._heading}>ZADA Wallet ID Created</Text>
                <View style={styles._hSeperator} />
                <Text style={styles._info}>Next step in registration is adding your document to ZADA Wallet. You can do this now, or whenever is convenient for you.</Text>
                <SimpleButton
                    width={250}
                    onPress={onContinueClick}
                    title={'Continue'}
                    titleColor={WHITE_COLOR}
                    buttonColor={GREEN_COLOR}
                />
                <SimpleButton
                    width={250}
                    onPress={onLaterClick}
                    title={'Finish Later'}
                    titleColor={GRAY_COLOR}
                    buttonColor={'transparent'}
                    style={{
                        marginTop: 5,
                    }}
                />

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    _mainContainer: {
        borderRadius: 10,
        backgroundColor: BACKGROUND_COLOR,
        padding: 15,
        alignItems: 'center',
    },
    _heading: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        marginTop: 10,
    },
    _hSeperator: {
        width: '100%',
        height: 4,
        backgroundColor: PRIMARY_COLOR,
        marginTop: 5,
    },
    _info: {
        lineHeight: 22,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginVertical: 20,
    },
})

export default ZignSecModal;
