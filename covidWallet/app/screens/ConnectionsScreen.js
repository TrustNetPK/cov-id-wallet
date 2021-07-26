import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Platform, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import FlatCard from '../components/FlatCard';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalComponent from '../components/ModalComponent';
import { getItem, deleteActionByConnId, saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import { get_all_connections } from '../gateways/connections';
import { showMessage } from '../helpers/Toast';
import { addVerificationToActionList } from '../helpers/ActionList';

function ConnectionsScreen(props) {
  const [isConnection, setConnection] = useState(true);
  const [connectionsList, setConnectionsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllConnections();
    addVerificationToActionList()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      updateConnectionsList();
      return;
    }, [isConnection]),
  );

  const updateConnectionsList = async () => {
    let connections = (JSON.parse(await getItem(ConstantsList.CONNECTIONS)) || []);
    if (connections.length > 0) {
      setConnectionsList(connections);
      setConnection(true);
    } else {
      setConnection(false);
    }
  };

  const getAllConnections = async () => {
    setIsLoading(true);
    try {
      let result = await get_all_connections();
      if (result.data.success) {
        let connectionsList = result.data.connections;

        if (connectionsList.length > 0) {
          await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(connectionsList));
          updateConnectionsList()
        } else {
          setConnection(false);
        }
      } else {
        showMessage('ZADA Wallet', resp.message);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e)
    }

  }

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Connections" />
      {isLoading &&
        <View style={{ zIndex: 10, position: "absolute", left: 0, right: 0, bottom: 0, top: 0, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={"#000"} size={"large"} />
        </View>
      }
      {connectionsList.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingTop: 8, }}>
          {connectionsList.map((v, i) => {
            let imgURI = v.imageUrl;
            let header = v.name != undefined ? v.name : "";
            let subtitle =
              'The connection between you and ' +
              header.toLowerCase() +
              ' is secure and encrypted.';
            return (
              <View key={i}>
                <FlatCard onPress={() => { }} imageURL={imgURI} heading={header} text={subtitle} />
              </View>
            );
          })}
        </ScrollView>
      ) :
        (
          <View style={styles.EmptyContainer}>
            <TextComponent text="You have no connections yet." />
            <ImageBoxComponent
              source={require('../assets/images/connectionsempty.png')}
            />
          </View>
        )
      }
    </View >
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
