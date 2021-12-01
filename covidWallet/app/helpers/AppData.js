import { get_all_connections } from "../gateways/connections";
import { saveItem } from "./Storage";
import ConstantsList from '../helpers/ConfigApp';
import { fetch_signature_by_cred_id, get_all_credentials } from '../gateways/credentials';
import { addVerificationToActionList } from './ActionList';

// Function to fetch connection and credentials
export const _fetchingAppData = async (isConnected) => {

    if (isConnected == undefined || isConnected == false)
        isConnected = false;

    if (isConnected) {
        // Fetching Connections
        const connResponse = await get_all_connections();

        // If connections are available
        if (connResponse.data.success) {
            let connections = connResponse.data.connections;
            if (connections.length)
                await saveItem(ConstantsList.CONNECTIONS, JSON.stringify(connections));
            else
                await saveItem(ConstantsList.CONNECTIONS, JSON.stringify([]));

            // Fetching Credentials
            const credResponse = await get_all_credentials();
            let credentials = credResponse.data.credentials;
            let CredArr = [];
            if (credentials.length && connections.length) {

                for (let i = 0; i < credentials.length; ++i) {
                    let cred = credentials[i];
                    let item = connections.find(c => c.connectionId == cred.connectionId)
                    let qrResult = await fetch_signature_by_cred_id(cred.credentialId, cred.values);
                    if (item !== undefined || null) {
                        let obj = {
                            ...cred,
                            imageUrl: item.imageUrl,
                            organizationName: item.name,
                            qrCode: qrResult.success ? qrResult.qrcode : undefined,
                            type: (cred.values != undefined && cred.values.type != undefined) ? cred.values.type :
                                (
                                    (cred.values != undefined || cred.values != null) &&
                                    cred.values["Vaccine Name"] != undefined &&
                                    cred.values["Vaccine Name"].length != 0 &&
                                    cred.values["Dose"] != undefined &&
                                    cred.values["Dose"].length != 0
                                ) ?
                                    'COVIDpass (Vaccination)' :
                                    "Digital Certificate",
                        };
                        CredArr.push(obj);
                    }
                }
                await saveItem(ConstantsList.CREDENTIALS, JSON.stringify(CredArr));
            }
            else
                await saveItem(ConstantsList.CREDENTIALS, JSON.stringify([]));

            await addVerificationToActionList();
        }
    }
    else {
        console.log('Network is not connected');
    }


}