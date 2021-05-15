import React, { useState, useEffect } from 'react';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacityBase, Alert,ImageBackground } from 'react-native';
import FlatCard from '../components/FlatCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalComponent from '../components/ModalComponent';
import { getItem, deleteActionByConnId, saveItem } from '../helpers/Storage';
import { authenticate } from '../helpers/Authenticate';
import ConstantsList from '../helpers/ConfigApp';
import { ScrollView } from 'react-native-gesture-handler';
import BorderButton from '../components/BorderButton';
const image = require('../assets/images/visa.jpg')

function ActionsScreen({navigation}) {
  const [isAction, setAction] = useState(true);
  const [isModalVisible, setModalVisible] = useState(true);
  const [actionsList, setActionsList] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      updateActionsList()
      return
    }, [isAction])
  );

  const updateActionsList = () => {
    getItem(ConstantsList.CERT_REQ).then((actions) => {
      if (actions != null) {
        let credActionsList = JSON.parse(actions)
        return credActionsList
      }
    }).then(credlist => {
      var finalObj = []
      if (credlist != undefined) {
        finalObj = finalObj.concat(credlist);
      }
      getItem(ConstantsList.PROOF_REQ).then((actions2) => {
        if (actions2 != null) {
          let proofActionsList = JSON.parse(actions2)
          finalObj = finalObj.concat(proofActionsList);
        }

        if (finalObj.length > 0) {
          setActionsList(finalObj);
          setAction(true);
        } else {
          setAction(false);
        }
      })

    })
      .catch(e => { })
  }

  const toggleModal = (v) => {
    setSelectedItem(JSON.stringify(v))
    setModalData(v.data);
    setModalVisible(true);
  };

  const acceptModal = async (v) => {
    let selectedItemObj = JSON.parse(selectedItem);
    //Move item to connection screen
    let conns = [];
    let data = await getItem(ConstantsList.CONNECTIONS);
    if (data == null) {
      conns = conns.concat(selectedItemObj);
    }
    else {
      try {
        conns = JSON.parse(data);
        conns = conns.concat(selectedItemObj);
      }
      catch (e) {
        conns = [];
      }
    }
    await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(conns));

    let authResult = await authenticate();
    if (authResult == true) {
      //fetch wallet credentials
      let walletName = await getItem(ConstantsList.WALLET_NAME);
      let walletSecret = await getItem(ConstantsList.WALLET_SECRET);

      //make API call
      await fetch(ConstantsList.BASE_URL + `/connections/receive-invitation`,
        {
          method: 'POST',
          headers: {
            'X-API-Key': ConstantsList.API_SECRET,
            'Content-Type': 'application/json; charset=utf-8',
            'Server': 'Python/3.6 aiohttp/3.6.2',
            'wallet-name': walletName,
            'wallet-key': walletSecret
          },
          body: JSON.stringify(selectedItemObj.invitation.invitation)
        }).then(inviteResult =>
          inviteResult.json().then(data => {
            // console.log(data)
          }));
      //Remove item from actions
      setModalVisible(false);
      deleteActionByConnId(selectedItemObj.type, selectedItemObj.invitation.connection_id).then((actions) => {
        updateActionsList();
      });
    }
    else {
      // do nothing
      setModalVisible(false);
    }

  }

  const rejectModal = (v) => {
    let selectedItemObj = JSON.parse(selectedItem);
    setModalVisible(false);
    deleteActionByConnId(selectedItemObj.type, selectedItemObj.invitation.connection_id).then((actions) => {
      updateActionsList();
    });

  }

  const dismissModal = (v) => {
    setModalVisible(false);
  };

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Actions" />
      {isAction &&
        <View>
          <ScrollView showsVerticalScrollIndicator={true}>
            <ModalComponent data={modalData} isVisible={isModalVisible} toggleModal={toggleModal} rejectModal={rejectModal} dismissModal={dismissModal} acceptModal={acceptModal} modalType="action" />
            {
              actionsList !== undefined && actionsList.map((v, i) => {
                let header = String(v.type === "connection_credential" ? "Digital Certificate Request" : "Digital Proof Request");
                let subtitle = "Click to view the " + header.toLowerCase() + " from " + v.org.name;
                let imgURI = { uri: v.org.img };
                return <TouchableOpacity key={i} onPress={() => toggleModal(v)}>
                  <FlatCard image={imgURI} heading={header} text={subtitle} />
                </TouchableOpacity>
              })
            }
          </ScrollView>
        </View>
      }
      {!isAction &&
        <View style={styles.EmptyContainer}>
          <TextComponent text="There are no actions to complete, Please scan a QR code to either get a digital certificate or to prove it." />
          <ImageBoxComponent source={require('../assets/images/action.png')} />
          <TouchableOpacity activeOpacity={0.9} onPress={() => {
                          navigation.navigate('QRScreen');
                        }}>
                          <BorderButton text="QR CODE"/>
          </TouchableOpacity>
          
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  EmptyContainer: {
    flex:1,
    alignItems: 'center'
  },
  bottom: {
    width: 50, height: 50
  },
  imageProps:{
     
  }
});

export default ActionsScreen;