import React, { useState, useEffect } from 'react';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacityBase, Alert } from 'react-native';
import FlatCard from '../components/FlatCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalComponent from '../components/ModalComponent';
import { getItem, deleteActionByConnId, saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import { ScrollView } from 'react-native-gesture-handler';
const image = require('../assets/images/visa.jpg')

function ActionsScreen(props) {
  const [isAction, setAction] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
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

  const acceptModal = (v) => {
    let selectedItemObj = JSON.parse(selectedItem);
    //Move item to connection screen
    let conns = [];
    getItem(ConstantsList.CONNECTIONS).then((data) => {
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
      saveItem(ConstantsList.CONNECTIONS, JSON.stringify(conns));
    }
    );



    // Add accept logic here
    //=======================


    //=======================



    //Remove item from actions
    setModalVisible(false);
    deleteActionByConnId(selectedItemObj.type, selectedItemObj.invitation.connection_id).then((actions) => {
      updateActionsList();
    });
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
      {isAction &&
        <View>
          <ScrollView showsVerticalScrollIndicator={true}>
            <HeadingComponent text="Actions" />
            <ModalComponent data={modalData} isVisible={isModalVisible} toggleModal={toggleModal} rejectModal={rejectModal} dismissModal={dismissModal} acceptModal={acceptModal} modalType="action" />
            {
              actionsList !== undefined && actionsList.map((v, i) => {
                let header = String(v.type === "connection_credential" ? "Vaccination Certificate Request" : "Vaccination Proof Request");
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
          <ImageBoxComponent source={require('../assets/images/action.gif')} />
          <TextComponent text="There are no actions to complete, Please scan a QR code to either get a vaccination certificate or to prove it." />
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  EmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  Imagesize: {
    marginBottom: 50,
    height: 300,
    width: 300,
    resizeMode: 'contain'
  },
});

export default ActionsScreen;