import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { themeStyles } from '../theme/styles';

function PrimaryButton(props) {
    return (
        <TouchableOpacity style={themeStyles.primaryButton} onPress={props.nextHandler}>
            <Text>Next</Text>
        </TouchableOpacity>
    )
}


export default PrimaryButton;