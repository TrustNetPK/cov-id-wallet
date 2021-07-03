import { showMessage } from '../helpers/Toast';
import { AuthenticateUser } from '../helpers/Authenticate'
import ConstantsList from '../helpers/ConfigApp';
import {
    getItem,
    saveItem
} from '../helpers/Storage';

export const addCredentialToActionList = async (credentialID) => {
    let resp = await AuthenticateUser();
    let cred_arr = [];
    let cred_arr_archive = await getItem(ConstantsList.CRED_REQ);
    console.log(cred_arr_archive)
    if (cred_arr_archive !== null) {
        cred_arr = JSON.parse(cred_arr_archive);
    }
    if (resp.success) {
        return await fetch(
            ConstantsList.BASE_URL +
            '/api/credential/get_credential' +
            `?credentialId=${credentialID}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + resp.token,
                },
            },
        ).then((credential) =>
            credential.json().then((data) => {
                console.log(data);
                if (data.success == false) {
                    return data;
                } else if (data.success == true) {
                    cred_arr.push(data.credential);
                    saveItem(ConstantsList.CRED_REQ, JSON.stringify(cred_arr))
                        .then(() => {
                            return data;
                        });
                } else {
                    return data;
                }
            }),
        );
    } else {
        showMessage('ZADA Wallet', resp.message);
    }
};