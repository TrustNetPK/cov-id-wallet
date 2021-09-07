import { ToastAndroid, Platform, Alert } from 'react-native';

export function showMessage(title, message) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(title, message);
  }
}

export function _showAlert(title, message) {
  Alert.alert(title, message);
}

export function showAskDialog(title, message, onSuccessPress, onRejectPress) {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: () => onRejectPress(),
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => onSuccessPress(),
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
