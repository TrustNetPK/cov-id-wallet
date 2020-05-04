import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

function PrimaryButton(props) {
    return (<TouchableOpacity style={styles.primaryButton} onPress={props.nextHandler}>
                <Text>Next</Text>
            </TouchableOpacity>)
}

const styles = StyleSheet.create({
    primaryButton: {
        borderColor: '#8dc03c',
        borderWidth: 2,
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingRight: 20,
        marginTop: 60
    }
});

export default PrimaryButton;