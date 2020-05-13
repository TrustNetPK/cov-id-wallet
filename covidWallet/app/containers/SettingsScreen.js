import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { TextTypeView, BooleanTypeView } from '../components/ShowTypesView'

var settingLocalData = {
    'GENERAL': {
        'agent': {
            value: 'Iphone',
            type: 'Text',
            key: '1',
        },
        'Network': {
            value: 'SoverinStagingNetwork',
            type: 'Radio',
            key: '2',
            options: ['soverign', 'non-soverign']
        }
        , key: '1'
    },
    'SECURITY': {
        'BioMetricSecurity': {
            value: true,
            key: '1',
            type: 'Boolean'
        },
        'ChangeCode': {
            value: 'None',
            key: '2',
            type: 'Link',
        }
        , key: '2'
    },
    'SUPPORT': {
        'ContactUS': {
            value: 'None',
            type: 'Link',
            key: '1',
        }, key: '3'
    },
    'LISCENCE AND AGREEMENTS': { key: '4' },

};

export default function SettingsScreen() {
    const [settingsData, setSettingsData] = useState(settingLocalData)

    const toggleSwitch = (parent, child) => {
        const temp_set = { ...settingsData };
        temp_set[parent][child].value = !temp_set[parent][child].value;
        setSettingsData({ ...temp_set });
       
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={Object.keys(settingsData)}
                renderItem={({ item }) => {
                    let parent = item
                    let parentData = settingsData[parent]
                    return (
                        <View>
                            <Text style={styles.parentItem} >{parent}</Text>
                            <FlatList
                                data={Object.keys(parentData)}
                                renderItem={({ item }) => {
                                    let childData = settingsData[parent][item]
                                    if (item != 'key' && item != '')
                                        if (childData.value != 'None') {
                                            if (childData.type == 'Text')
                                                return (
                                                    <TextTypeView startValue={item + ' :  ' + childData.value} endValue='Edit' endIcon=''  ></TextTypeView>
                                                )
                                            else if (childData.type == 'Radio')
                                                return (
                                                    <TextTypeView startValue={item + ' :  ' + childData.value} endIcon='right'  ></TextTypeView>
                                                )
                                            else if (childData.type == 'Boolean') {
                                                return (
                                                    <BooleanTypeView parentValue={parent}
                                                        startValue={item}
                                                        endValue={childData.value}
                                                        toChangeValue={childData.value}
                                                        valueHandler={toggleSwitch}  ></BooleanTypeView>
                                                )
                                            } else
                                                return (
                                                    <TextTypeView startValue={item + ' :  ' + childData.value} endIcon='right'  ></TextTypeView>
                                                )
                                        }
                                        else {
                                            return (
                                                <TextTypeView startValue={item} endValue='Edit' endIcon='right'  ></TextTypeView>

                                            )
                                        }
                                }}
                            />
                        </View>
                    )
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#f7f7f7',
    },
    parentItem: {
        flex: 1,
        margin: 5,
        marginTop: 20,
        backgroundColor: '#f7f7f7',
        fontSize: 15,
        color: '#0f0f0f',
    }, childItem: {
        flex: 1,
        padding: 8,
        margin: 1,
        backgroundColor: '#ffffff',
        fontSize: 20,
        color: '#0f0f0f',
        borderRadius: 10,
    },
});