import React from 'react';
import {
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('screen');
import AntIcon from 'react-native-vector-icons/AntDesign';

const BackButton = ({ color, onPress, style }) => {
    return (
        <AntIcon
            onPress={onPress}
            name='arrowleft'
            color={color}
            size={26}
            style={
                [
                    {
                        position: 'absolute',
                        left: width * 0.05,
                        top: height * 0.07,
                        zIndex: 10,
                    },
                    style
                ]
            }
        />
    )
}

export default BackButton;
