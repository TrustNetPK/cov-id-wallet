import AsyncStorage from '@react-native-community/async-storage';
import ConstantsList from '../helpers/ConfigApp';

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

export const saveItem = async (key, value) => {
    return await AsyncStorage.setItem(key, value);
}

export const getItem = async (key) => {
    return await AsyncStorage.getItem(key);
}

export const deleteActionByConnId = async (key, connID) => {
    return getItem(key).then((action) => {
        let QRJsonList = JSON.parse(action);

        let newQRList = []
        QRJsonList.forEach(element => {
            if (element.invitation.connection_id != connID) {
                newQRList.push(element)
            }
        });
        saveItem(key, JSON.stringify(newQRList)).then((action) => {
        })
        return newQRList.length
    })


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
