import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  SafeAreaView,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  BACKGROUND_COLOR,
  WHITE_COLOR,
  PRIMARY_COLOR,
  GREEN_COLOR,
  GRAY_COLOR,
} from '../theme/Colors';
import HeadingComponent from './HeadingComponent';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {InputComponent} from './Input/inputComponent';
import SimpleButton from './Buttons/SimpleButton';
import CredentialsCard from './CredentialsCard';
import EmptyList from './EmptyList';
import {get_local_issue_date} from '../helpers/time';

const AddGroupModal = ({
  isVisible,
  credentials,
  groupName,
  groupNameError,
  onGroupNameChange,
  onCreateGroupClick,
  onCloseClick,
  onRefresh,
  refreshing,
}) => {
  const [search, setSearch] = useState('');
  const [filteredCreds, setFilteredCreds] = useState([]);
  const [creds, setCreds] = useState([]);

  useEffect(() => {
    const _changeCreds = () => {
      let temp = [];
      credentials.forEach((item, index) => {
        let obj = {
          ...item,
          selected: false,
        };
        temp.push(obj);
      });
      setCreds(temp);
    };
    _changeCreds();
  }, [isVisible]);

  const _searchInputHandler = (searchText) => {
    setSearch(searchText);
    if (searchText != null && searchText.length != 0) {
      let searchCreds = [];
      creds.forEach((item) => {
        if (
          (item.type != undefined &&
            item.type != undefined &&
            item.type.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.organizationName != undefined &&
            item.organizationName != undefined &&
            item.organizationName
              .toLowerCase()
              .includes(searchText.toLowerCase()))
        )
          searchCreds.push(item);
      });
      setFilteredCreds(searchCreds);
    } else {
      setFilteredCreds([]);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => {
        onCloseClick();
      }}
      onBackdropPress={() => {
        onCloseClick();
      }}
      style={{
        margin: 0,
      }}>
      <SafeAreaView style={styles._mainContainer}>
        <HeadingComponent text={`New Group`} />

        {/* Group Name */}
        <View
          style={{
            width: '95%',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <InputComponent
            type="default"
            height={45}
            placeholderText="Group Name"
            errorMessage={groupNameError}
            value={groupName}
            inputContainerStyle={styles._inputView}
            setStateValue={onGroupNameChange}
          />
        </View>

        {/* Search Credentials */}
        <View
          style={{
            width: '95%',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <InputComponent
            type="default"
            height={45}
            placeholderText="Search Credential"
            value={search}
            inputContainerStyle={[styles._inputView, {marginTop: 10}]}
            setStateValue={_searchInputHandler}
            rightIcon={() => (
              <FeatherIcon
                name="search"
                size={24}
                color={PRIMARY_COLOR}
                style={{marginHorizontal: 15}}
              />
            )}
          />
        </View>

        {creds.length > 0 ? (
          <FlatList
            onRefresh={onRefresh}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
            data={search ? filteredCreds : creds}
            style={{
              width: '100%',
              height: Dimensions.get('window').width * 0.6,
              marginTop: 25,
            }}
            contentContainerStyle={{
              width: '90%',
              alignSelf: 'center',
            }}
            keyExtractor={(item) => item.crendetialId}
            renderItem={({item, index}) => (
              <Pressable
                style={{marginBottom: 5}}
                onPress={() => {
                  console.log();
                  if (creds[index].selected) {
                    creds[index].selected = false;
                  } else {
                    creds[index].selected = true;
                  }
                  setCreds([...creds]);
                }}>
                <CredentialsCard
                  schemeId={item['schemaId']}
                  card_title={item.name}
                  card_type={item.type}
                  issuer={item.organizationName}
                  card_user=""
                  date={
                    item.values['Issue Time']
                      ? get_local_issue_date(item.values['Issue Time'])
                      : undefined
                  }
                  card_logo={{uri: item.imageUrl}}
                />
                {item.selected && (
                  <FeatherIcon
                    name="check"
                    size={30}
                    color={GREEN_COLOR}
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                    }}
                  />
                )}
              </Pressable>
            )}
          />
        ) : (
          <EmptyList
            onRefresh={onRefresh}
            refreshing={refreshing}
            text="There are no certificates in your wallet. Once you receive a certificate, it will show up here."
            image={require('../assets/images/credentialsempty.png')}
            style={{
              marginTop: 20,
            }}
          />
        )}
        <SimpleButton
          width={250}
          onPress={() => {
            onCreateGroupClick(creds);
          }}
          title="Create Group"
          titleColor={WHITE_COLOR}
          buttonColor={GREEN_COLOR}
          style={{marginTop: 20}}
        />
        <SimpleButton
          width={250}
          onPress={onCloseClick}
          title="Close"
          titleColor={WHITE_COLOR}
          buttonColor={GRAY_COLOR}
          style={{marginTop: 5}}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  _mainContainer: {
    flex: 1,
    paddingBottom: 40,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
  },
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
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  _searchInput: {
    width: '88%',
    height: '100%',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  _inputView: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    width: '100%',
    height: 45,
    paddingLeft: 15,
    borderBottomWidth: 0,
  },
});

export default AddGroupModal;
