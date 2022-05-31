import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import {
    WHITE_COLOR,
    GRAY_COLOR,
    BLACK_COLOR,
    BACKGROUND_COLOR,
    GREEN_COLOR,
    RED_COLOR,
} from '../../theme/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import BorderButton from '../BorderButton';
import { CONNLESS_VER_REQ, VER_REQ, ZADA_AUTH_TEST } from '../../helpers/ConfigApp';
import { showMessage } from '../../helpers/Toast';
import { get_all_credentials_connectionless_verification, get_all_credentials_for_verification } from '../../gateways/verifications';
import { getActionText } from '../../helpers/ActionList';
import CustomAccordian from './components/CustomAccordian';
import { get_tenant } from '../../gateways/connections';
import RenderValues from '../RenderValues';

function ActionDialog(props) {

    //States
    const [visible, setVisible] = useState(props.isVisible);
    const [spinner, setSpinner] = useState(false);
    const [values, setValues] = useState(null);
    const [credential, setCredential] = useState([]);
    const [selectedCred, setSelectedCred] = useState(null);
    const [policyName, setPolicyName] = useState(null);
    const [tenant, setTenant] = useState({});
    const [counter, setCounter] = useState(0);

    // Sorting Values in alphabetical order
    function orderValues(values) {
        let orderedValues = undefined;
        orderedValues = Object.keys(values).sort().reduce(
            (obj, key) => {
                obj[key] = values[key];
                return obj;
            },
            {}
        );
        return orderedValues;
    }

    async function getAllCredForVeri() {
        try {
            setSpinner(true);
            let result = []
            if (props.data.type == CONNLESS_VER_REQ) {
                result = await get_all_credentials_connectionless_verification(props.data.metadata);
            } else {
                result = await get_all_credentials_for_verification(props.data.verificationId);
            }
            if (result.data.success) {
                let val = result.data.availableCredentials[0].availableCredentials[0] ? result.data.availableCredentials[0].availableCredentials[0].values : null;
                let polName = result.data.availableCredentials[0] ? result.data.availableCredentials[0].policyName : null;
                let cred = result.data.availableCredentials[0].availableCredentials ? result.data.availableCredentials[0].availableCredentials : [];

                let fullyVaccinatedCreds = [];
                cred.forEach(credItem => {
                    if (credItem.values != undefined && credItem.values.Dose != null && credItem.values.Dose != undefined) {
                        if (credItem.values.Dose == '2/2') {
                            fullyVaccinatedCreds.push(credItem);
                        }
                    }
                });

                if (fullyVaccinatedCreds.length) {
                    setCredential(fullyVaccinatedCreds);
                }
                else {
                    setCredential(cred);
                    setPolicyName(polName);
                }
                setValues(val != null ? orderValues(val) : null);
            } else {
                showMessage('ZADA Wallet', result.data.error);
            }

            if (props.data.organizationName == ZADA_AUTH_TEST) {
                const tenant = await get_tenant(props.data);
                if (tenant.success) {
                    setTenant(tenant.data);
                    setCounter(Math.random() * 9999);
                }
                else {
                    console.log(tenant.error);
                }
            }

            setSpinner(false)
        } catch (e) {
            console.log(e)
            setSpinner(false)
        }
    }

    useLayoutEffect(() => {
        if (props.data.type == VER_REQ || props.data.type == CONNLESS_VER_REQ) {
            getAllCredForVeri();
        } else {
            setValues(props.data.hasOwnProperty('values') ? orderValues(props.data.values) : {})
        }
    }, [props.data])

    function acceptHandler() {

        let val = values;

        // If no certificate is selected.
        if ((props.data.type == VER_REQ || props.data.type == CONNLESS_VER_REQ) && (selectedCred == null || val == null)) {
            alert('Please select a certificate');
            return
        }

        if (props.data.type == VER_REQ && props.data.organizationName == ZADA_AUTH_TEST) {
            props.data.full_name = selectedCred.values != undefined && selectedCred.values['Full Name'] != undefined ? selectedCred.values['Full Name'] : '';
        }

        // If value is empty
        if (val == undefined) return
        if (props.data.type == VER_REQ ||  props.data.type == CONNLESS_VER_REQ) {
            val = selectedCred;
            props.data.credentialId = selectedCred.credentialId;
            props.data.policyName = policyName
        }

        //Adding type.
        val.type = props.data.type;
        props.acceptModal(props.data);
    }

    function dismiss() {
        setVisible(false);
        setTimeout(() => {
            setValues({});
            props.dismissModal()
        }, 500);

    }

    useEffect(() => {
        setCounter((counter) => counter + 1)
    }, [selectedCred])

    function setSelected(e) {
        setSelectedCred(e);
    }

    return (
        <View>
            <Modal
                hideModalContentWhileAnimating={true}
                useNativeDriver={true}
                onBackdropPress={dismiss}
                onRequestClose={dismiss}
                isVisible={visible}
                animationIn={'slideInLeft'}
                animationOut={'slideOutRight'}
            >
                <View style={[styles.ModalChildContainer, { backgroundColor: props.data.organizationName == ZADA_AUTH_TEST ? BACKGROUND_COLOR : WHITE_COLOR }]}>
                    {
                        props.data.organizationName == ZADA_AUTH_TEST ? (
                            spinner ? (
                                <View style={{
                                    zIndex: 10, justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <ActivityIndicator color={"#000"} size={"small"} style={{ marginHorizontal: 20, marginTop: 20, }} />
                                    <Text style={{ marginTop: 5, marginBottom: 20, fontSize: 16, }}>Fetching details...</Text>
                                </View>
                            ) : (
                                <>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            alignContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Image
                                            style={styles.Imagesize}
                                            source={{
                                                uri: tenant.imgUrl
                                            }}
                                        />
                                    </View>
                                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                                        <Text style={styles.TextGuide}>
                                            <Text style={{ fontWeight: 'bold' }}>
                                                {tenant.name}
                                            </Text>
                                            {getActionText(ZADA_AUTH_TEST)}
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={styles.TextGuide}>
                                            {'Authorize to approve the request'}
                                        </Text>
                                        <Text style={[styles.TextGuide, { marginTop: 0, }]}>
                                            {'Cancel to reject the request'}
                                        </Text>
                                    </View>

                                    <KeyboardAwareScrollView
                                        style={{
                                            maxHeight: 250,
                                        }}
                                    >
                                        {
                                            props.data.type == VER_REQ && credential.length ?
                                                (
                                                    <CustomAccordian credential={credential} setSelected={setSelected} />
                                                ) : (
                                                    <Text style={{ color: 'red', fontSize: 14, width: '70%', textAlign: 'center', alignSelf: 'center', fontFamily: 'Poppins-Regular' }}>Oops! You don't have any certificate to verify request</Text>
                                                )
                                        }
                                    </KeyboardAwareScrollView>

                                    <View style={styles.buttonsRow}>
                                        {props.modalType === 'action' && (
                                            <BorderButton
                                                nextHandler={props.rejectModal}
                                                text="CANCEL"
                                                color={BLACK_COLOR}
                                                textColor={WHITE_COLOR}
                                                backgroundColor={RED_COLOR}
                                                isIconVisible={false}
                                            />
                                        )}
                                        {props.modalType === 'action' && (
                                            <BorderButton
                                                nextHandler={acceptHandler}
                                                text="AUTHORIZE"
                                                color={BLACK_COLOR}
                                                textColor={WHITE_COLOR}
                                                backgroundColor={GREEN_COLOR}
                                            />
                                        )}
                                    </View>
                                </>
                            )
                        ) : (
                            <>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Image
                                        style={styles.Imagesize}
                                        source={props.data.type == CONNLESS_VER_REQ ? props.data.imageUrl : {
                                            uri: props.data.imageUrl
                                        }}
                                    />
                                </View>
                                <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Text style={styles.TextGuide}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {props.data.organizationName}
                                        </Text>
                                        {getActionText(props.data.organizationName == ZADA_AUTH_TEST ? ZADA_AUTH_TEST : props.data.type)}
                                    </Text>
                                </View>

                                {
                                    props.data.type == VER_REQ &&
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={styles.TextGuide}>
                                            {'Select a certificate to share data.'}
                                        </Text>
                                        <Text style={[styles.TextGuide, { marginTop: 0, }]}>
                                            {'Accept to approve this request.'}
                                        </Text>
                                    </View>
                                }

                                <KeyboardAwareScrollView
                                    style={{
                                        maxHeight: 250,
                                    }}
                                >
                                    {
                                        spinner ? (
                                            <View style={{
                                                zIndex: 10, justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                                <ActivityIndicator color={"#000"} size={"small"} />
                                            </View>
                                        ) : (
                                            (props.data.type == VER_REQ || props.data.type == CONNLESS_VER_REQ) && credential.length ?
                                                (
                                                    <CustomAccordian credential={credential} setSelected={setSelected} />
                                                ) : (
                                                    values != undefined && Object.keys(values).length > 0 ? (
                                                        <RenderValues
                                                            values={values}
                                                            inputBackground={BACKGROUND_COLOR}
                                                            inputTextColor={BLACK_COLOR}
                                                            labelColor={BLACK_COLOR}
                                                            listStyle={{ flexGrow: 1 }}
                                                            listContainerStyle={{
                                                                flexGrow: 1,
                                                                paddingHorizontal: 15,
                                                            }}
                                                        />
                                                    ) : (
                                                        null
                                                    )
                                                )
                                        )
                                    }
                                </KeyboardAwareScrollView>

                                <View style={styles.buttonsRow}>
                                    {props.modalType === 'action' && (
                                        <BorderButton
                                            nextHandler={props.rejectModal}
                                            text="REJECT"
                                            color={BLACK_COLOR}
                                            textColor={WHITE_COLOR}
                                            backgroundColor={RED_COLOR}
                                            isIconVisible={false}
                                        />
                                    )}
                                    {props.modalType === 'action' && (
                                        <BorderButton
                                            nextHandler={acceptHandler}
                                            text="ACCEPT"
                                            color={BLACK_COLOR}
                                            textColor={WHITE_COLOR}
                                            backgroundColor={GREEN_COLOR}
                                        />
                                    )}
                                </View>
                            </>
                        )
                    }
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        marginLeft: 80,
        marginRight: 80,
    },
    ModalChildContainer: {
        borderRadius: 15,
        marginTop: '10%',
        marginBottom: '2%',
    },
    centerContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    modalValues: {
        color: GRAY_COLOR,
        fontSize: 18,
        marginBottom: '2%',
    },
    modalTitles: {
        marginTop: '2%',
    },
    horizontalRule: {
        borderBottomColor: GRAY_COLOR,
        borderBottomWidth: 1,
    },
    modalValuesContainer: {
        width: '97%',
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    centerContainer: {
        alignItems: 'center',
    },
    TextGuide: {
        color: 'black',
        marginTop: 10,
        fontSize: 16,
        paddingLeft: 16,
        paddingRight: 16,
        fontFamily: 'Poppins-Regular',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    buttonsRow: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 16,
    },
    Imagesize: {
        height: 65,
        width: 65,
        marginTop: 20,
        resizeMode: 'contain',
    },
});

export default ActionDialog;
