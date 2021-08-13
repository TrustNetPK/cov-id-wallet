import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, TouchableOpacity, Animated, StyleSheet, ActivityIndicator } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { SwipeListView } from 'react-native-swipe-list-view';

import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import FlatCard from '../components/FlatCard';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { getItem, saveItem, deleteConnAndCredByConnectionID, deleteActionByConnectionID } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import { get_all_connections } from '../gateways/connections';
import { showMessage } from '../helpers/Toast';
import { addVerificationToActionList } from '../helpers/ActionList';
import { RED_COLOR, SECONDARY_COLOR } from '../theme/Colors';

function ConnectionsScreen(props) {
  const [isConnection, setConnection] = useState(true);
  const [connectionsList, setConnectionsList] = useState([]);
  const [clickedConnection, setClickedConnection] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    getAllConnections();
    addVerificationToActionList()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      getAllConnections();
      return;
    }, [isConnection]),
  );

  const updateConnectionsList = async () => {
    let connections = (JSON.parse(await getItem(ConstantsList.CONNECTIONS)) || []);
    console.log("Connection Lenght",connections.length);
    if (connections.length > 0) {
      setConnectionsList(connections);
      setConnection(true);
    } else {
      setConnection(false);
      setConnectionsList([]);
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
          setConnectionsList([]);
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

  async function onSuccessPress(connection) {
    // Delete connection with its respective certificates
    setIsLoading(true);

    console.log(connection);
    await deleteConnAndCredByConnectionID(connection.connectionId);
    await deleteActionByConnectionID(connection.connectionId);

    setTimeout(() => {
      updateConnectionsList();
      setIsLoading(false);
    }, 1200);
  }

  function onRejectPress() {
    console.log('rejected!')
  }

  function onDeletePressed(e) {
    setClickedConnection(e);
    setTemp(Math.random() * 999);
    Alert.alert(
      "Are you sure you want to delete this connection?",
      "This will also delete all certificates issued by this connection.",
      [
        {
          text: 'Cancel',
          onPress: () => onRejectPress(),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => onSuccessPress(e),
          style: 'default',
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          onRejectPress()
      },
    );
   //showAskDialog("Are you sure you want to delete this connection?", "This will also delete all certificates issued by this connection.", onSuccessPress, onRejectPress)
  }

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Connections" />
      {isLoading &&
        <View style={{ zIndex: 10, position: "absolute", left: 0, right: 0, bottom: 0, top: 0, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={"#000"} size={"large"} />
        </View>
      }

      {
        connectionsList.length > 0 ?
          <>
            <View pointerEvents={isLoading ? 'none' : 'auto'}>
              {
                isModalVisible &&
                <ActionDialog
                  isVisible={isModalVisible}
                  toggleModal={toggleModal}
                  rejectModal={rejectModal}
                  data={modalData}
                  dismissModal={dismissModal}
                  acceptModal={acceptModal}
                  modalType="action"
                  isIconVisible={true}
                />
              }
              <SwipeListView
                useFlatList
                disableRightSwipe
                data={connectionsList}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 50,
                }}
                keyExtractor={(rowData, index) => {
                  return index;
                }}
                renderItem={(rowData, rowMap) => {
                  let imgURI = rowData.item.imageUrl;
                  let header = rowData.item.name != undefined ? rowData.item.name : "";
                  let subtitle =
                    'The connection between you and ' +
                    header.toLowerCase() +
                    ' is secure and encrypted.';
                  return (
                    <FlatCard onPress={() => { }} imageURL={imgURI} heading={header} text={subtitle} />
                  );
                }}
                renderHiddenItem={({ item, index }) => (
                  <View key={index} style={styles.rowBack}>
                    <TextComponent text="" />
                    <Animated.View>
                      <TouchableOpacity onPress={() => onDeletePressed(item)} activeOpacity={0.8}
                        style={[
                          styles.swipeableViewStyle,
                        ]}
                      >
                        <MaterialCommunityIcons
                          size={30}
                          name="delete"
                          padding={30}
                          color={RED_COLOR}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                )}
                leftOpenValue={75}
                rightOpenValue={-75}
              />
            </View>
          </>
          :
          <View style={styles.EmptyContainer}>
            <TextComponent text="You have no connections yet." />
            <ImageBoxComponent
              source={require('../assets/images/connectionsempty.png')}
            />
          </View>
      }

      {/* {connectionsList.length > 0 ? (
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
      } */}
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
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  swipeableViewStyle: {
    width: 60,
    height: 60,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: SECONDARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    marginBottom: 8,
  }
});

export default ConnectionsScreen;
