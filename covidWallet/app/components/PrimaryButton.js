import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PRIMARY_COLOR } from '../constants/constants'

function PrimaryButton(props) {
    return (<TouchableOpacity style={styles.primaryButton} onPress={props.nextHandler}>
                <Text style={{color:'white', textAlign:'center'}}>{props.title}</Text>
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
        marginTop: 20,
        backgroundColor:'#4178CD',
        textDecorationColor:'white',
        borderRadius:20,
        alignItems: 'stretch',
        width:300,
    }
});

export default PrimaryButton;