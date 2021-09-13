import React from 'react';
import {
    Text
} from 'react-native';
import { PRIMARY_COLOR } from '../theme/Colors'

const EmailWarning = ({style}) => {
    return (
        <Text style={[{
            color: PRIMARY_COLOR,
            fontSize: 10,
        },style]}>Make sure your email is correct before pressing continue.</Text>
    )
}

export default EmailWarning;