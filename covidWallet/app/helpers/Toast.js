import {
    ToastAndroid,
    Platform,
    Alert,
} from 'react-native';


function showMessage(title, message) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT,
        );
    } else {
        Alert.alert(title, message);
    }
}

module.exports = {
    showMessage
}