import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet } from 'react-native';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import FlatCard from '../components/FlatCard';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalComponent from '../components/ModalComponent';
import { getItem, deleteActionByConnId, saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';

function ConnectionsScreen(props) {
  const [isConnection, setConnection] = useState(true);
  const [connectionsList, setConnectionsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      updateConnectionsList()
      return
    }, [isConnection])
  );

  const updateConnectionsList = () => {
    getItem(ConstantsList.CONNECTIONS).then((connections) => {
      if (connections != null) {
        let connectionsList = JSON.parse(connections)
        setConnectionsList(connectionsList)
        setConnection(true);
      } else {
        setConnection(false);
      }
    }).catch(e => { })
  }

  return (
    <View style={themeStyles.mainContainer}>
      {isConnection &&
        <View>
          <HeadingComponent text="Connections" />
          {
            connectionsList.map((v, i) => {
              let imgURI = { uri: v.org.img };
              let header = v.org.name;
              let subtitle = "The connection between you and " + header.toLowerCase() + " is secure and encrypted.";
              return <TouchableOpacity key={i} >
                <FlatCard image={imgURI} heading={header} text={subtitle} />
              </TouchableOpacity>
            })
          }
        </View>
      }
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