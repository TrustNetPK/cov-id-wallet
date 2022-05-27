import React, {useState,useEffect} from 'react';
import {StyleSheet, Platform, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import TabNavigator from './components/TabNavigator';
import {AuthContext} from './context/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SplashScreen from 'react-native-splash-screen';
import PassCodeContainer from './containers/PassCodeContainer';
import AuthenticationContainer from './containers/AuthenticationContainer';
import WelcomeScreen from './screens/WelcomeScreen';
import SecureIdContainer from './containers/SecureIdContainer';
import SecurityScreen from './screens/SecurityScreen';
import NotifyMeScreen from './screens/NotifyMeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './screens/SettingsScreen';
import DetailsScreen from './screens/DetailsScreen';
import QRScreen from './screens/QRScreen';
import {BLACK_COLOR, BACKGROUND_COLOR} from './theme/Colors';
import RegistrationModule from './screens/RegistrationModule';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import MultiFactorScreen from './screens/MultiFactorScreen';
import LoadingScreen from './screens/LoadingScreen';
import ProfileScreen from './screens/ProfileScreen';
import {RefreshContextProvider} from './context/RefreshContextProvider';
import useBiometric from './hooks/useBiometric';
import {analytics_log_logout} from './helpers/analytics';
import {_fetchingAppData} from './helpers/AppData';
import NetInfo from '@react-native-community/netinfo';
import {checkVersion} from 'react-native-check-version';
import VersionModal from './components/VersionModal';
import {saveItem} from './helpers/Storage';
import ContantList from './helpers/ConfigApp';
import useNetwork from './hooks/useNetwork';
import AboutUs from './screens/AboutUs';
import ContactUs from './screens/ContactUs';
import IntroScreen from './screens/IntroScreen';
const Stack = createStackNavigator();

const navigationAnimation =
  Platform.OS == 'ios'
    ? TransitionPresets.DefaultTransition
    : TransitionPresets.RevealFromBottomAndroid;

function NavigationComponent() {
  const linking = {
    prefixes: ['https://zadanetwork.com', 'zada://'], //npx uri-scheme open https://zadanetwork.com/connection_request/abcd --android
  };

  // Hooks
  const {isConnected, getNetworkInfo} = useNetwork();

  // States
  const [isLoading, setLoading] = useState(true);
  const [messageIndex, setMessageIndex] = useState(2);
  const [isNewVersion, setIsNewVersion] = useState(false);
  const [versionDetails, setVersionDetails] = useState(null);
  const {authStatus, oneTimeAuthentication} = useBiometric();
  const [isFirstTime, getisFirstTime] = React.useState('true');

  const storeData = async () => {
    try {
      AsyncStorage.setItem('isfirstTime', 'false');
    } catch (error) {
      // Error saving data
    }
  };

  const retrieveData = async () => {
    try { 
      const value  = await AsyncStorage.getItem('isfirstTime');

      if (value == null || value == 'true'){
        getisFirstTime('true');
        setLoading(false);
        return
      }

      if(value == 'false'){
        getisFirstTime('false');
        
        // Getting Network info
        let state = await getNetworkInfo();
        if(state.isConnected){
          setMessageIndex(1);
          
          // Fetching data
          await _fetchingAppData(state.isConnected);
          
          setMessageIndex(3)

          // Setting Timeout just so it looks good for now.
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  // Checking auth status
  const _checkAuthStatus = () => {
    retrieveData();
  };

  const _loggingOut = () => {
    try {
      AsyncStorage.setItem('isfirstTime', 'true');
      analytics_log_logout();
    } catch (error) {
      alert(error);
    }
  };

  const authContext = React.useMemo(
    () => ({
      isFirstTimeFunction: () => {
        storeData();
        getisFirstTime('false');
      },
      logout: () => {
        _loggingOut();
        getisFirstTime('true');
      },
    }),
    [],
  );


  // UseEffects
  useEffect(() => {
    AsyncStorage.setItem('temporarilyMovedToBackground', 'false');
  },[])

  useEffect(() => {
    const _checkVersion = async () => {
      setMessageIndex(0);
      let netState = await getNetworkInfo(); 
      SplashScreen.hide();
      if (netState.isConnected) {
        const version = await checkVersion();
        if (version.needsUpdate) {
          setIsNewVersion(true);
          setVersionDetails(version);
          await saveItem(ContantList.APP_VERSION, JSON.stringify(version));
        } else {
          _checkAuthStatus();
        }
      } else {
        _checkAuthStatus();
      }
    };
    _checkVersion();
  }, [isFirstTime]);

  // On Version skip click
  const _onSkipClick = () => {
    setIsNewVersion(false);
    _checkAuthStatus();
  };

  return (
    <AuthContext.Provider value={authContext}>
      <RefreshContextProvider>
        <NavigationContainer linking={linking}>
          <VersionModal
            isVisible={isNewVersion}
            versionDetails={versionDetails}
            skipCallback={() => {
              _onSkipClick();
            }}
          />
          {isLoading ? (
            <Stack.Navigator>
              <Stack.Screen
                options={{headerShown: false}}
                name="LoadingScreen"
                children={() => <LoadingScreen messageIndex={messageIndex}/>}
              />
            </Stack.Navigator>
          ) : isFirstTime === 'true' ? (
            <Stack.Navigator screenOptions={{...navigationAnimation}}>
              <Stack.Screen
                options={{headerShown: false}}
                name="IntroScreen"
                component={IntroScreen}
              />

              <Stack.Screen
                options={{headerShown: false}}
                name="WelcomeScreen"
                component={WelcomeScreen}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="RegistrationScreen"
                component={RegistrationModule}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="ForgotPasswordScreen"
                component={ForgotPasswordScreen}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="MultiFactorScreen"
                component={MultiFactorScreen}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="PassCodeContainer"
                component={PassCodeContainer}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="SecurityScreen"
                component={SecurityScreen}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="SecureidContainer"
                component={SecureIdContainer}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="NotifyMeScreen"
                component={NotifyMeScreen}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator screenOptions={{...navigationAnimation}}>
              <Stack.Screen
                name="MainScreen"
                options={({navigation}) => ({
                  headerStyle: {
                    backgroundColor: BACKGROUND_COLOR,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                  },
                  title: false,
                  headerLeft: () => (
                    <FontAwesome
                      onPress={() => {
                        navigation.navigate('SettingsScreen', {
                          oneTimeAuthentication,
                        });
                      }}
                      style={styles.headerRightIcon}
                      size={30}
                      name="navicon"
                      padding={30}
                    />
                  ),
                })}
                component={TabNavigator}
              />
              <Stack.Screen
                name="SettingsScreen"
                options={({navigation}) => ({
                  headerTitle: 'Settings',
                  headerLeft: () => (
                    <MaterialIcons
                      onPress={() => {
                        navigation.goBack();
                      }}
                      style={styles.headerRightIcon}
                      size={30}
                      name="arrow-back"
                      padding={30}
                    />
                  ),
                })}
                component={SettingsScreen}
              />
              <Stack.Screen
                name="ContactUs"
                options={({navigation}) => ({
                  headerTitle: 'Contact Us',
                  headerLeft: () => (
                    <MaterialIcons
                      onPress={() => {
                        navigation.goBack();
                      }}
                      style={styles.headerRightIcon}
                      size={30}
                      name="arrow-back"
                      padding={30}
                    />
                  ),
                })}
                component={ContactUs}
              />

              <Stack.Screen
                name="AboutUs"
                options={({navigation}) => ({
                  headerTitle: 'About Us',
                  headerLeft: () => (
                    <MaterialIcons
                      onPress={() => {
                        navigation.goBack();
                      }}
                      style={styles.headerRightIcon}
                      size={30}
                      name="arrow-back"
                      padding={30}
                    />
                  ),
                })}
                component={AboutUs}
              />

              <Stack.Screen
                name="ProfileScreen"
                options={({navigation}) => ({
                  headerTitle: 'Edit Profile',
                  headerLeft: () => (
                    <MaterialIcons
                      onPress={() => {
                        navigation.goBack();
                      }}
                      style={styles.headerRightIcon}
                      size={30}
                      name="arrow-back"
                      padding={30}
                    />
                  ),
                })}
                component={ProfileScreen}
              />
              <Stack.Screen
                name="DetailsScreen"
                component={DetailsScreen}
                options={({navigation}) => ({
                  headerTintColor: 'black',
                  headerStyle: {
                    backgroundColor: BACKGROUND_COLOR,
                  },
                  headerTitle: () => (
                    <Text
                      style={{
                        fontSize: 24,
                        color: BLACK_COLOR,
                        textAlign: 'center',
                      }}>
                      Details
                    </Text>
                  ),
                })}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="RegistrationScreen"
                component={RegistrationModule}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="QRScreen"
                path="/scanqr/:pathParam1?/:pathParam2?" //npx uri-scheme open https://zadanetwork.com/type=connection_data --android
                component={QRScreen}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="AuthenticationContainer"
                component={AuthenticationContainer}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </RefreshContextProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  headerRightIcon: {
    padding: 10,
    color: BLACK_COLOR,
  },
});

export default NavigationComponent;
export {AuthContext};
