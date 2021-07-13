import React, { useRef } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Modal from 'react-native-modal';
import {
    WHITE_COLOR,
    GRAY_COLOR,
    BLACK_COLOR,
    BACKGROUND_COLOR,
    GREEN_COLOR,
    RED_COLOR,
    PRIMARY_COLOR,
} from '../theme/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import HeadingComponent from './HeadingComponent';
import { ScrollView } from 'react-native-gesture-handler';
import CredentialsCard from './CredentialsCard';
import { showMessage } from '../helpers/Toast';
import BorderButton from './BorderButton';

const card_logo = require('../assets/images/visa.jpg');
const close_img = require('../assets/images/close.png');

function CredConfirmationDialog(props) {

    function acceptHandler() {
        props.acceptModal();
    }

    function renderTitleInput(title, index) {
        let value = Object.values(props.data.values)[index];
        return (
            <View
                key={index}
                style={{
                    marginLeft: 16,
                    marginRight: 16,
                }}>
                <Text style={{ color: BLACK_COLOR, marginLeft: 8, marginBottom: 4, }}>{title}</Text>
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
                    <Text style={{ color: BLACK_COLOR }}>{value}</Text>
                </View>
            </View>
        )
    }

    return (
        <View>
            <Modal
                hideModalContentWhileAnimating={true}
                useNativeDriver={true}
                onBackdropPress={props.dismissModal}
                isVisible={props.isVisible}>
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
                            {props.text}
                        </Text>
                    </View>

                    <KeyboardAwareScrollView style={{
                        maxHeight: 300,
                    }}>
                        {
                            props.data.values != undefined && Object.keys(props.data.values).map((e, i) => {
                                return (
                                    renderTitleInput(e, i)
                                )
                            })
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
        marginBottom: 30,
    },
    Imagesize: {
        height: 50,
        width: 50,
        marginTop: 20,
        resizeMode: 'contain',
    },
});

export default CredConfirmationDialog;
