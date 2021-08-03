import http_client from './http_client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthenticateUser} from '../helpers/Authenticate';
import {
  analytics_log_accept_credential_request,
  analytics_log_reject_credential_request,
} from '../helpers/analytics';

async function getToken() {
  let resp = await AuthenticateUser();
  if (resp.success) {
    return resp.token;
  } else {
    return '';
  }
}

// Get Specific Credential
export async function get_credential(credentialID: string) {
  try {
    const result = await http_client({
      method: 'GET',
      url: '/api/credential/get_credential' + `?credentialId=${credentialID}`,
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// Get All Crendentials API
export async function get_all_credentials() {
  try {
    const result = await http_client({
      method: 'GET',
      url: '/api/credential/get_all_credentials',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// Accept Crendentials API
export async function accept_credential(credentialId: string) {
  try {
    const params = new URLSearchParams();
    params.append('credentialId', credentialId);

    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + (await getToken()),
    };

    const result = await http_client({
      method: 'POST',
      url: '/api/credential/accept_credential',
      data: params,
      headers,
    });

    // Google Analytics
    analytics_log_accept_credential_request();

    return result;
  } catch (error) {
    throw error;
  }
}

// Delete Crendentials API
export async function delete_credential(credentialId: string) {
  try {
    const params = new URLSearchParams();
    params.append('credentialId', credentialId);

    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + (await getToken()),
    };

    const result = await http_client({
      method: 'POST',
      url: '/api/credential/delete_credential',
      data: params,
      headers,
    });

    // Google Analytics
    analytics_log_reject_credential_request();

    return result;
  } catch (error) {
    throw error;
  }
}
