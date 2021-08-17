import { useFocusEffect, } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import CredentialsCard from '../components/CredentialsCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
//import useCredentials from '../hooks/useCredentials';
import { getItem, saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import { get_all_connections } from '../gateways/connections';
import { get_all_credentials } from '../gateways/credentials';
import { addVerificationToActionList } from '../helpers/ActionList';
import { showMessage } from '../helpers/Toast';

function CredentialsScreen(props) {

  const [isCredential, setCredential] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Credentials hook
  //const { credentials } = useCredentials(isCredential);

  // Function to fetch connection and credentials
  const _fetchingAppData = async () => {

    setRefreshing(true);

    // Fetching Connections
    const connResponse = await get_all_connections();
    if(connResponse.data.success){
      let connections = connResponse.data.connections;
      if(connections.length)
        await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(connections));
      else
        await saveItem(ConstantsList.CONNECTIONS, JSON.stringify([]));

      console.log("CONNECTIONS SAVED");

      // Fetching Credentials
      const credResponse = await get_all_credentials();

      if(credResponse.data.success){
        let credentials = credResponse.data.credentials;
        let CredArr = [];
        if(credentials.length && connections.length){
          // Looping to update credentials object in crendentials array
          credentials.forEach((cred, i) => {
            let item = connections.find(c => c.connectionId == cred.connectionId)

            if(item !== undefined || null){
              let obj = {
                ...cred,
                imageUrl: item.imageUrl,
                organizationName: item.name,
                type: (cred.values != undefined && cred.values.type != undefined) ? cred.values.type :
                  (
                    (cred.values != undefined || cred.values != null) &&
                    cred.values["Vaccine Name"] != undefined &&
                    cred.values["Vaccine Name"].length != 0 &&
                    cred.values["Dose"] != undefined &&
                    cred.values["Dose"].length != 0
                ) ?
                'COVIDpass (Vaccination)' :
                "Digital Certificate",
              };
              CredArr.push(obj);
            }
          });
          await saveItem(ConstantsList.CREDENTIALS, JSON.stringify(CredArr));
        }
        else
          await saveItem(ConstantsList.CREDENTIALS, JSON.stringify([]));

        console.log("CREDENTIALS SAVED");

        await addVerificationToActionList();
      }
      else{
        showMessage('Zada Wallet', connResponse.data.error);
      }
    }
    else{
      showMessage('ZADA Wallet', connResponse.data.error);
    }

    setRefreshing(false);

  }

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

        console.log("UPDATING CREDENTIAL ARR => ", credentialsList);
        setCredentials(credentialsList);
    } catch (e) {
        console.log('error: updateCredentialList => ', e)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      updateCredentialsList();
    }, [])
  );

  // useEffect(() => {
  //   if (isCredential) {
  //     setCredential(false);
  //   }
  // }, [isCredential])

  const toggleModal = (v) => {
    props.navigation.navigate("DetailsScreen", {
      data: v
    });
  };

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Certificates" />
      { credentials.length > 1 &&
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
      {
        credentials.length < 1 &&
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_fetchingAppData}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.EmptyContainer}
        >
          <TextComponent text="There are no certificates in your wallet. Once you receive a certificate, it will show up here." />
          <ImageBoxComponent source={require('../assets/images/credentialsempty.png')} />
        </ScrollView>
      }

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