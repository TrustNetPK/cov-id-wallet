import { useEffect, useState, useContext } from "react";
import { get_all_credentials } from "../gateways/credentials";
import { getItem, saveItem } from "../helpers/Storage";
import ConstantsList from '../helpers/ConfigApp';

const useCredentials = (isCredential) => {

    const [credentials, setCredentials] = useState([]);

    const updateCredentialsList = async () => {
        try {
            // Getting item from asyncstorage
            let connections = await getItem(ConstantsList.CONNECTIONS);
            let credentials = await getItem(ConstantsList.CREDENTIALS);

            // Parsing JSON
            let connectionsList = JSON.parse(connections) || [];
            let credentialsList = JSON.parse(credentials) || [];

            // If arr is empty, return
            if (connectionsList.length === 0 || credentialsList.length === 0) {
                return
            }

            // Looping to get values from crendentials array
            credentialsList.forEach((cred, i) => {
                let item = connectionsList.find(c => c.connectionId == cred.connectionId)
                credentialsList[i].imageUrl = item.imageUrl
                credentialsList[i].organizationName = item.name
                if (!credentialsList[i].hasOwnProperty('type')) {
                    credentialsList[i].type = "Digital Certificate"
                }
            });

            // Set data
            setCredentials(credentialsList);
        } catch (e) {
            console.log('error: updateCredentialList => ', e)
        }
    }


    useEffect(() => {

        updateCredentialsList();

        const ls_updateCredentials = async () => {
            try {
                let result = await get_all_credentials();
                if (result.data.success) {
                    let credArr = result.data.credentials;
                    await saveItem(ConstantsList.CREDENTIALS, JSON.stringify(credArr));
                    updateCredentialsList();
                } else {
                    showMessage('ZADA Wallet', result.data.message);
                }
            } catch (e) {
                console.log(e);
            }
        }

        if (isCredential) ls_updateCredentials();

    }, [isCredential]);

    return { credentials };
};
export default useCredentials;