import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface INProps {
    count: number
}
const ChangingText = (props: INProps) => {

    // Constants
    const messages = [
        'Checking for new version...',
        'Fetching Data...',
        'Please wait...',
        'Decrypting your wallet...',
    ];

    useEffect(() => {
        console.log('props.count => ', props.count);
    }, [props.count])
    return (
        <Text style={styles.textStyle}>
            {messages[props.count]}
        </Text>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        color: "white",
    },
})
export default ChangingText;