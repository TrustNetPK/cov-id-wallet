import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacityBase } from 'react-native';
import FlatCard from '../components/FlatCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalComponent from '../components/ModalComponent';

const image = require('../assets/images/visa.jpg')

function ActionsScreen(props) {
  const [isAction, setAction] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const data = [
    { name: 'First Name', value: 'Umer' },
    { name: 'Last Name', value: 'Shafiq' },
    { name: 'Birthday', value: '01-01-1990' },
    { name: 'Locality', value: 'Helisinki' },
    { name: 'Address', value: 'Khaleefa Heights, Champs Elysee' },
    { name: 'Country Name', value: 'Finland' },
  ]

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={themeStyles.mainContainer}>
      {isAction &&
        <View>
          <HeadingComponent text="Actions" />
          <ModalComponent data={data} isVisible={isModalVisible} toggleModal={toggleModal} />
          <TouchableOpacity onPress={() => toggleModal()}>
            <FlatCard image={image} heading="Connection Request" text="Tap to view the connection request from Agha Khan Hospital, Karachi" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleModal()}>
            <FlatCard image={image} heading="Vaccination Certificate" text="Tap to accept the immunity certificate from Agha Khan Hospital, Karachi" />
          </TouchableOpacity>
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