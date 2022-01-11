import React, { useRef, useState } from 'react'
import { useFocusEffect, } from '@react-navigation/native';
import {
    TextInput,
    StyleSheet,
    View,
    RefreshControl,
    TouchableOpacity,
    Text,
    ScrollView,
    Animated,
    Dimensions,
    Alert,
} from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import EmptyList from '../components/EmptyList';
import PullToRefresh from '../components/PullToRefresh';
import { add_credential_group, delete_credential_group, edit_credential_group, fetch_all_groups, remove_all_credentials_group } from '../helpers/Credential_Groups';
import useNetwork from '../hooks/useNetwork';
import ActionButton from 'react-native-action-button';
import { BLACK_COLOR, PRIMARY_COLOR, RED_COLOR, WHITE_COLOR } from '../theme/Colors';
import AddGroupModal from '../components/AddGroupModal';
import ConstantsList from '../helpers/ConfigApp';
import { getItem } from '../helpers/Storage';
import { get_all_qr_credentials } from '../gateways/credentials';
import { _showAlert } from '../helpers/Toast';
import { groupNameRegex } from '../helpers/validation';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CredentialsCard from '../components/CredentialsCard';
import moment from 'moment';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import EditGroupModal from '../components/EditGroupModal';
import { _handleAxiosError } from '../helpers/AxiosResponse';
import { get_local_issue_date } from '../helpers/time';

