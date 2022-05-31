
import analytics from '@react-native-firebase/analytics';

export const analytics_log_action_screen = async () => {
    await analytics().logEvent('Action_Screen')
}

export const analytics_log_connection_request = async () => {
    await analytics().logEvent('Connection_Request')
}

export const analytics_log_accept_connection_request = async () => {
    await analytics().logEvent('Connection_Accepted')
}

export const analytics_log_reject_connection_request = async () => {
    await analytics().logEvent('Connection_Rejected')
}

export const analytics_log_accept_credential_request = async () => {
    await analytics().logEvent('Certificate_Accepted')
}

export const analytics_log_reject_credential_request = async () => {
    await analytics().logEvent('Certificate_Rejected')
}

export const analytics_log_accept_verification_request = async () => {
    await analytics().logEvent('Verification_Accepted')
}

export const analytics_log_reject_verification_request = async () => {
    await analytics().logEvent('Verification_Rejected')
}

export const analytics_log_submit_connectionless_verification_request = async () => {
    await analytics().logEvent('Submit_Connectionless_Verification')
}


export const analytics_log_login_success = async () => {
    await analytics().logEvent('Login_Sucess')
}

export const analytics_log_register_success = async () => {
    await analytics().logEvent('Register_Sucess')
}

export const analytics_log_verifies_otp = async () => {
    await analytics().logEvent('Verifies_OTP')
}

export const analytics_log_logout = async () => {
    await analytics().logEvent('Logout')
}

export const analytics_log_connection_delete = async () => {
    await analytics().logEvent('Connection_Delete')
}

export const analytics_log_credential_delete = async () => {
    await analytics().logEvent('Credential_Delete')
}

export const analytics_log_reset_password = async () => {
    await analytics().logEvent('Reset_Password')
}

export const analytics_log_show_cred_qr = async () => {
    await analytics().logEvent('Showing_Credential_QR')
}

export const analytics_log_verify_cred_qr = async () => {
    await analytics().logEvent('Verifying_Credential_QR')
}

export const analytics_log_verified_credential = async () => {
    await analytics().logEvent('QR_Credential_Verified')
}

export const analytics_log_unverified_credential = async () => {
    await analytics().logEvent('QR_Credential_Unverified')
}

export const analytics_log_app_error = async (stackTrace) => {
    await analytics().logEvent('APP_ERROR', { stackTrace: stackTrace })
}