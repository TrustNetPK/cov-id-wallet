import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import {savePassCode, isFirstTime} from '../helpers/Storage';
import {PRIMARY_COLOR, GRAY_COLOR} from '../theme/Colors';
import HeadingComponent from '../components/HeadingComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorComponent from '../components/ErrorComponent';

function PassCodeContainer({navigation}) {
  const [firstPassCode, setFirstPassCode] = useState(0);
  const [secondPassCode, setSecondPassCode] = useState(0);
  const [heading, setHeading] = useState('Create a Passcode');
  const [btnText, setBtnText] = useState('Create');
  const [error, setError] = useState('');
  const [stage, setStage] = useState(0);

  storeData = async () => {
    try {
      await AsyncStorage.setItem('isfirstTime', 'false');
    } catch (error) {
      // Error saving data
    }
  };

  nextHandler = () => {
    setError('');
    if (stage == 0) {
      if (firstPassCode.length == undefined || firstPassCode.length < 6) {
        setError('Please enter a valid passcode.');
      } else {
        setStage(stage + 1);
        setHeading('Confirm the Passcode');
        setBtnText('Confirm');
      }
    } else if (stage == 1) {
      if (secondPassCode.length == undefined || secondPassCode.length < 6) {
        setError('Please enter a valid passcode.');
      } else {
        if (firstPassCode !== secondPassCode) {
          setError('Passcode does not match');
        } else {
          savePassCode(firstPassCode)
            .then(() => {
              setStage(stage + 1);
              navigation.navigate('NotifyMeScreen');
              storeData();
            })
            .catch(e => {
              setHeading('Error');
            });
        }
      }
    }
  };

  return (
    <View style={styles.title}>
      <HeadingComponent text={heading} />
      <View style={styles.codeWrapper}>
        <View style={styles.passcodeEnter}>
          {stage == 0 && (
            <TextInput
              secureTextEntry={true}
              style={styles.textBox}
              keyboardType="numeric"
              maxLength={6}
              caretHidden={true}
              autoFocus={true}
              onChangeText={firstPassCode => setFirstPassCode(firstPassCode)}
            />
          )}
          {stage == 1 && (
            <TextInput
              secureTextEntry={true}
              style={styles.textBox}
              keyboardType="numeric"
              maxLength={6}
              autoFocus={true}
              caretHidden={true}
              onChangeText={secondPassCode => setSecondPassCode(secondPassCode)}
            />
          )}
        </View>
        {stage == 0 && (
          <View style={styles.circleBlock}>
            <View
              style={[
                styles.circle,
                firstPassCode.length >= 1 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                firstPassCode.length >= 2 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                firstPassCode.length >= 3 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                firstPassCode.length >= 4 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                firstPassCode.length >= 5 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                firstPassCode.length >= 6 && styles.circleFill,
              ]}
            />
          </View>
        )}
        {stage == 1 && (
          <View style={styles.circleBlock}>
            <View
              style={[
                styles.circle,
                secondPassCode.length >= 1 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                secondPassCode.length >= 2 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                secondPassCode.length >= 3 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                secondPassCode.length >= 4 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                secondPassCode.length >= 5 && styles.circleFill,
              ]}
            />
            <View
              style={[
                styles.circle,
                secondPassCode.length >= 6 && styles.circleFill,
              ]}
            />
          </View>
        )}
        {error.length > 0 ? <ErrorComponent text={error} /> : null}
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton text={btnText} nextHandler={nextHandler} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  heading: {
    fontSize: 25,
  },
  passcodeEnter: {
    opacity: 0,
    position: 'absolute',
    width: 200,
    zIndex: 9,
  },
  textBox: {
    fontSize: 30,
    marginTop: 20,
    letterSpacing: 15,
    textAlign: 'center',
  },
  circleBlock: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '15%',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: 30,
    borderWidth: 3,
    borderColor: GRAY_COLOR,
    height: 25,
    marginLeft: 12,
    marginRight: 12,
    width: 25,
  },
  circleFill: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: GRAY_COLOR,
    height: 25,
    marginLeft: 12,
    marginRight: 12,
    width: 25,
  },

  buttonContainer: {
    marginTop: '15%',
  },
});

export default PassCodeContainer;
