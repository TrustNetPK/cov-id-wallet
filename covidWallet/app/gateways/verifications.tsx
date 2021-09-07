import http_client from './http_client';
import {AuthenticateUser} from '../helpers/Authenticate';
import {
  analytics_log_accept_verification_request,
  analytics_log_reject_verification_request,
} from '../helpers/analytics';

async function getToken() {
  let resp = await AuthenticateUser();
  if (resp.success) {
    return resp.token;
  } else {
    return '';
  }
}

// Get All Verification Proposals API
export async function get_all_verification_proposals() {
  try {
    const result = await http_client({
      method: 'GET',
      url: '/api/credential/get_all_verification_proposals',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// Get All Credentials for Verification Proposals API
export async function get_all_credentials_for_verification(
  verificationId: string,
) {
  try {
    let obj = {
      verificationId,
    };

    const result = await http_client({
      method: 'GET',
      url: '/api/credential/get_all_credentials_for_verification',
      params: obj,
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// Delete Verification
export async function delete_verification(verificationId: string) {
  try {
    let obj = {
      verificationId,
    };

    let headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await getToken()),
    };

    const result = await http_client({
      method: 'POST',
      url: '/api/credential/delete_verification',
      data: obj,
      headers,
    });

    // Google Analytics
    analytics_log_reject_verification_request();

    return result;
  } catch (error) {
    throw error;
  }
}

// Delete Verification
export async function submit_verification(
  verificationId: string,
  credentialId: string,
  policyName: string,
) {
  try {
    let obj = {
      verificationId,
      credentialId,
      policyName,
    };

    let headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await getToken()),
    };

    const result = await http_client({
      method: 'POST',
      url: '/api/credential/submit_verification',
      data: obj,
      headers,
    });

    // Google Analytics
    analytics_log_accept_verification_request();

    return result;
  } catch (error) {
    throw error;
  }
}