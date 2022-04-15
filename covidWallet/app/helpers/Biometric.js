import {AlertIOS, Alert} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

export async function biometricVerification() {
  // FingerprintScanner.isSensorAvailable()
  //   .then((biometryType) => {
  //     console.log('***** biometric found --- ', biometryType);
  //     FingerprintScanner.authenticate({
  //       title: 'Log in with Secure ID to continue',
  //     })
  //       .then((res) => {
  //         return res;
  //       })
  //       .catch((error) => {
  //         return false;
  //       });
  //   })
  //   .catch((error) => {
  //     console.log('****** biometric not found --- ', error);
  //     return false;
  //   });

  try {
    let isAvailable = await FingerprintScanner.isSensorAvailable();

    if (!isAvailable) return false;
  } catch (e) {
    return false;
  }

  FingerprintScanner.release();

  try {
    let result = await FingerprintScanner.authenticate({
      title: 'Log in with Secure ID to continue',
    });
    return result;
  } catch (e) {
    return false;
  }
}
