import { useFocusEffect } from '@react-navigation/native';
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
import { getItem, deleteActionByConnId, saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';

const card_logo = require('../assets/images/visa.jpg')
const refresh_img = require('../assets/images/refresh.png')

function CredentialsScreen(props) {
  const [isCredential, setCredential] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [credentials, setCredentialList] = useState();
  const [modalData, setModalData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      updateCredentialsList()
      return
    }, [isCredential])
  );

  const updateCredentialsList = () => {
    getItem(ConstantsList.CREDENTIALS).then((connections) => {
      if (connections != null) {
        let connectionsList = JSON.parse(connections);
        if (connectionsList.length === 0) {
          setCredential(false);
        }
        else {
          setCredential(true);
          setCredentialList(connectionsList);
        }



      } else {
        setCredential(false);
      }
    }).catch(e => { })
  }


  const toggleModal = (v) => {
    setModalData(v)
    setModalVisible(!isModalVisible);
  };

  const dismissModal = (v) => {
    setCredential(false);
    setModalVisible(false);
  };

  const loadCreds = async () => {
    //add load from server
    //fetch wallet credentials
    let walletName = await getItem(ConstantsList.WALLET_NAME);
    let walletSecret = await getItem(ConstantsList.WALLET_SECRET);
    await fetch(ConstantsList.BASE_URL + `/credentials`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': ConstantsList.API_SECRET,
          'Content-Type': 'application/json; charset=utf-8',
          'Server': 'Python/3.6 aiohttp/3.6.2',
          'wallet-name': walletName,
          'wallet-key': walletSecret
        }
      }).then(credsResult =>
        credsResult.json().then(data => {
          let arr = [];
          try {
            arr = data.results;
            if (arr.length === 0) {
              setCredential(false);
            }
            else {
              saveItem(ConstantsList.CREDENTIALS, JSON.stringify(arr)).then(() => {
                setCredential(true);
              })
            }

          }
          catch{
            arr = [];
          }
          console.log(arr.length === 0);

        }));

  };

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Certificates" />
      {isCredential &&
        <View>
          <ModalComponent credentials={false} data={modalData} isVisible={isModalVisible} toggleModal={toggleModal} dismissModal={dismissModal} />
          {credentials !== undefined && credentials.map((v, i) => {
            let imgURI = { uri: v.attrs.vaccinator_org_logo };
            let vaccineName = v.attrs.vacName;
            let issuedBy = v.attrs.vaccinator_org;


            return <TouchableOpacity onPress={() => toggleModal(v.attrs)}>
              <View style={styles.CredentialsCardContainer}>
                <CredentialsCard card_title={vaccineName} card_type="Digital Certificate" issuer={issuedBy} card_user="SAEED AHMAD" date="05/09/2020" card_logo={imgURI} />
              </View>
            </TouchableOpacity>
          })

          }
        </View>}
      {!isCredential &&
        <View style={styles.EmptyContainer}>
          <TextComponent text="There are no certificates in your wallet. Once you receive a certificate, it will show up here." />
          <ImageBoxComponent source={require('../assets/images/credentialsempty.png')} />
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