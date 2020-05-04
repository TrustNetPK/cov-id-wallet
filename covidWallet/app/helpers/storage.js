import AsyncStorage from '@react-native-community/async-storage';

 export const savePassCode = async (PassCode)=> {
          return await AsyncStorage.setItem('@passCode', PassCode)
    }

export const getPassCode = async () => {
        try {
            const value = await AsyncStorage.getItem('@passCode')
            if (value !== null) {

            }
        } catch (e) {
            // error reading value
        }
    }
