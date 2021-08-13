import { useFocusEffect, } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CredentialsCard from '../components/CredentialsCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useCredentials from '../hooks/useCredentials';

function CredentialsScreen(props) {

  const [isCredential, setCredential] = useState(false);

  // Credentials hook
  const { credentials } = useCredentials(isCredential);

  useFocusEffect(
    React.useCallback(() => {
      setCredential(true);
      return () => setCredential(false);
    }, [])
  );

  useEffect(() => {
    if (isCredential) {
      setCredential(false);
    }
  }, [isCredential])

  const toggleModal = (v) => {
    props.navigation.navigate("DetailsScreen", {
      data: v
    });
  };

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Certificates" />
      {credentials.length > 0 &&
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {/* <ModalComponent credentials={false} data={modalData} isVisible={isModalVisible} toggleModal={toggleModal} dismissModal={dismissModal} /> */}
          {credentials.length > 0 && credentials.map((v, i) => {
            let imgURI = { uri: v.imageUrl };
            let vaccineName = v.name;
            let issuedBy = v.organizationName;
            let card_type = v.type;


            return <TouchableOpacity key={i} onPress={() => toggleModal(v)} activeOpacity={0.9}>
              <View style={styles.CredentialsCardContainer}>
                <CredentialsCard card_title={vaccineName} card_type={card_type} issuer={issuedBy} card_user="SAEED AHMAD" date="05/09/2020" card_logo={imgURI} />
              </View>
            </TouchableOpacity>
          })

          }
        </ScrollView>}
      {credentials.length < 1 &&
        <View style={styles.EmptyContainer}>
          <TextComponent text="There are no certificates in your wallet. Once you receive a certificate, it will show up here." />
          <ImageBoxComponent source={require('../assets/images/credentialsempty.png')} />
        </View>}

      {/* <View style={{
        position: 'absolute',
        bottom: '5%', right: '5%', alignItems: 'center', justifyContent: 'center'
      }}>
        <TouchableOpacity activeOpacity={.5} onPress={() => setCredential(true)}>
          <Image source={refresh_img} style={styles.refreshButton} />
        </TouchableOpacity>
      </View> */}
    </View >
  );
}


const styles = StyleSheet.create({
  EmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  CredentialsCardContainer: {
    paddingTop: 5,
  },
  refreshButton: {
    width: 60,
    height: 60,
    resizeMode: 'contain'
  },
});

export default CredentialsScreen;