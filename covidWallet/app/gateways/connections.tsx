import {
  analytics_log_accept_connection_request,
  analytics_log_reject_connection_request,
} from '../helpers/analytics';
import {AuthenticateUser} from '../helpers/Authenticate';
import http_client from './http_client';

async function getToken() {
  let resp = await AuthenticateUser();
  if (resp.success) {
    return resp.token;
  } else {
    return '';
  }
}

// Get All Connections
export async function get_all_connections() {
  try {
    const result = await http_client({
      method: 'GET',
      url: '/api/connection/get_all_connections',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// Accept Connection
export async function accept_connection(metadata: string) {
  try {
    let baseURL = 'https://trinsic.studio/url/';
    let obj = {
      inviteUrl: baseURL + metadata,
    };

    let headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await getToken()),
    };

    const result = await http_client({
      method: 'POST',
      url: '/api/connection/accept_connection',
      data: obj,
      headers,
    });

    // Google Analytics
    analytics_log_accept_connection_request();

    return result;
  } catch (error) {
    throw error;
  }
}

// Delete Connection
export async function delete_connection(connectionId: string) {
  try {
    let obj = {
      connectionId,
    };

    let headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await getToken()),
    };

    const result = await http_client({
      method: 'POST',
      url: '/api/connection/delete_connection',
      data: obj,
      headers,
    });

    // Google Analytics
    analytics_log_reject_connection_request();

    return result;
  } catch (error) {
    throw error;
  }
}
