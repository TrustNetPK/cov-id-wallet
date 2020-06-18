import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import FlatCard from '../components/FlatCard';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalComponent from '../components/ModalComponent';

const image = require('../assets/images/visa.jpg')

function ConnectionsScreen(props) {
  const [isConnection, setConnection] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const data = [
    { name: 'First Name', value: 'John' },
    { name: 'Last Name', value: 'Doe' },
    { name: 'Birthday', value: '01-01-1990' },
    { name: 'Locality', value: 'Helisinki' },
    { name: 'Address', value: 'Khaleefa Heights, Champs Elysee' },
    { name: 'Country Name', value: 'Finland' },
  ];

  const actions = [
    { heading: 'Connection Request', text: 'Tap to view the connection request from Agha Khan Hospital Karachi' },
    { heading: 'Vaccination Certificate', text: 'Tap to accept the immunity certificate from Agha Khan Hospital, Karachi' },
  ]

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={themeStyles.mainContainer}>
      {isConnection &&
        <View>
          <HeadingComponent text="Connections" />
          <ModalComponent data={data} isVisible={isModalVisible} toggleModal={toggleModal} />
         {
            actions.map((v, i) => {
              return  <TouchableOpacity key={i} onPress={() => toggleModal()}>
                        <FlatCard image={image} heading={v.heading} text={v.text} />
                      </TouchableOpacity>
            })
          }
        </View>}
      {!isConnection &&
        <View style={styles.EmptyContainer}>
          <ImageBoxComponent source={require('../assets/images/connectionsempty.png')} />
          <TextComponent text="Once you establish a connection, it will show up here. Go ahead and connect with someone." />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  EmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConnectionsScreen;