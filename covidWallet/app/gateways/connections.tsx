import axios from 'axios';
import {
  analytics_log_accept_connection_request,
  analytics_log_reject_connection_request,
} from '../helpers/analytics';
import {AuthenticateUser} from '../helpers/Authenticate';
import { getItem } from '../helpers/Storage';
import http_client from './http_client';
import ConstantsList from '../helpers/ConfigApp';

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
    console.log("THROWING ERROR => ", error);
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

const ngInstance = axios.create({
  baseURL: `http://2836-110-93-246-171.ngrok.io`
})

// find auth Connection
export async function find_auth_connection(
  userId: string,
  tenantId: string
) {
  try {
    const result = await ngInstance({
      url: `/api/findConnection`,
      method: 'GET',
      params: {
        userId,
        tenantId,
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}

// saving did in connections
export async function save_did(
  userId: string,
  tenantId: string,
  did: string,
) {
  try {
    const result = await ngInstance({
      url: `/api/saveDID`,
      method: 'POST',
      data: {
        userId,
        tenantId,
        did,
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}

export async function send_zada_auth_verification_request(did: string) {
  try {
    
    console.log("DID =>", did);
    const result = await ngInstance({
      url: `/api/sendVerification`,
      method: 'POST',
      data: {
        did
      }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function get_tenant(verification:any){
  try {
    let connections:any = await getItem(ConstantsList.CONNECTIONS);

    if(connections == undefined || connections == null){
      return {success:false, error: 'There are no connections in your wallet'}
    }

    let did = undefined;
    connections = JSON.parse(connections);

    connections.forEach((item:any, index:number)=>{
      if(item.connectionId == verification.connectionId)
        did = item.myDid;
    });

    const tenant = await ngInstance({
      url: `/api/getTenant`,
      params:{
        did: did,
      }
    });

    return {success: true, data: tenant.data.data};

  } catch (error:any) {
    return {success: false, error: error.toString()};
  }
}
