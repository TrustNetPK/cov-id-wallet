import { AlertIOS, Alert } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

export async function biometricVerification(callback) {
    let isAvailable = await FingerprintScanner
        .isSensorAvailable()

    if (!isAvailable) return

    FingerprintScanner.release();
    try {
        let result = await FingerprintScanner
            .authenticate({ title: 'Log in with Secure ID to continue' })
        return result
    } catch (e) {
        return false
    }



}