import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Linking, Alert } from 'react-native';
import { BACKGROUND_COLOR, BLACK_COLOR, GRAY_COLOR, WHITE_COLOR } from '../theme/Colors';
import CredentialsCard from '../components/CredentialsCard';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

export default function DetailsScreen(props) {

    const data = props.route.params.data;
    const vaccineName = data.name
    const imgURI = { uri: data.imageUrl }
    const issuedBy = "{issuer_name}"

    function renderTitleInput(title, index) {
        let value = Object.values(data.values)[index];
        return (
            <View
                key={index}
                style={{
                    marginLeft: 16,
                    marginRight: 16,
                }}>
                <Text style={{ color: GRAY_COLOR, marginLeft: 8, marginTop: 8, marginBottom: 4, }}>{title}</Text>
                <View style={{
                    paddingLeft: 16,
                    paddingRight: 16,
                    backgroundColor: WHITE_COLOR,
                    color: BLACK_COLOR,
                    height: 40,
                    marginBottom: 4,
                    borderRadius: 16,
                    justifyContent: "center"
                }}>
                    <Text style={{ color: BLACK_COLOR }}>{value}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[themeStyles.mainContainer]}>
            {/* <View style={{ flexDirection: "row", }}>
                <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                    style={{
                        width: '12%',
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Ionicons name="ios-arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ justifyContent: "center", width: '80%' }}>
                    <HeadingComponent text="Details" />
                </View>
            </View> */}
            <View style={styles.container}>
                <View style={styles.CredentialsCardContainer}>
                    <CredentialsCard card_title={vaccineName} card_type="Digital Certificate" issuer={issuedBy} card_user="SAEED AHMAD" date="05/09/2020" card_logo={imgURI} />
                </View>
            </View>


            <KeyboardAwareScrollView style={{
                maxHeight: '70%',
            }}>
                {
                    data.values != undefined && Object.keys(data.values).map((e, i) => {
                        return (
                            renderTitleInput(e, i)
                        )
                    })
                }
            </KeyboardAwareScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        paddingLeft: 5,
        paddingRight: 5,
    },
    CredentialsCardContainer: {
        paddingTop: 5
    },
});
