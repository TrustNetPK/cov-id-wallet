import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { PRIMARY_COLOR, WHITE_COLOR, RED_COLOR } from '../theme/Colors';

function ErrorComponent(props) {

    const styles = StyleSheet.create({
        text: {
            color: RED_COLOR,
            marginTop: '10%',
            textAlign: 'center',
            justifyContent: 'center'
        },
    });

    return (
        <View>
            <Text style={styles.text}>{props.text}</Text>
        </View>
    )
}

export default ErrorComponent;