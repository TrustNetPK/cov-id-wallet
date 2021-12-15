import React, { useEffect, useRef, useState } from 'react'
import { useFocusEffect, } from '@react-navigation/native';
import {
    TextInput,
    StyleSheet,
    View,
    RefreshControl,
    TouchableOpacity,
    Text,
    ScrollView,
} from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import EmptyList from '../components/EmptyList';
import PullToRefresh from '../components/PullToRefresh';
import { add_credential_group, fetch_all_groups } from '../helpers/Credential_Groups';
import useNetwork from '../hooks/useNetwork';
import ActionButton from 'react-native-action-button';
import { BACKGROUND_COLOR, PRIMARY_COLOR, RED_COLOR, WHITE_COLOR } from '../theme/Colors';
import AddGroupModal from '../components/AddGroupModal';
import ConstantsList from '../helpers/ConfigApp';
import { getItem } from '../helpers/Storage';
import { get_all_qr_credentials } from '../gateways/credentials';
import { _showAlert } from '../helpers/Toast';
import { groupNameRegex } from '../helpers/validation';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CredentialsCard from '../components/CredentialsCard';
import moment from 'moment';

const CredentialGroups = (props) => {

    const { isConnected } = useNetwork();
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [credentialGroups, setCredentialGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groupNameError, setGroupNameError] = useState('');
    const [showAddGroup, setShowAddGroup] = useState(false);

    // Credentials
    const [credentials, setCredentials] = useState([]);

    const toggleModal = (v) => {
        props.navigation.navigate("DetailsScreen", {
            data: v
        });
    };

    // Dropdown Animation
    const [currentIndex, setCurrentIndex] = useState(-1);
    const ref = useRef(null);
    const transition = (
        <Transition.Together>
            <Transition.In type="fade" durationMs={200} />
            <Transition.Change />
            <Transition.Out type="fade" durationMs={200} />
        </Transition.Together>
    );


    const _searchInputHandler = (searchText) => {
        setSearch(searchText);
        if (searchText != null && searchText.length != 0) {
            let searchCreds = [];
            credentialGroups.forEach((item) => {
                if (item.group_name != undefined &&
                    item.group_name != '' &&
                    item.group_name.toLowerCase().includes(searchText.toLowerCase()))
                    searchCreds.push(item);
            });
            setFilteredGroups(searchCreds);
        }
        else {
            setFilteredGroups([]);
        }
    }

    const getAllCredential = async () => {
        try {
            if (isConnected) {
                await get_all_qr_credentials();
                await updateCredentialsList();
            }
            else {
                await updateCredentialsList();
            }
        } catch (error) {
            console.log('FETCHING CREDENTIALS ERROR =>', error);
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

    const updateCredentialGroupList = async () => {
        try {
            // Getting item from asyncstorage
            let groups = await fetch_all_groups();
            setCredentialGroups(groups);
        } catch (e) {
            _showAlert('ZADA Wallet', error.message);
        }
    }

    const fetchGroupsAndCredentials = async () => {
        try {
            setRefreshing(true);
            await getAllCredential();
            await updateCredentialsList();
            // Getting item from asyncstorage
            let groups = await fetch_all_groups();
            setCredentialGroups(groups);
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            _showAlert('ZADA Wallet', error.message);
        }
    }

    const onCreateGroupClick = async (creds) => {
        try {
            if (!groupNameRegex.test(groupName)) {
                setGroupNameError("Group name should contain at least 2 characters");
                return;
            }
            setGroupNameError('');

            let selectedCreds = [];
            creds.forEach((item, index) => {
                if (item.selected) {
                    selectedCreds.push(item);
                }
            });

            if (selectedCreds.length == 0) {
                _showAlert("ZADA Wallet", 'Please select at least one credential');
                return;
            }

            await add_credential_group(groupName, selectedCreds);
            await updateCredentialGroupList();
            setShowAddGroup(false);
        } catch (error) {
            _showAlert('ZADA Wallet', error.message);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            updateCredentialGroupList();
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            updateCredentialsList();
        }, [])
    );

    return (
        <Transitioning.View
            ref={ref}
            transition={transition}
            style={styles._mainContainer}>

            <AddGroupModal
                isVisible={showAddGroup}
                credentials={credentials}
                groupName={groupName}
                groupNameError={groupNameError}
                onGroupNameChange={text => {
                    setGroupName(text);
                }}
                onCreateGroupClick={onCreateGroupClick}
                onCloseClick={() => { setGroupName(''); setGroupNameError(''); setShowAddGroup(false) }}
                onRefresh={() => { fetchGroupsAndCredentials() }}
                refreshing={refreshing}
            />

            <PullToRefresh />

            {
                credentialGroups.length > 0 ? (
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

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    tintColor={'#7e7e7e'}
                                    refreshing={refreshing}
                                    onRefresh={() => { fetchGroupsAndCredentials() }}
                                />
                            }
                            contentContainerStyle={{
                                width: '100%',
                                padding: 10,
                                paddingBottom: '50%',
                            }}
                        >
                            {
                                search ? (
                                    filteredGroups.map((group, index) => {
                                        return (
                                            <View style={[styles._groupContainer, { backgroundColor: group.selected ? 'rgba(0,0,0,0.1)' : 'transparent' }]}>
                                                <TouchableOpacity
                                                    activeOpacity={0.9}
                                                    onPress={() => {
                                                        setCurrentIndex(index === currentIndex ? -1 : index);
                                                        if (ref != null) ref.current.animateNextTransition();
                                                    }}
                                                    style={styles._groupHeadingContainer}
                                                >
                                                    <Text style={styles._groupName}>{group.group_name}</Text>
                                                    <FeatherIcon
                                                        name={index === currentIndex ? 'chevron-down' : 'chevron-right'}
                                                        size={24}
                                                        color={PRIMARY_COLOR}
                                                    />
                                                </TouchableOpacity>
                                                {index === currentIndex && (
                                                    group.credentials.map((cred, credIndex) => (
                                                        <TouchableOpacity
                                                            onPress={() => { toggleModal(cred) }}
                                                            key={credIndex.toString()}
                                                            style={styles._credentialsCardContainer}
                                                        >
                                                            <CredentialsCard
                                                                schemeId={cred.values['schemaId']}
                                                                card_title={cred.name}
                                                                card_type={cred.type}
                                                                issuer={cred.organizationName}
                                                                card_user=""
                                                                date={moment(cred.values['Issue Time']).format('DD/MM/YYYY')}
                                                                card_logo={{ uri: cred.imageUrl }} />
                                                        </TouchableOpacity>
                                                    ))
                                                )}
                                            </View>
                                        )
                                    })
                                ) : (
                                    credentialGroups.map((group, index) => {
                                        return (
                                            <View style={[styles._groupContainer, { backgroundColor: group.selected ? 'rgba(0,0,0,0.1)' : 'transparent' }]}>
                                                <TouchableOpacity
                                                    activeOpacity={0.9}
                                                    onPress={() => {
                                                        setCurrentIndex(index === currentIndex ? -1 : index);
                                                        if (ref != null) ref.current.animateNextTransition();
                                                    }}
                                                    style={styles._groupHeadingContainer}
                                                >
                                                    <Text style={styles._groupName}>{group.group_name}</Text>
                                                    <FeatherIcon
                                                        name={index === currentIndex ? 'chevron-down' : 'chevron-right'}
                                                        size={24}
                                                        color={PRIMARY_COLOR}
                                                    />
                                                </TouchableOpacity>
                                                {index === currentIndex && (
                                                    group.credentials.map((cred, credIndex) => (
                                                        <TouchableOpacity
                                                            onPress={() => { toggleModal(cred) }}
                                                            key={credIndex.toString()}
                                                            style={styles._credentialsCardContainer}
                                                        >
                                                            <CredentialsCard
                                                                schemeId={cred.values['schemaId']}
                                                                card_title={cred.name}
                                                                card_type={cred.type}
                                                                issuer={cred.organizationName}
                                                                card_user=""
                                                                date={moment(cred.values['Issue Time']).format('DD/MM/YYYY')}
                                                                card_logo={{ uri: cred.imageUrl }} />
                                                        </TouchableOpacity>
                                                    ))
                                                )}
                                            </View>
                                        )
                                    })
                                )

                            }
                        </ScrollView>
                    </>
                ) : (
                    <EmptyList
                        refreshing={refreshing}
                        onRefresh={() => { fetchGroupsAndCredentials() }}
                        text="There are no certificate groups in your wallet. Create first by clicking on plus button"
                        image={require('../assets/images/credentialsempty.png')}
                        style={{
                            marginTop: 10,
                        }}
                    />
                )

            }

            <ActionButton
                buttonColor={PRIMARY_COLOR}
                onPress={() => { setShowAddGroup(true) }}
            />
        </Transitioning.View>
    )
}

const styles = StyleSheet.create({
    _mainContainer: {
        flex: 1,
        paddingTop: 10,
    },
    _deleteContainer: {
        marginTop: 10,
        width: '95%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    _selected: {
        color: PRIMARY_COLOR,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    _delete: {
        fontSize: 16,
        color: RED_COLOR,
        fontFamily: 'Poppins-Regular',
    },
    _cancel: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    _searchContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%',
        height: 45,
        borderRadius: 10,
        backgroundColor: WHITE_COLOR,
        paddingHorizontal: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 10,
        marginTop: 15,
    },
    _searchInput: {
        width: '88%',
        height: '100%',
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    },
    _groupContainer: {
        backgroundColor: BACKGROUND_COLOR,
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        borderRadius: 10,
        marginBottom: 5,
    },
    _groupHeadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    _groupName: {
        width: '88%',
        fontSize: 18,
        color: PRIMARY_COLOR,
        fontFamily: 'Poppins-Regular',
    },
    _credentialsCardContainer: {
        paddingTop: 5,
    },
});

export default CredentialGroups;
