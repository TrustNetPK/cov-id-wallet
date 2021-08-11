import React from 'react';
import { View, Platform, TouchableHighlight, Pressable } from 'react-native';

const TouchableComponent = (props) => {
    if (Platform.OS == "ios") {
        return (
            <TouchableHighlight underlayColor={"#00000010"} {...props}>
                {props.children}
            </TouchableHighlight>
        )
    } else {
        return (
            <View style={{ borderRadius: 16, overflow: "hidden" }}>
                <Pressable android_ripple={{ borderless: false }} {...props}>
                    {props.children}
                </Pressable>
            </View>
        )
    }
}

export default TouchableComponent;