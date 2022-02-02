import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { GREEN_COLOR, WHITE_COLOR } from '../theme/Colors'
import SimpleButton from './Buttons/SimpleButton'

const ErrorFallback = ({ error, resetError }) => {
    return (
        <View style={styles._mainContainer}>
            <Image
                source={require('../assets/images/dizzy-robot.png')}
                resizeMode='contain'
                style={styles._imgStyle}
            />
            <Text style={styles._error}>Oops! I'm crashed. Please give me another chance by pressing below button</Text>
            <SimpleButton
                onPress={resetError}
                title='Try Again'
                titleColor={'white'}
                buttonColor={GREEN_COLOR}
                width={'100%'}
                style={{
                    marginTop: 10,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    _mainContainer: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WHITE_COLOR,
    },
    _error: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    },
    _imgStyle: {
        alignSelf: 'center',
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
    },
})

export default ErrorFallback;