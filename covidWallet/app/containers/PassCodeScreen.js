import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { savePassCode } from '.././helpers/storage';
import { PRIMARY_COLOR, BLACK_COLOR } from '../constants/constants';

function PassCodeScreen({ navigation }) {
    const [firstPassCode, setFirstPassCode] = useState(0);
    const [secondPassCode, setSecondPassCode] = useState(0);
    const [heading, setHeading] = useState('Create a Passcode')
    const [error, setError] = useState('');
    const [stage, setStage] = useState(0);
  
    nextHandler = () => {
        setError('')
        if (stage == 0) {
            if (firstPassCode.length == undefined || firstPassCode.length < 6) {
                setError("please enter a valid passcode")
            }
            else {
                setStage(stage + 1)
                setHeading('Confirm the PassCode')
            }
        }
        else if (stage == 1) {
            if (secondPassCode.length == undefined || secondPassCode.length < 6) {
                setError("please enter a valid passcode")

            }

            else {
                if (firstPassCode !== secondPassCode) {
                    setError('passcodes dont match')
                }
                else {
                    savePassCode(firstPassCode).then(()=>{
                        setStage(stage + 1) 
                        setHeading('Success')
                    }).catch(e=>{
                        setHeading('Error')
                    })
                    } 
                }
            }

        else {
            navigation.navigate('MainScreen')
        }
    }

    onChangePassCode = () => {

    }
    return (

        <View style={styles.title}>
            <Text style={styles.heading}>{heading}</Text>
            <View style={styles.codeWrapper}>
                <View style={styles.passcodeEnter}>

                    {stage == 0 && <TextInput
                        secureTextEntry={true}
                        style={styles.textBox}
                        keyboardType='numeric'
                        maxLength={6}
                        caretHidden={true}
                        autoFocus={true}
                        onChangeText={(firstPassCode) => setFirstPassCode(firstPassCode)}
                    />}
                    {stage == 1 && <TextInput
                        secureTextEntry={true}
                        style={styles.textBox}
                        keyboardType='numeric'
                        maxLength={6}
                        caretHidden={true}
                        onChangeText={(secondPassCode) => setSecondPassCode(secondPassCode)}
                    />}

                </View>
                {stage == 0 && <View style={styles.circleBlock}>
                    <View style={[styles.circle, firstPassCode.length >= 1 && styles.circleFill]}></View>
                    <View style={[styles.circle, firstPassCode.length >= 2 && styles.circleFill]}></View>
                    <View style={[styles.circle, firstPassCode.length >= 3 && styles.circleFill]}></View>
                    <View style={[styles.circle, firstPassCode.length >= 4 && styles.circleFill]}></View>
                    <View style={[styles.circle, firstPassCode.length >= 5 && styles.circleFill]}></View>
                    <View style={[styles.circle, firstPassCode.length >= 6 && styles.circleFill]}></View>
                </View>}
                {stage == 1 && <View style={styles.circleBlock}>
                    <View style={[styles.circle, secondPassCode.length >= 1 && styles.circleFill]}></View>
                    <View style={[styles.circle, secondPassCode.length >= 2 && styles.circleFill]}></View>
                    <View style={[styles.circle, secondPassCode.length >= 3 && styles.circleFill]}></View>
                    <View style={[styles.circle, secondPassCode.length >= 4 && styles.circleFill]}></View>
                    <View style={[styles.circle, secondPassCode.length >= 5 && styles.circleFill]}></View>
                    <View style={[styles.circle, secondPassCode.length >= 6 && styles.circleFill]}></View>
                </View>}
                {error.length > 0 ? <Text>{error}</Text> : null}
            </View>
            <PrimaryButton title="Pass Code" nextHandler={nextHandler} />
        </View>);
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    codeWrapper: {
        position: 'relative'
    },
    heading: {
        fontSize: 25
    },
    passcodeEnter: {
        opacity: 0,
        position: 'absolute',
        width: '100%',
        zIndex: 9
    },
    textBox: {
        fontSize: 30,
        marginTop: 20,
        letterSpacing: 15,
        textAlign: 'center',
    },
    circleBlock: {
        borderBottomColor: BLACK_COLOR,
        borderBottomWidth: 3,
        display: 'flex',
        borderRadius: 1,
        marginTop: 50,
        borderStyle: 'dashed',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    circle: {
        height: 20,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        borderRadius: 20,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomColor: BLACK_COLOR,
        width: 20
    },
    circleFill: {
        backgroundColor: PRIMARY_COLOR,
        padding: 10,
        borderColor: PRIMARY_COLOR,
        height: 20,
        marginLeft: 15,
        marginRight: 15,
        width: 20
    }
});

export default PassCodeScreen;