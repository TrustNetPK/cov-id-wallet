import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

import { GREEN_COLOR, WHITE_COLOR } from '../../theme/Colors';

const SimpleButton = ({ isLoading, loaderColor, title, titleColor, buttonColor, style, width, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles._btnContainer, style, { width, backgroundColor: buttonColor }]}
        >
            {
                isLoading ? (
                    <ActivityIndicator
                        size={'small'}
                        color={loaderColor}
                        style={{
                            alignSelf: 'center',
                        }}
                    />
                ) : (
                    <Text style={[styles._title, { color: titleColor }]}>{title}</Text>
                )
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    _btnContainer: {
        borderRadius: 20,
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingRight: 20,
    },
    _title: {
        color: WHITE_COLOR,
        alignSelf: 'center',
        fontFamily: 'Merriweather-Bold',
        textTransform: 'uppercase'
    },
});

export default SimpleButton;