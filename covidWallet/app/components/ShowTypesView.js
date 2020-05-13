import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Switch, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import Icon from 'react-native-vector-icons/AntDesign';

export function TextTypeView({ startValue, endValue, endIcon }) {
    if (endIcon == '')
        return (

            <View style={styles.container}>
                <Text style={styles.startItem}>{startValue}</Text>
                <TouchableOpacity style={styles.endItem} onPress={() => {}}>
                    <Text style={styles.endItem}>{endValue}</Text>
                </TouchableOpacity>
            </View>
        )
    else {
        return (
            <View style={styles.container}>
                <Text style={styles.startItem}>{startValue}</Text>
                <TouchableOpacity onPress={() => {}}>
                    <Icon name={endIcon} style={styles.endItem} />
                </TouchableOpacity>
            </View>

        )
    }
}



export function BooleanTypeView({ startValue, endValue, valueHandler, parentValue }) {
    return (
        <View style={styles.container}>
            <Text style={styles.startItem}>{startValue}</Text>
            <Switch
                trackColor={{ false: "#81b0ff", true: "#81b0ff" }}
                thumbColor={endValue ? "#3ab6ae" : "#3ab6ff"}
                ios_backgroundColor="#ffffff"
                onValueChange={()=>valueHandler(parentValue, startValue)}
                value={endValue}
            />
        </View>

    )


}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 10,
        margin: 1,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    startItem: {
        flex: 5,
        fontSize: 17,
        color: '#0f0f0f',
    }, endItem: {
        justifyContent: 'flex-end',
        flex: 1,
        backgroundColor: '#ffffff',
        fontSize: 15,
        color: '#3ab6ae',
    },
});