import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal';
import { BACKGROUND_COLOR, GREEN_COLOR } from '../theme/Colors';
import SimpleButton from './Buttons/SimpleButton';
import HeadingComponent from './HeadingComponent';

const FailureModal = ({ isVisible, heading, info, onOkayPress, onCloseClick }) => {
    return (
        <Modal
            animationIn='slideInLeft'
            animationOut='slideOutRight'
            isVisible={isVisible}
            onBackButtonPress={onCloseClick}
            onBackdropPress={onCloseClick}
        >
            <View style={styles._mainContainer}>
                <HeadingComponent
                    text={heading}
                />
                <Image
                    source={require('../assets/images/cross.png')}
                    resizeMode='contain'
                    style={{
                        width: Dimensions.get('screen').width * 0.4,
                        height: Dimensions.get('screen').width * 0.4,
                    }}
                />
                <Text style={styles._info}>{info}</Text>
                <SimpleButton
                    title='OKAY'
                    titleColor='white'
                    buttonColor={GREEN_COLOR}
                    onPress={onOkayPress}
                    width={250}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    _mainContainer: {
        borderRadius: 10,
        backgroundColor: BACKGROUND_COLOR,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    _info: {
        fontSize: 14,
        color: 'black',
        marginVertical: 20,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
});

export default FailureModal;