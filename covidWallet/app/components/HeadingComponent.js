import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

function HeadingComponent(props) {

    const styles = StyleSheet.create({
        heading: {
          fontWeight: "bold",
          fontSize: 30,
        }});

    return (
        <Text style={styles.heading}>{props.text}</Text>
    )
}

export default HeadingComponent;