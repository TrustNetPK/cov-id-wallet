import moment from 'moment';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal';
import { BACKGROUND_COLOR, BLACK_COLOR, GRAY_COLOR, GREEN_COLOR, WHITE_COLOR } from '../theme/Colors';
import SimpleButton from './Buttons/SimpleButton';
import HeadingComponent from './HeadingComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import LottieView from 'lottie-react-native';
const CredValuesModal = ({ isVisible, heading, values, onVerifyPress, onCloseClick, isScanning }) => {

    function renderTitleInput(title, index) {
        let value = values[title];

        if (title == 'Issue Time') {
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
        }
        else {
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
        <Modal
            animationIn='slideInLeft'
            animationOut='slideOutRight'
            isVisible={isVisible}
            onBackButtonPress={onCloseClick}
            onBackdropPress={onCloseClick}
        >
            <View style={styles._mainContainer}>
                <HeadingComponent
                    text={heading}
                />
                {
                    isScanning ? (
                        <LottieView
                            source={require('../assets/animation/cred_scanning_2.json')}
                            autoPlay
                            loop
                            style={{
                                width: 200,
                                height: 200,
                            }}
                        />
                    ) : (
                        <KeyboardAwareScrollView
                            style={{
                                width: '100%',
                                maxHeight: 250,
                            }}
                            contentContainerStyle={{
                                paddingBottom: '10%'
                            }}>
                            {
                                values != undefined && Object.keys(values).map((e, i) => {
                                    return (
                                        renderTitleInput(e, i)
                                    )
                                })
                            }
                        </KeyboardAwareScrollView>
                    )
                }

                {
                    isScanning ? (
                        <SimpleButton
                            title='CLOSE'
                            titleColor='white'
                            buttonColor={GRAY_COLOR}
                            onPress={onCloseClick}
                            width={250}
                            style={{
                                marginTop: 20,
                                borderWidth: 0,
                            }}
                        />
                    ) : (
                        <SimpleButton
                            title='VERIFY'
                            titleColor='white'
                            buttonColor={GREEN_COLOR}
                            onPress={onVerifyPress}
                            width={250}
                            style={{
                                marginTop: 20,
                            }}
                        />
                    )
                }

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    _mainContainer: {
        borderRadius: 10,
        backgroundColor: BACKGROUND_COLOR,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
});

export default CredValuesModal;