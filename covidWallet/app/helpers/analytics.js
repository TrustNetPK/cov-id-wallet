
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
