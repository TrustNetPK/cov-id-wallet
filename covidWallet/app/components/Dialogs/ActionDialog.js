import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, AlertIOS, Alert, StyleSheet, Image, ActivityIndicator, FlatList } from 'react-native';
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
import { CRED_OFFER, VER_REQ } from '../../helpers/ConfigApp';
import { showMessage } from '../../helpers/Toast';
import { get_all_credentials_for_verification } from '../../gateways/verifications';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { getActionText } from '../../helpers/ActionList';
import CustomAccordian from './components/CustomAccordian';
import RadioButton from './components/RadioButton';
import moment from 'moment';


function ActionDialog(props) {

    //States
    const [visible, setVisible] = useState(props.isVisible);
    const [spinner, setSpinner] = useState(false);
    const [values, setValues] = useState();
    const [credential, setCredential] = useState([]);
    const [selectedCred, setSelectedCred] = useState({});
    const [counter, setCounter] = useState(0);

    useLayoutEffect(() => {
        async function getAllCredForVeri() {
            try {
                setSpinner(true)
                let result = await get_all_credentials_for_verification(props.data.verificationId);
                if (result.data.success) {
                    let val = result.data.availableCredentials[0].availableCredentials[0].values
                    let cred = result.data.availableCredentials[0].availableCredentials;

                    setCredential(cred);
                    setValues(val);
                } else {
                    showMessage('ZADA Wallet', result.data.error);
                }

                setSpinner(false)
            } catch (e) {
                console.log(e)
                setSpinner(false)
            }
        }

        // If type = verification_request
        if (props.data.type == VER_REQ) {
            getAllCredForVeri();
        } else {
            setValues(props.data.hasOwnProperty('values') ? props.data.values : {})
        }

    }, [props.data])

    function acceptHandler() {
        console.log("selectedCred", selectedCred);

        let val = values

        // If value is empty
        if (val == undefined) return

        // If no certificate is selected.
        //Object.keys(selectedCred).length === 0
        if (props.data.type == VER_REQ && selectedCred == null) {
            alert('Please select a certificate');
            return
        }

        if (props.data.type == VER_REQ) {
            val = selectedCred;
        }

        //Adding type.
        val.type = props.data.type

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

    console.log(props.data);

    function renderTitleInput(title, index) {
        let value = Object.values(values)[index];
        return (
            <View
                key={index}
                style={{
                    marginLeft: 16,
                    marginRight: 16,
                    marginTop: 4,
                    marginBottom: 4,
                }}>
                <Text style={{ color: BLACK_COLOR, marginLeft: 8, marginBottom: 8, }}>{title}</Text>
                <View style={{
                    paddingLeft: 16,
                    paddingRight: 16,
                    backgroundColor: BACKGROUND_COLOR,
                    color: BLACK_COLOR,
                    height: 40,
                    marginBottom: 4,
                    borderRadius: 16,
                    justifyContent: "center"
                }}>
                    {
                        title == 'Issue Time' ? (
                            <Text style={{ color: BLACK_COLOR }}>{moment(value).format('DD/MM/YYYY HH:MM A')}</Text>
                        ):(
                            <Text style={{ color: BLACK_COLOR }}>{value}</Text>
                        )
                    }
                </View>
            </View>
        )
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
                <View style={styles.ModalChildContainer}>
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
                                uri: props.data.imageUrl,
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <Text style={styles.TextGuide}>
                            <Text style={{ fontWeight: 'bold' }}>
                                {props.data.organizationName}
                            </Text>
                            {getActionText(props.data.type)}
                        </Text>
                    </View>

                    {
                        props.data.type === VER_REQ &&
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.TextGuide}>
                                {'Select a certificate to share data.'}
                            </Text>
                            <Text style={[styles.TextGuide, { marginTop: 0, }]}>
                                {'Accept to approve this request.'}
                            </Text>
                        </View>
                    }
                    {/* {spinner &&
                        <View style={{
                            zIndex: 10, justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <ActivityIndicator color={"#000"} size={"small"} />
                        </View>
                    } 
                    {
                        <FlatList
                            data={credential}
                            extraData={counter}
                            keyExtractor={(item, index) => {
                                return index;
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <RadioButton isChecked={selectedCred == item} item={item} setSelected={setSelected}>
                                        <CustomAccordian item />
                                    </RadioButton>
                                )
                            }}
                        />
                    } */}
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
                                props.data.type == VER_REQ && credential.length ?
                                (
                                    <CustomAccordian credential={credential} setSelected={setSelected} />
                                ):(
                                    values != undefined && Object.keys(values).length > 1 && Object.keys(values).map((e, i) => {
                                        return renderTitleInput(e, i)
                                    })
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
        backgroundColor: WHITE_COLOR,
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
    ModalChildContainer: {
        backgroundColor: WHITE_COLOR,
        borderRadius: 15,
        marginTop: '10%',
        marginBottom: '2%',
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