const CredentialGroups = (props) => {

    const { isConnected } = useNetwork();
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [credentialGroups, setCredentialGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groupNameError, setGroupNameError] = useState('');
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [showEditGroup, setShowEditGroup] = useState(false);
    const [selectedEditGroup, setSelectedEditGroup] = useState([]);

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
            _handleAxiosError(error, 'Unable to fetch groups and credentials', true);
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
            _handleAxiosError(error);
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
            setGroupName('');
            setGroupNameError('');
            setShowAddGroup(false);
        } catch (error) {
            _showAlert('ZADA Wallet', error.message);
        }
    }

    const onUpdateGroupClick = async (creds) => {
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

            await edit_credential_group(groupName, selectedEditGroup, selectedCreds);
            await updateCredentialGroupList();
            setGroupName('');
            setGroupNameError('');
            setShowEditGroup(false);
        } catch (error) {
            _showAlert('ZADA Wallet', error.message);
        }
    }

    const onDeletePressed = async (group) => {
        try {
            await delete_credential_group(group);
            await updateCredentialGroupList();
        } catch (error) {
            _showAlert('ZADA Wallet', error.message);
        }
    }

    const showDeleteAlert = (group) => {
        Alert.alert(
            "Confirmation",
            "Are you sure you want to delete this group?",
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => onDeletePressed(group),
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

            <EditGroupModal
                isVisible={showEditGroup}
                credentials={credentials}
                groupCredentials={selectedEditGroup.credentials}
                groupName={groupName}
                groupNameError={groupNameError}
                onGroupNameChange={text => {
                    setGroupName(text);
                }}
                onUpdateGroupClick={onUpdateGroupClick}
                onCloseClick={() => { setGroupName(''); setGroupNameError(''); setShowEditGroup(false) }}
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
                            style={{
                                flexGrow: 1,
                            }}
                            contentContainerStyle={{
                                paddingBottom: '50%',
                            }}
                        >
                            {
                                search ? (
                                    filteredGroups.map((group, index) => {

                                        const renderRightActions = (progress, dragX) => {
                                            const trans = dragX.interpolate({
                                                inputRange: [0, 50, 100, 101],
                                                outputRange: [0, 5, 10, 15],
                                            });
                                            return (
                                                <View style={styles._leftActionContainer}>
                                                    <Animated.View style={{ transform: [{ translateX: trans }] }}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.9}
                                                            style={styles._actionButton}
                                                            onPress={() => {
                                                                setSelectedEditGroup(group);
                                                                setGroupName(group.group_name);
                                                                setShowEditGroup(true);
                                                            }}
                                                        >
                                                            <FeatherIcon
                                                                name='edit'
                                                                color={PRIMARY_COLOR}
                                                                size={24}
                                                            />
                                                        </TouchableOpacity>
                                                    </Animated.View>

                                                    <Animated.View style={{ transform: [{ translateX: trans }] }}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.9}
                                                            style={[styles._actionButton, { marginLeft: 4 }]}
                                                            onPress={() => { showDeleteAlert(group) }}
                                                        >
                                                            <FeatherIcon
                                                                name='trash'
                                                                color={RED_COLOR}
                                                                size={24}
                                                            />
                                                        </TouchableOpacity>
                                                    </Animated.View>
                                                </View >
                                            );
                                        };

                                        return (
                                            <Swipeable
                                                renderRightActions={renderRightActions}
                                            >
                                                <View style={styles._groupContainer}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.9}
                                                        onPress={() => {
                                                            setCurrentIndex(index === currentIndex ? -1 : index);
                                                            if (ref != null) ref.current.animateNextTransition();
                                                        }}
                                                        style={styles._groupHeadingContainer}
                                                    >
                                                        <View style={{ width: '90%' }}>
                                                            <Text style={styles._groupName}>{group.group_name}</Text>
                                                            <Text style={styles._groupDate}>Created At: {moment(group.createdAt).format('DD/MM/YYYY HH:MM A')}</Text>
                                                        </View>
                                                        <FeatherIcon
                                                            name={index === currentIndex ? 'chevron-down' : 'chevron-right'}
                                                            size={24}
                                                            color={PRIMARY_COLOR}
                                                        />

                                                    </TouchableOpacity>
                                                    {
                                                        index === currentIndex && (
                                                            group.credentials.map((cred, credIndex) => (
                                                                <TouchableOpacity
                                                                    onPress={() => { toggleModal(cred) }}
                                                                    key={credIndex.toString()}
                                                                    style={styles._credentialsCardContainer}
                                                                >
                                                                    <CredentialsCard
                                                                        schemeId={cred['schemaId']}
                                                                        card_title={cred.name}
                                                                        card_type={cred.type}
                                                                        issuer={cred.organizationName}
                                                                        card_user=""
                                                                        date={cred.values['Issue Time'] ? get_local_issue_date(cred.values['Issue Time']) : undefined}
                                                                        card_logo={{ uri: cred.imageUrl }} />
                                                                </TouchableOpacity>
                                                            ))
                                                        )
                                                    }
                                                </View>
                                            </Swipeable>
                                        )
                                    })
                                ) : (
                                    credentialGroups.map((group, index) => {

                                        const renderRightActions = (progress, dragX) => {
                                            const trans = dragX.interpolate({
                                                inputRange: [0, 50, 100, 101],
                                                outputRange: [0, 5, 10, 15],
                                            });
                                            return (
                                                <View style={styles._leftActionContainer}>
                                                    <Animated.View style={{ transform: [{ translateX: trans }] }}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.9}
                                                            style={styles._actionButton}
                                                            onPress={() => {
                                                                setSelectedEditGroup(group);
                                                                setGroupName(group.group_name);
                                                                setShowEditGroup(true);
                                                            }}
                                                        >
                                                            <FeatherIcon
                                                                name='edit'
                                                                color={PRIMARY_COLOR}
                                                                size={24}
                                                            />
                                                        </TouchableOpacity>
                                                    </Animated.View>

                                                    <Animated.View style={{ transform: [{ translateX: trans }] }}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.9}
                                                            style={[styles._actionButton, { marginLeft: 4 }]}
                                                            onPress={() => { showDeleteAlert(group) }}
                                                        >
                                                            <FeatherIcon
                                                                name='trash'
                                                                color={RED_COLOR}
                                                                size={24}
                                                            />
                                                        </TouchableOpacity>
                                                    </Animated.View>
                                                </View >
                                            );
                                        };

                                        return (
                                            <Swipeable
                                                renderRightActions={renderRightActions}
                                            >
                                                <View style={styles._groupContainer}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.9}
                                                        onPress={() => {
                                                            setCurrentIndex(index === currentIndex ? -1 : index);
                                                            if (ref != null) ref.current.animateNextTransition();
                                                        }}
                                                        style={styles._groupHeadingContainer}
                                                    >
                                                        <View style={{ width: '90%' }}>
                                                            <Text style={styles._groupName}>{group.group_name}</Text>
                                                            <Text style={styles._groupDate}>Created At: {moment(group.createdAt).format('DD/MM/YYYY HH:MM A')}</Text>
                                                        </View>
                                                        <FeatherIcon
                                                            name={index === currentIndex ? 'chevron-down' : 'chevron-right'}
                                                            size={24}
                                                            color={PRIMARY_COLOR}
                                                        />

                                                    </TouchableOpacity>
                                                    {
                                                        index === currentIndex && (
                                                            group.credentials.map((cred, credIndex) => (
                                                                <TouchableOpacity
                                                                    onPress={() => { toggleModal(cred) }}
                                                                    key={credIndex.toString()}
                                                                    style={styles._credentialsCardContainer}
                                                                >
                                                                    <CredentialsCard
                                                                        schemeId={cred['schemaId']}
                                                                        card_title={cred.name}
                                                                        card_type={cred.type}
                                                                        issuer={cred.organizationName}
                                                                        card_user=""
                                                                        date={cred.values['Issue Time'] ? get_local_issue_date(cred.values['Issue Time']) : undefined}
                                                                        card_logo={{ uri: cred.imageUrl }} />
                                                                </TouchableOpacity>
                                                            ))
                                                        )
                                                    }
                                                </View>
                                            </Swipeable>
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
        </Transitioning.View >
    )
}

const styles = StyleSheet.create({
    _mainContainer: {
        flex: 1,
        paddingTop: 10,
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
        backgroundColor: WHITE_COLOR,
        alignSelf: 'center',
        width: '95%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        shadowColor: BLACK_COLOR,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    _groupHeadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    _groupNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    _groupName: {
        width: '90%',
        fontSize: 18,
        color: PRIMARY_COLOR,
        fontFamily: 'Poppins-Regular',
    },
    _groupDate: {
        width: '90%',
        fontSize: 12,
        color: BLACK_COLOR,
        fontFamily: 'Poppins-Regular',
        opacity: 0.5,
        marginTop: 5,
    },
    _credentialsCardContainer: {
        paddingTop: 5,
    },
    _leftActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -5,
        marginLeft: 10,
    },
    _actionButton: {
        width: Dimensions.get('screen').width * 0.16,
        height: Dimensions.get('screen').width * 0.16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 3, height: 3 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 5,
        borderRadius: 45,
        backgroundColor: WHITE_COLOR,
    },
});

export default CredentialGroups;
