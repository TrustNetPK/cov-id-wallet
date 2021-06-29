import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Text, Image, StyleSheet} from 'react-native';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import FlatCard from '../components/FlatCard';
import HeadingComponent from '../components/HeadingComponent';
import {themeStyles} from '../theme/Styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ModalComponent from '../components/ModalComponent';
import {getItem, deleteActionByConnId, saveItem} from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';

function ConnectionsScreen(props) {
  const [isConnection, setConnection] = useState(true);
  const [connectionsList, setConnectionsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      updateConnectionsList();
      return;
    }, [isConnection]),
  );

  const updateConnectionsList = () => {
    getItem(ConstantsList.CONNECTIONS)
      .then((connections) => {
        if (connections != null) {
          let connectionsList = JSON.parse(connections);
          setConnectionsList(connectionsList);
          setConnection(true);
        } else {
          setConnection(false);
        }
      })
      .catch((e) => {});
  };

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Connections" />
      {isConnection && (
        <View>
          {connectionsList.map((v, i) => {
            console.log(JSON.stringify(v));
            let imgURI = v.imageUrl;
            let header = v.name;
            let subtitle =
              'The connection between you and ' +
              header.toLowerCase() +
              ' is secure and encrypted.';
            return (
              <TouchableOpacity key={i}>
                <FlatCard imageURL={imgURI} heading={header} text={subtitle} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {!isConnection && (
        <View style={styles.EmptyContainer}>
          <TextComponent text="You have no connections yet." />
          <ImageBoxComponent
            source={require('../assets/images/connectionsempty.png')}
          />
        </View>
      )}
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
