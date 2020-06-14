import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { themeStyles } from '../theme/Styles';
import { PRIMARY_COLOR, WHITE_COLOR } from '../theme/Colors';

function PrimaryButton(props) {
    
    const styles = StyleSheet.create({
        primaryButton: {
            borderColor: PRIMARY_COLOR,
            borderWidth: 2,
            borderRadius: 20,
            backgroundColor: PRIMARY_COLOR,
            paddingTop: 10,
            paddingLeft: 20,
            paddingBottom: 10,
            paddingRight: 20,
            marginTop: 10,
            width: 200,
        },
        text: {
            color: WHITE_COLOR,
            alignSelf:'center'
        }
    });
    
    return (
        <TouchableOpacity style={styles.primaryButton} onPress={props.nextHandler}>
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default PrimaryButton;