import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacityBase } from 'react-native';
import FlatCard from '../components/FlatCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalComponent from '../components/ModalComponent';
import { getCredentials } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import { ScrollView } from 'react-native-gesture-handler';
const image = require('../assets/images/visa.jpg')

function ActionsScreen(props) {
  const [isAction, setAction] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [actionsList, setActionsList] = useState([]);
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    getCredentials(ConstantsList.CERT_REQ).then((actions) => {
      if (actions == null) {
        setAction(false);
      }
      else {
        setActionsList(JSON.parse(actions));
        setAction(true);
      }
    }).catch(e => {

    })
  }, [actionsList]);

  const toggleModal = (v) => {
    setModalData(v);
    setModalVisible(!isModalVisible);
  };

  const dismissModal = (v) => {
    setModalVisible(false);
  };

  return (
    <View style={themeStyles.mainContainer}>
      {isAction &&
        <View>
          <HeadingComponent text="Actions" />
          <ModalComponent data={modalData} isVisible={isModalVisible} toggleModal={toggleModal} dismissModal={dismissModal} modalType="action" />
          {
            actionsList !== undefined && actionsList.map((v, i) => {
              let header = String(v.type === "connection_credential" ? "Vaccination Certificate Request" : "Vaccination Proof Request");
              let subtitle = "Click to view the " + header.toLowerCase() + " from " + v.org.name;
              let imgURI = { uri: v.org.img };
              return <TouchableOpacity key={i} onPress={() => toggleModal(v.data)}>
                <FlatCard image={imgURI} heading={header} text={subtitle} />
              </TouchableOpacity>
            })
          }
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