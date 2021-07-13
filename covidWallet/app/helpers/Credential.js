import React, { useContext, useEffect } from 'react';
import { showMessage } from './Toast';
import { AuthenticateUser } from './Authenticate';
import ConstantsList from './ConfigApp';
import { getItem, saveItem } from './Storage';
import { get_credential } from '../gateways/credentials';

export const addCredentialToActionList = async (credentialID) => {
  let resp = await AuthenticateUser();
  let cred_arr = [];
  let cred_arr_archive = await getItem(ConstantsList.CRED_REQ);
  console.log(cred_arr_archive);
  if (cred_arr_archive !== null) {
    cred_arr = JSON.parse(cred_arr_archive);
  }

  if (ifExist(cred_arr, credentialID)) {
    return
  }

  if (resp.success) {
    try {
      let result = await get_credential(credentialID);
      if (result.data.success) {
        let obj = result.data.credential;
        obj['type'] = ConstantsList.CRED_REQ;
        cred_arr.push(obj);
        console.log('cred_arr => ', cred_arr);
        saveItem(ConstantsList.CRED_REQ, JSON.stringify(cred_arr)).then(
          () => {
            return result.data;
          },
        );
      } else {
        return result.data;
      }
    } catch (e) {
      console.log(e);
    }
  }
  else {
    showMessage('ZADA Wallet', resp.message);
  }
  //   return await fetch(
  //     ConstantsList.BASE_URL +
  //     '/api/credential/get_credential' +
  //     `?credentialId=${credentialID}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer ' + resp.token,
  //       },
  //     },
  //   ).then((credential) =>
  //     credential.json().then((data) => {
  //       console.log('data => ', data);
  //       if (data.success == false) {
  //         return data;
  //       } else if (data.success == true) {
  //         let obj = data.credential;
  //         obj['type'] = ConstantsList.CRED_REQ;
  //         cred_arr.push(obj);
  //         console.log('cred_arr => ', cred_arr);
  //         saveItem(ConstantsList.CRED_REQ, JSON.stringify(cred_arr)).then(
  //           () => {
  //             return data;
  //           },
  //         );
  //       } else {
  //         return data;
  //       }
  //     }),
  //   );
  // } else {
  //   showMessage('ZADA Wallet', resp.message);
  // }
};


function ifExist(arr, credentialID) {
  let exist = false;
  arr.forEach(e => {
    if (e.credentialId == credentialID) {
      exist = true;
    }
  })

  return exist
}