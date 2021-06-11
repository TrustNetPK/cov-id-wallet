import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Modal from 'react-native-modal';
import {
  WHITE_COLOR,
  GRAY_COLOR,
  BLACK_COLOR,
  BACKGROUND_COLOR,
} from '../theme/Colors';
import HeadingComponent from './HeadingComponent';
import {ScrollView} from 'react-native-gesture-handler';
import CredentialsCard from './CredentialsCard';
import BorderButton from './BorderButton';

const card_logo = require('../assets/images/visa.jpg');
const close_img = require('../assets/images/close.png');

function ConfirmationDialog(props) {
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

  return (
    <View>
      <Modal
        hideModalContentWhileAnimating={true}
        useNativeDriver={false}
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
          <View>
            <Text style={styles.TextGuide}>
              <Text style={{fontWeight: 'bold'}}>
                {props.data.organizationName}
              </Text>
              {props.text}
            </Text>
          </View>

          <View style={styles.buttonsRow}>
            {props.modalType === 'action' && (
              <BorderButton
                nextHandler={props.rejectModal}
                text="REJECT"
                color={BLACK_COLOR}
                backgroundColor={WHITE_COLOR}
                isIconVisible={false}
              />
            )}
            {props.modalType === 'action' && (
              <BorderButton
                nextHandler={props.acceptModal}
                text="ACCEPT"
                color={BLACK_COLOR}
                backgroundColor={WHITE_COLOR}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ConfirmationDialog;
