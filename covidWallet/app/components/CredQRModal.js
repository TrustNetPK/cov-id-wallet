import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import {BACKGROUND_COLOR, GREEN_COLOR} from '../theme/Colors';
import SimpleButton from './Buttons/SimpleButton';
import HeadingComponent from './HeadingComponent';
import QRCode from 'react-native-qrcode-svg';

const CredQRModal = ({isVisible, onCloseClick, qrCode}) => {
  let values = JSON.parse(qrCode);
  values = {...values, issuer: 'zada'};
  values = JSON.stringify(values);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCloseClick}
      onBackButtonPress={onCloseClick}>
      <View style={styles._qrContainer}>
        <HeadingComponent text={`Scan to verify`} />

        <QRCode
          value={values}
          backgroundColor={BACKGROUND_COLOR}
          size={Dimensions.get('window').width * 0.7}
          ecl="L"
        />

        <SimpleButton
          onPress={onCloseClick}
          title="Close"
          titleColor="white"
          buttonColor={GREEN_COLOR}
          style={{
            marginTop: 20,
          }}
          width={250}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  _qrContainer: {
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CredQRModal;
