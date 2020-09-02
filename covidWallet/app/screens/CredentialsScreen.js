
import React, { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton'
import { View, Text, StyleSheet, Image, ImageComponent } from 'react-native';
import CredentialsCard from '../components/CredentialsCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import ModalComponent from '../components/ModalComponent'
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const card_logo = require('../assets/images/visa.jpg')
const refresh_img = require('../assets/images/refresh.png')

function CredentialsScreen(props) {
  const [isCredential, setCredential] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const data = [
    { name: 'First Name', value: 'John' },
    { name: 'Last Name', value: 'Doe' },
    { name: 'Birthday', value: '01-01-1990' },
    { name: 'Locality', value: 'Helisinki' },
    { name: 'Address', value: 'Khaleefa Heights, Champs Elysee' },
    { name: 'Country Name', value: 'Finland' },
  ]

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const dismissModal = (v) => {
    setModalVisible(false);
  };

  const loadCreds = () => {
    //add load all credentials logic here
    console.log("it works");
  };

  return (
    <View style={themeStyles.mainContainer}>
      {isCredential &&
        <View>
          <HeadingComponent text="Credentials" />
          <ModalComponent credentials={true} data={data} isVisible={isModalVisible} toggleModal={toggleModal} dismissModal={dismissModal} />
          <TouchableOpacity onPress={() => toggleModal()}>
            <View style={styles.CredentialsCardContainer}>
              <CredentialsCard card_title="COVID-19 (SARS-CoV-2)" card_type="Digital Certificate" issuer="Agha Khan Hospital" card_user="SAEED AHMAD" date="05/09/2020" card_logo={card_logo} />
            </View>
          </TouchableOpacity>
        </View>}
      {!isCredential &&
        <View style={styles.EmptyContainer}>
          <ImageBoxComponent source={require('../assets/images/credentialsempty.png')} />
          <TextComponent text="There are no certificates in your wallet. Once you receive a certificate, it will show up here." />

        </View>}

      <View style={{
        position: 'absolute',
        bottom: '5%', right: '5%', alignItems: 'center', justifyContent: 'center'
      }}>
        <TouchableOpacity activeOpacity={.5} onPress={loadCreds}>
          <Image source={refresh_img} style={styles.refreshButton} />
        </TouchableOpacity>
      </View>
    </View >
  );
}


const styles = StyleSheet.create({
  EmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  CredentialsCardContainer: {
    paddingTop: 5
  },
  refreshButton: {
    width: 60,
    height: 60,
    resizeMode: 'contain'
  },
});

export default CredentialsScreen;