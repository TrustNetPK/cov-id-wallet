import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, TouchableOpacity, Animated, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
import TextComponent from '../components/TextComponent';
import FlatCard from '../components/FlatCard';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { getItem, deleteConnAndCredByConnectionID, deleteActionByConnectionID } from '../helpers/Storage';
import ConstantsList, { ZADA_AUTH_TEST } from '../helpers/ConfigApp';
import { delete_mongo_connection, get_all_connections_for_screen } from '../gateways/connections';
import { showNetworkMessage, _showAlert } from '../helpers/Toast';
import { RED_COLOR, SECONDARY_COLOR } from '../theme/Colors';
import OverlayLoader from '../components/OverlayLoader';
import { analytics_log_connection_delete } from '../helpers/analytics';
import useNetwork from '../hooks/useNetwork';
import PullToRefresh from '../components/PullToRefresh';
import EmptyList from '../components/EmptyList';
import { _handleAxiosError } from '../helpers/AxiosResponse';

const DIMENSIONS = Dimensions.get('screen');

function ConnectionsScreen() {

  const { isConnected } = useNetwork();
  const [connectionsList, setConnectionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      updateConnectionsList();
    }, []),
  );

  const updateConnectionsList = async () => {
    let connections = (JSON.parse(await getItem(ConstantsList.CONNECTIONS)) || []);
    if (connections.length > 0) {
      setConnectionsList(connections);
    } else {
      setConnectionsList([]);
    }
  };

  const getAllConnections = async () => {
    try {
      setRefreshing(true);
      if (isConnected) {
        await get_all_connections_for_screen();
        await updateConnectionsList();
      }
      else {
        await updateConnectionsList();
      }
      setRefreshing(false);
    } catch (e) {
      setRefreshing(false);
      _handleAxiosError(e);
    }

  }

  async function onSuccessPress(connection) {
    try {
      if (isConnected) {
        // Delete connection with its respective certificates
        setIsLoading(true);

        await deleteConnAndCredByConnectionID(connection.connectionId);
        await deleteActionByConnectionID(connection.connectionId);

        if (connection.name == ZADA_AUTH_TEST)
          await delete_mongo_connection(connection.myDid);

        _showAlert('Zada Wallet', 'Connection is deleted successfully');

        analytics_log_connection_delete();

        setTimeout(() => {
          updateConnectionsList();
          setIsLoading(false);
        }, 1200);
      }
      else {
        showNetworkMessage();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      _handleAxiosError(error);
    }
  }

  function onDeletePressed(e) {
    Alert.alert(
      "Are you sure you want to delete this connection?",
      "This will also delete all certificates issued by this connection.",
      [
        {
          text: 'Cancel',
          onPress: () => { },
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
  }

  return (
    <View style={themeStyles.mainContainer}>

      <PullToRefresh />
      <HeadingComponent text="Connections" />
      {
        isLoading &&
        <OverlayLoader
          text='Deleting connection...'
        />
      }

      {
        connectionsList.length ? (
          <>
            <View style={{ flex: 1 }} pointerEvents={isLoading ? 'none' : 'auto'}>
              <SwipeListView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    tintColor={'#7e7e7e'}
                    refreshing={refreshing}
                    onRefresh={getAllConnections}
                  />
                }
                useFlatList
                disableRightSwipe
                data={connectionsList}
                style={{
                  flexGrow: 1,
                }}
                contentContainerStyle={{
                  flexGrow: 1,
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
        ) : (
          <EmptyList
            refreshing={refreshing}
            onRefresh={() => { getAllConnections() }}
            text="You have no connections yet."
            image={require('../assets/images/connectionsempty.png')}
          />
        )}
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
