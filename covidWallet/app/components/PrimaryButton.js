import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

function PrimaryButton(props) {
    return (<TouchableOpacity style={styles.primaryButton} onPress={props.nextHandler}>
                <Text>Next</Text>
            </TouchableOpacity>)
}

const styles = StyleSheet.create({
    primaryButton: {
        marginTop: 90
    }
});

export default PrimaryButton;