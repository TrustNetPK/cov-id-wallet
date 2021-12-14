import { useFocusEffect, } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';
import CredentialsCard from '../components/CredentialsCard';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { getItem, saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import moment from 'moment';
import useNetwork from '../hooks/useNetwork';
import { get_all_qr_credentials } from '../gateways/credentials';
import PullToRefresh from '../components/PullToRefresh';
import EmptyList from '../components/EmptyList';
import FeatureVideo from '../components/FeatureVideo';
import { PRIMARY_COLOR, WHITE_COLOR } from '../theme/Colors';
import FeatherIcon from 'react-native-vector-icons/Feather';

function CredentialsScreen(props) {

  const { isConnected } = useNetwork();
  const [credentials, setCredentials] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredCreds, setFilteredCreds] = useState([]);

  const _searchInputHandler = (searchText) => {
    setSearch(searchText);
    if (searchText != null && searchText.length != 0) {
      let searchCreds = [];
      credentials.forEach((item) => {
        if (item.type != undefined && item.type != undefined && item.type.toLowerCase().includes(searchText.toLowerCase()))
          searchCreds.push(item);
      });
      setFilteredCreds(searchCreds);
    }
    else {
      setFilteredCreds([]);
    }
  }

  const updateCredentialsList = async () => {
    try {
      // Getting item from asyncstorage
      let connections = await getItem(ConstantsList.CONNECTIONS);
      let credentials = await getItem(ConstantsList.CREDENTIALS);

      // Parsing JSON
      let connectionsList = JSON.parse(connections) || [];
      let credentialsList = JSON.parse(credentials) || [];

      // If arr is empty, return
      if (connectionsList.length === 0 || credentialsList.length === 0) {
        setCredentials([]);
        return
      }

      setCredentials(credentialsList);
    } catch (e) {
      console.log("UPDATING CREDENTIALS FAILED =>", e);
    }
  }

  const getAllCredential = async () => {
    try {
      setRefreshing(true);
      if (isConnected) {
        await get_all_qr_credentials();
        await updateCredentialsList();
      }
      else {
        await updateCredentialsList();
      }
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      console.log('FETCHING CREDENTIALS ERROR =>', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      updateCredentialsList();
    }, [])
  );

  const toggleModal = (v) => {
    props.navigation.navigate("DetailsScreen", {
      data: v
    });
  };

  // For Youtube Video
  const [showVideo, setShowVideo] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const _checkForFeatureVideo = async () => {
        const playFeatureVideo = await getItem('feature_video');
        if ((playFeatureVideo == undefined || playFeatureVideo == null || playFeatureVideo == '') && isConnected) {
          setShowVideo(true);
          await saveItem('feature_video', 'false');
        }
      }
      _checkForFeatureVideo();
    }, [])
  );

  return (
    <View style={themeStyles.mainContainer}>

      <FeatureVideo
        isVisible={showVideo}
        onCloseClick={() => { setShowVideo(prev => !prev) }}
      />

      <PullToRefresh />

      <HeadingComponent text="Certificates" />
      {credentials.length > 0 ? (
        <>
          <View style={styles._searchContainer}>
            <TextInput
              placeholder='Search'
              value={search}
              onChangeText={_searchInputHandler}
              style={styles._searchInput}
            />
            <FeatherIcon
              name='search'
              size={24}
              color={PRIMARY_COLOR}
            />
          </View>
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={'#7e7e7e'}
                refreshing={refreshing}
                onRefresh={() => { getAllCredential() }}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{
              flexGrow: 1,
            }}
            data={search ? filteredCreds : credentials}
            contentContainerStyle={{
              width: '100%',
            }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity onPress={() => toggleModal(item)} activeOpacity={0.9}>
                  <View style={styles.CredentialsCardContainer}>
                    <CredentialsCard
                      schemeId={item.values['schemaId']}
                      card_title={item.name}
                      card_type={item.type}
                      issuer={item.organizationName}
                      card_user=""
                      date={moment(item.values['Issue Time']).format('DD/MM/YYYY')}
                      card_logo={{ uri: item.imageUrl }} />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
      ) : (
        <EmptyList
          refreshing={refreshing}
          onRefresh={() => { getAllCredential() }}
          text="There are no certificates in your wallet. Once you receive a certificate, it will show up here."
          image={require('../assets/images/credentialsempty.png')}
        />
      )}
    </View >
  );
}


const styles = StyleSheet.create({
  _searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 45,
    borderRadius: 10,
    backgroundColor: WHITE_COLOR,
    paddingHorizontal: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10
  },
  _searchInput: {
    width: '88%',
    height: '100%',
    fontSize: 14,
    fontFamily: 'Poppins-Regular'
  },
  CredentialsCardContainer: {
    paddingTop: 5,
  },
});

export default CredentialsScreen;