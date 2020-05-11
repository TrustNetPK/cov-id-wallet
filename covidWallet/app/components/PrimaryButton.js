import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PRIMARY_COLOR } from '../constants/constants'

function PrimaryButton(props) {
    return (<TouchableOpacity style={styles.primaryButton} onPress={props.nextHandler}>
                <Text>Next</Text>
            </TouchableOpacity>)
}

const styles = StyleSheet.create({
    primaryButton: {
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingRight: 20,
        marginTop: 60,
        backgroundColor:'#4178CD',
        borderRadius:10,
        alignItems: 'stretch'
    }
});

export default PrimaryButton;