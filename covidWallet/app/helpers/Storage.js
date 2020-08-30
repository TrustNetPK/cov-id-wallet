import AsyncStorage from '@react-native-community/async-storage';

export const savePassCode = async (PassCode) => {
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

export const saveCredentials = async (key, value) => {
    return await AsyncStorage.setItem(key, value);
}

export const getCredentials = async (key) => {
    return await AsyncStorage.getItem(key);
}

export const isFirstTime = async (value) => {
    return await AsyncStorage.setItem('isFirstTime', value)
}

export const getisFirstTime = async () => {
    try {
        await AsyncStorage.getItem('isFirstTime').then((value) => {
            return value
        });
    } catch (e) {
        return "Error"
    }
}
