import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Linking, Alert } from 'react-native';
import { BACKGROUND_COLOR, BLACK_COLOR, GRAY_COLOR, WHITE_COLOR } from '../theme/Colors';
import CredentialsCard from '../components/CredentialsCard';
import { themeStyles } from '../theme/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { delete_credential } from '../gateways/credentials';
import { showMessage, showAskDialog } from '../helpers/Toast';
import { deleteCredentialByCredId } from '../helpers/Storage';
import OverlayLoader from '../components/OverlayLoader';
import moment from 'moment';

export default function DetailsScreen(props) {

    // Constants
    const data = props.route.params.data;

    // Sorting Values in alphabetical order
    let orderedValues = undefined;
    orderedValues = Object.keys(data.values).sort().reduce(
        (obj, key) => {
            obj[key] = data.values[key];
            return obj;
        },
        {}
    );

    const vaccineName = data.name;
    const imgURI = { uri: data.imageUrl };
    const issuedBy = data.organizationName;
    let card_type = data.type;
    let issueDate = data.values['Issue Time'];

    let date = moment(issueDate).format('DD/MM/YYYY');

    // States
    const [isLoading, setIsLoading] = useState(false)

    useLayoutEffect(() => {
        // Setting delete Icon
        props.navigation.setOptions({
            headerRight: () => (
                <MaterialIcons
                    onPress={() => !isLoading ? showAlert() : {}}
                    style={styles.headerRightIcon}
                    size={25}
                    name="delete"
                    padding={30}
                />
            ),
        })
    })

    async function onSuccess() {
        try {
            setIsLoading(true)

            // Delete credentials Api
            let result = await delete_credential(data.credentialId);
            if (result.data.success) {
                deleteCredentialByCredId(data.credentialId);
                showMessage('ZADA Wallet', 'Credential is deleted successfully');
                props.navigation.goBack();
            } else {
                showMessage('ZADA Wallet', result.data.message);
            }

            setIsLoading(false)
        } catch (e) {
            console.log(e);
            setIsLoading(false)
        }
    }

    function onReject() { }

    async function showAlert() {
        showAskDialog("Are you sure?", "Are you sure you want to delete this certificate?", onSuccess, onReject);
    }

    function renderTitleInput(title, index) {
        let value = orderedValues[title];

        if (title == 'Issue Time') {
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
                        <Text style={{ color: BLACK_COLOR }}>{moment(value).format('DD/MM/YYYY HH:MM A')}</Text>
                    </View>
                </View>
            )
        } else {
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

    }

    return (
        <View style={[themeStyles.mainContainer]}>
            {
                isLoading &&
                <OverlayLoader
                    text='Deleting credential...'
                />
            }
            <View style={styles.container}>
                <View style={styles.CredentialsCardContainer}>
                    <CredentialsCard card_title={vaccineName} card_type={card_type} issuer={issuedBy} card_user="SAEED AHMAD" date={date} card_logo={imgURI} />
                </View>
            </View>


            <KeyboardAwareScrollView style={{
                maxHeight: '70%',
                marginTop: 16,
            }}>
                {
                    orderedValues != undefined && Object.keys(orderedValues).map((e, i) => {
                        console.log(e, orderedValues[e]);
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
    headerRightIcon: {
        padding: 10,
        color: BLACK_COLOR
    },
    container: {
        paddingTop: 0,
        paddingLeft: 5,
        paddingRight: 5,
    },
    CredentialsCardContainer: {
        paddingTop: 5
    },
});
