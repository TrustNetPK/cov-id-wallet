
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageComponent } from 'react-native';
import CredentialsCard from '../components/CredentialsCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';

const card_logo = require('../assets/images/visa.jpg')

function CredentialsScreen(props) {
  const [isCredential, setCredential] = useState(true);

  return (
    <View style={themeStyles.mainContainer}>
      {isCredential &&
        <View>
          <HeadingComponent text="Credentials" />
          <CredentialsCard card_title="COVID-19 (SARS-CoV-2)" card_type="Digital Certificate" issuer="Agha Khan Hospital" card_user="SAEED AHMAD" date="05/09/2020" card_logo={card_logo} />
        </View>}
      {!isCredential &&
        <View style={styles.EmptyContainer}>
          <ImageBoxComponent source={require('../assets/images/credentialsempty.png')} />
          <TextComponent text="There are no certificates in your wallet. Once you receive a certificate, it will show up here." />
        </View>}
    </View>
  );
}


const styles = StyleSheet.create({
  EmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CredentialsScreen;