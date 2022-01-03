import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Linking, Switch, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLACK_COLOR, GRAY_COLOR, GREEN_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../theme/Colors';
import { getItem, saveItem } from '../helpers/Storage';
import { BIOMETRIC_ENABLED } from '../helpers/ConfigApp';
import { showMessage } from '../helpers/Toast';
import { AuthContext } from '../context/AuthContext';
import ConstantsList from '../helpers/ConfigApp';
import ZignSecModal from '../components/ZignSecModal';
import { getVersion } from 'react-native-device-info';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

export default function SettingsScreen(props) {

  const { logout } = React.useContext(AuthContext);
  const [isBioEnable, setBioEnable] = useState(false);
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const updatevalues = async () => {
      let version = JSON.parse(await getItem(ConstantsList.APP_VERSION) || null);
      let biometric = JSON.parse(await getItem(BIOMETRIC_ENABLED) || 'false');
      setBioEnable(biometric);
      setVersion(version);
    }
    updatevalues();
  }, [])

  const _toggleBio = (value) => {
    props.route.params.oneTimeAuthentication((e) => _bioResult(e, value))
  }

  const _bioResult = async (result, value) => {
    if (result) {

      // Saving preference in asyncstorage.
      await saveItem(BIOMETRIC_ENABLED, JSON.stringify(value));

      // Display message.
      if (value) {
        setBioEnable(true);
        // Display message.
        showMessage(
          'ZADA Wallet',
          'Biometric enabled!',
        );
      } else {
        setBioEnable(false);
        showMessage(
          'ZADA Wallet',
          'Biometric disabled!',
        );
      }

    } else {
      setBioEnable(false);
      console.log('biometric false')
    }
  }

  const onLogoutPressed = async () => {
    const pCode = await getItem(ConstantsList.PIN_CODE);
    AsyncStorage.clear();
    saveItem(ConstantsList.PIN_CODE, pCode);
    logout();
  }

  // when user will click on edit profile screen
  const _onEditProfileClick = () => {
    props.navigation.navigate('ProfileScreen');
  }

  // on Scan Document click
  const _onScanDocumentClick = () => {
    setZignSecModal(true)
  }

  const [showZignSecModal, setZignSecModal] = useState(false);

  return (
    <View style={styles._mainContainer}>

      <ZignSecModal
        isVisible={showZignSecModal}
        onContinueClick={() => { setZignSecModal(false) }}
        onLaterClick={() => { setZignSecModal(false) }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles._list}
        contentContainerStyle={styles._listContainer}
      >
        <Text style={styles._rowHeading}>General</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles._row}
          onPress={() => { }}
        >
          <Text style={styles._rowLabel}>Biometric</Text>
          <Switch
            trackColor={{ false: '#81b0ff', true: '#3ab6ae' }}
            ios_backgroundColor="#ffffff"
            onValueChange={_toggleBio}
            value={isBioEnable}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles._row}
          onPress={() => {
            _onEditProfileClick();
          }}
        >
          <Text style={styles._rowLabel}>Edit Profile</Text>
          <Icon name='right' color={GREEN_COLOR} size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles._row}
          onPress={() => {
            onLogoutPressed();
          }}
        >
          <Text style={styles._rowLabel}>Logout</Text>
          <Icon name='right' color={GREEN_COLOR} size={18} />
        </TouchableOpacity>


        <Text style={[styles._rowHeading, { marginTop: 15 }]}>Support</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles._row}
          onPress={() => {
            Linking.openURL('mailto:support@zada.com');
          }}
        >
          <Text style={styles._rowLabel}>Contact Us</Text>
          <Icon name='right' color={GREEN_COLOR} size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles._row}
          onPress={() => {
            Linking.openURL('https://zada.io/privacy-policy/');
          }}
        >
          <Text style={styles._rowLabel}>License and agreements</Text>
          <Icon name='right' color={GREEN_COLOR} size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles._row}
          onPress={() => {
            Linking.openURL('https://zada.io/');
          }}
        >
          <Text style={styles._rowLabel}>About Us</Text>
          <Icon name='right' color={GREEN_COLOR} size={18} />
        </TouchableOpacity>

        <Text style={[styles._rowHeading, { marginTop: 15 }]}>App Version</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles._row}
          onPress={() => {
            if (Platform.OS === 'android')
              Linking.openURL('https://play.google.com/store/apps/details?id=com.zadanetwork.wallet');
            else
              Linking.openURL('https://apps.apple.com/us/app/zada-wallet/id1578666669');
          }}
        >
          <Text style={styles._rowLabel}>{`${version == null ? getVersion() : version.version}`}</Text>
          <Icon name='right' color={GREEN_COLOR} size={18} />
        </TouchableOpacity>

      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText} >In Collaboration with&nbsp;
          <Text
            style={{ color: PRIMARY_COLOR, }}
            onPress={() => { Linking.openURL('https://trust.net.pk/') }}
          >
            TrustNet Pakistan
          </Text>

        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  _mainContainer: {
    flex: 1,
  },
  _list: {
    flexGrow: 1
  },
  _listContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  _row: {
    width: '100%',
    height: Dimensions.get('screen').height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    padding: 10,
    shadowColor: BLACK_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 5,
  },
  _rowHeading: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: GRAY_COLOR,
    marginBottom: 5,
  },
  _rowLabel: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    color: BLACK_COLOR
  },
  footer: {
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: 'black',
    padding: 10,
    fontSize: 14,
    margin: 10,
    fontFamily: 'Poppins-Regular',
  }
});
