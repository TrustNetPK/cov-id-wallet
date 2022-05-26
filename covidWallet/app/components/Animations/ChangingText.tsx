import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface INProps {
    messageIndex: number
}
const ChangingText = (props: INProps) => {

    // Constants
    const messages = [
        'Checking for new version...',
        'Fetching Data...',
        'Please wait...',
        'Decrypting your wallet...',
    ];

    return (
        <Text style={styles.textStyle}>
            {messages[props.messageIndex]}
        </Text>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        color: "white",
    },
})
export default ChangingText;