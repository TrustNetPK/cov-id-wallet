import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { BLACK_COLOR } from '../theme/Colors';

function HeadingComponent(props) {

    const styles = StyleSheet.create({
        heading: {
            fontWeight: "bold",
            fontSize: 30,
            marginTop: 20,
            marginBottom: 15,
            color: BLACK_COLOR,
        }
    });

    return (
        <Text style={styles.heading}>{props.text}</Text>
    )
}

export default HeadingComponent;