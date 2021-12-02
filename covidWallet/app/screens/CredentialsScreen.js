import { useFocusEffect, } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import CredentialsCard from '../components/CredentialsCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import moment from 'moment';
import useNetwork from '../hooks/useNetwork';
import { get_all_qr_credentials } from '../gateways/credentials';

function CredentialsScreen(props) {

  const { isConnected } = useNetwork();
  const [credentials, setCredentials] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const updateCredentialsList = async () => {
    try {
      // Getting item from asyncstorage
      let connections = await getItem(ConstantsList.CONNECTIONS);
      let credentials = await getItem(ConstantsList.CREDENTIALS);

      // Parsing JSON
      let connectionsList = JSON.parse(connections) || [];
      let credentialsList = JSON.parse(credentials) || [];

      // If arr is empty, return
      if (connectionsList.length === 0 || credentialsList.length === 0) {
        setCredentials([]);
        return
      }

      setCredentials(credentialsList);
    } catch (e) {
      console.log("UPDATING CREDENTIALS FAILED =>", e);
    }
  }

  const getAllCredential = async () => {
    try {
      setRefreshing(true);
      if (isConnected) {
        await get_all_qr_credentials();
        await updateCredentialsList();
      }
      else {
        await updateCredentialsList();
      }
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      console.log('FETCHING CREDENTIALS ERROR =>', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      updateCredentialsList();
    }, [])
  );

  const toggleModal = (v) => {
    props.navigation.navigate("DetailsScreen", {
      data: v
    });
  };

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Certificates" />
      {credentials.length > 0 ?
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={'#7e7e7e'}
              refreshing={refreshing}
              onRefresh={() => { getAllCredential() }}
            />
          }
          showsVerticalScrollIndicator={false}
          style={{
            flexGrow: 1,
          }}
          contentContainerStyle={{
            width: '100%',
          }}
        >
          {credentials.length > 0 && credentials.map((v, i) => {
            let imgURI = { uri: v.imageUrl };
            let vaccineName = v.name;
            let issuedBy = v.organizationName;
            let card_type = v.type;
            let issueDate = v.values['Issue Time'];
            let schemeId = v.values['schemaId'];

            let date = moment(issueDate).format('DD/MM/YYYY');

            return <TouchableOpacity key={i} onPress={() => toggleModal(v)} activeOpacity={0.9}>
              <View style={styles.CredentialsCardContainer}>
                <CredentialsCard schemeId={schemeId} card_title={vaccineName} card_type={card_type} issuer={issuedBy} card_user="SAEED AHMAD" date={date} card_logo={imgURI} />
              </View>
            </TouchableOpacity>
          })

          }
        </ScrollView>
        :

        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={'#7e7e7e'}
              refreshing={refreshing}
              onRefresh={() => { getAllCredential() }}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.EmptyContainer}
        >
          <TextComponent text="There are no certificates in your wallet. Once you receive a certificate, it will show up here." />
          <ImageBoxComponent source={require('../assets/images/credentialsempty.png')} />
        </ScrollView>
      }
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