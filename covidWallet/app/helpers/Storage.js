import ConstantsList from '../helpers/ConfigApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {delete_credential, get_all_credentials} from '../gateways/credentials';
import {delete_connection} from '../gateways/connections';
import {showMessage} from './Toast';
import {delete_credential_from_groups} from './Credential_Groups';

export const savePassCode = async (PassCode) => {
  return await AsyncStorage.setItem('@passCode', PassCode);
};

export const getPassCode = async () => {
  try {
    const value = await AsyncStorage.getItem('@passCode');
    if (value !== null) {
    }
  } catch (e) {
    // error reading value
  }
};

export const saveItem = async (key, value) => {
  return await AsyncStorage.setItem(key, value);
};

export const getItem = async (key) => {
  return (value = await AsyncStorage.getItem(key));
};

// Add Connection
export const ls_addConnection = async (new_conn) => {
  let conns = [];
  let connectionsdata = await getItem(ConstantsList.CONNECTIONS);
  if (connectionsdata == null) {
    conns = conns.concat(new_conn);
  } else {
    try {
      conns = JSON.parse(connectionsdata);
      conns = conns.concat(new_conn);
    } catch (e) {
      conns = [];
    }
  }
  await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(conns));
};

// Add Credential
export const ls_addCredential = async (new_cred) => {
  let cred = [];

  let credentialsdata = JSON.parse(
    (await getItem(ConstantsList.CREDENTIALS)) || [],
  );
  let connectionsList = JSON.parse(
    (await getItem(ConstantsList.CONNECTIONS)) || [],
  );

  if (connectionsList.length === 0) return;

  if (credentialsdata.length === 0) {
    cred = cred.concat(new_cred);
  } else {
    cred.forEach((cred, i) => {
      let item = connectionsList.find(
        (c) => c.connectionId == cred.connectionId,
      );
      credentialsList[i].imageUrl = item.imageUrl;
      credentialsList[i].organizationName = item.name;
    });
  }
  await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(cred));
};

export const ls_updateCredentials = async () => {
  try {
    let result = await get_all_credentials();
    if (result.data.success) {
      let credArr = result.data.credentials;
      await saveItem(ConstantsList.CREDENTIALS, JSON.stringify(credArr));
    } else {
      showMessage('ZADA Wallet', result.data.message);
    }
  } catch (e) {
    throw e;
  }
};

// Delete action by Connection ID.
export const deleteActionByConnId = async (key, connID) => {
  console.log('key, connID', key, connID);
  return getItem(key).then((action) => {
    let QRJsonList = JSON.parse(action);

    let newQRList = [];
    QRJsonList.forEach((element) => {
      console.log('element', element);
      if (element.credentialId != connID) {
        newQRList.push(element);
      }
    });
    saveItem(key, JSON.stringify(newQRList))
      .then((action) => {})
      .catch((error) => {
        console.log('error', error);
      });

    return newQRList.length;
  });
};

// Delete action by Credential ID.
export const deleteActionByCredId = async (key, credentialId) => {
  return getItem(key).then((action) => {
    let QRJsonList = JSON.parse(action);
    let newQRList = [];
    QRJsonList.forEach((element) => {
      if (element.credentialId != credentialId) {
        newQRList.push(element);
      }
    });
    saveItem(key, JSON.stringify(newQRList)).then((action) => {});
    return newQRList.length;
  });
};

// Delete action by verification ID.
export const deleteActionByVerID = async (verificationId) => {
  let verification_request = JSON.parse(
    (await getItem(ConstantsList.VER_REQ)) || null,
  );

  verification_request = verification_request.filter((c) => {
    return c.verificationId != verificationId;
  });

  await saveItem(ConstantsList.VER_REQ, JSON.stringify(verification_request));
};

// Delete Credential by credential ID.
export const deleteCredentialByCredId = async (credentialId) => {
  let credentials = await getItem(ConstantsList.CREDENTIALS);
  let credentialsArr = JSON.parse(credentials);

  credentialsArr = credentialsArr.filter((c) => {
    return c.credentialId != credentialId;
  });

  await saveItem(ConstantsList.CREDENTIALS, JSON.stringify(credentialsArr));
  await delete_credential_from_groups(credentialId);
};

// Delete Connection and Credential by connection ID.
export const deleteConnAndCredByConnectionID = async (connectionId) => {
  // Getting Credentials Array
  let credentials = await getItem(ConstantsList.CREDENTIALS);
  let credentialsArr = JSON.parse(credentials);

  // Getting Connections Array
  let connections = await getItem(ConstantsList.CONNECTIONS);
  let connectionsArr = JSON.parse(connections);

  for (let i = 0; i < credentialsArr.length; ++i) {
    if (credentialsArr[i].connectionId == connectionId) {
      await delete_credential(credentialsArr[i].credentialId);
      await delete_credential_from_groups(credentialsArr[i].credentialId);
    }
  }

  credentialsArr = credentialsArr.filter((c) => {
    return c.connectionId != connectionId;
  });

  connectionsArr = connectionsArr.filter((c) => {
    return c.connectionId != connectionId;
  });

  // Deleting Connection from DB
  await delete_connection(connectionId);

  await saveItem(ConstantsList.CREDENTIALS, JSON.stringify(credentialsArr));

  await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(connectionsArr));
};

export const deleteActionByConnectionID = async (connectionId) => {
  // Get Connection Request
  let connection_request = JSON.parse(
    (await getItem(ConstantsList.CONN_REQ)) || null,
  );

  // If connection_request available
  if (connection_request != null) {
    connection_request = connection_request.filter(
      (item) => item.connectionId != connectionId,
    );
    await saveItem(ConstantsList.CONN_REQ, JSON.stringify(connection_request));
  }

  // Get Credential Offers
  let credential_offer = JSON.parse(
    (await getItem(ConstantsList.CRED_OFFER)) || null,
  );

  // If credential_offer available
  if (credential_offer != null) {
    credential_offer = credential_offer.filter(
      (item) => item.connectionId != connectionId,
    );
    await saveItem(ConstantsList.CRED_OFFER, JSON.stringify(credential_offer));
  }

  // Get verification Offers
  let verification_offers = JSON.parse(
    (await getItem(ConstantsList.VER_REQ)) || null,
  );

  // If credential_offer available
  if (verification_offers != null) {
    verification_offers = verification_offers.filter(
      (item) => item.connectionId != connectionId,
    );
    await saveItem(ConstantsList.VER_REQ, JSON.stringify(verification_offers));
  }
};

// Search Connection by Organization Name.
export const searchConnectionByOrganizationName = async (organizationName) => {
  let connections = JSON.parse(
    (await getItem(ConstantsList.CONNECTIONS)) || null,
  );

  if (connections == null) return;

  let obj = connections.find((e) => e.name == organizationName);

  return obj;
};

export const isFirstTime = async (value) => {
  return await AsyncStorage.setItem('isFirstTime', value);
};

export const getisFirstTime = async () => {
  try {
    await AsyncStorage.getItem('isFirstTime').then((value) => {
      return value;
    });
  } catch (e) {
    return 'Error';
  }
};
