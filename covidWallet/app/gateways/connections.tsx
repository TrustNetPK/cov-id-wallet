import axios from 'axios';
import {
  analytics_log_accept_connection_request,
  analytics_log_reject_connection_request,
} from '../helpers/analytics';
import {AuthenticateUser, authenticateZadaAuth} from '../helpers/Authenticate';
import {getItem, saveItem} from '../helpers/Storage';
import http_client from './http_client';
import ConstantsList, {ZADA_AUTH_URL} from '../helpers/ConfigApp';

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

export async function get_all_connections_for_screen() {
  try {
    let result = await get_all_connections();
    if (result.data.success) {
      let connectionsList = result.data.connections;
      if (connectionsList.length > 0) {
        await saveItem(
          ConstantsList.CONNECTIONS,
          JSON.stringify(connectionsList),
        );
      } else {
        await saveItem(ConstantsList.CONNECTIONS, JSON.stringify([]));
      }
    } else {
      throw result.data.error;
    }
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

/********** HANDLING ZADA AUTH ***********/

const zadaAuthInstance = axios.create({
  baseURL: ZADA_AUTH_URL,
});

// add session
export async function add_session(userId: string, sessionId: string) {
  try {
    // Getting Token
    const tokenResult = await authenticateZadaAuth();

    if (tokenResult.success) {
      const result = await zadaAuthInstance({
        url: `/api/addSession`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
        },
        data: {
          userId,
          sessionId,
        },
      });
      return result;
    } else {
      throw tokenResult.error;
    }
  } catch (error) {
    throw error;
  }
}

// find auth Connection
export async function find_auth_connection(userId: string, tenantId: string) {
  try {
    // Getting Token
    const tokenResult = await authenticateZadaAuth();

    if (tokenResult.success) {
      const result = await zadaAuthInstance({
        url: `/api/findConnection`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
        },
        params: {
          userId,
          tenantId,
        },
      });
      return result;
    } else {
      throw tokenResult.error;
    }
  } catch (error) {
    throw error;
  }
}

// saving did in connections
export async function save_did(userId: string, tenantId: string, did: string) {
  try {
    // Getting Token
    const tokenResult = await authenticateZadaAuth();

    if (tokenResult.success) {
      const result = await zadaAuthInstance({
        url: `/api/saveDID`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
        },
        data: {
          userId,
          tenantId,
          did,
        },
      });
      return result;
    } else {
      throw tokenResult.error;
    }
  } catch (error) {
    throw error;
  }
}

export async function send_zada_auth_verification_request(did: string) {
  try {
    // Getting Token
    const tokenResult = await authenticateZadaAuth();

    if (tokenResult.success) {
      const result = await zadaAuthInstance({
        url: `/api/sendVerification`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
        },
        data: {
          did,
        },
      });
      return result;
    } else {
      throw tokenResult.error;
    }
  } catch (error) {
    throw error;
  }
}

export async function get_tenant(verification: any) {
  try {
    let connections: any = await getItem(ConstantsList.CONNECTIONS);

    if (connections == undefined || connections == null) {
      return {success: false, error: 'There are no connections in your wallet'};
    }

    let did = undefined;
    connections = JSON.parse(connections);

    connections.forEach((item: any, index: number) => {
      if (item.connectionId == verification.connectionId) did = item.myDid;
    });

    // Getting Token
    const tokenResult = await authenticateZadaAuth();

    if (tokenResult.success) {
      const tenant = await zadaAuthInstance({
        url: `/api/getTenant`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
        },
        params: {
          did: did,
        },
      });
      return {success: true, data: tenant.data.data};
    } else {
      return {success: false, error: tokenResult.error.toString()};
    }
  } catch (error: any) {
    return {success: false, error: error.toString()};
  }
}

export async function delete_mongo_connection(did: string) {
  try {
    // Getting Token
    const tokenResult = await authenticateZadaAuth();

    if (tokenResult.success) {
      const result = await zadaAuthInstance({
        url: `/api/deleteConnection`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
        },
        data: {
          did,
        },
      });
      return result;
    } else {
      throw tokenResult.error;
    }
  } catch (error) {
    throw error;
  }
}
