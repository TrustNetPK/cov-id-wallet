import {get_all_qr_credentials} from '../gateways/credentials';
import {addVerificationToActionList} from './ActionList';

// Function to fetch connection and credentials
export const _fetchingAppData = async (isConnected) => {
  try {
    if (isConnected == undefined || isConnected == false) isConnected = false;

    if (isConnected) {
      await get_all_qr_credentials();
      await addVerificationToActionList();
    } else {
      console.log('Network is not connected');
    }
  } catch (error) {
    console.log('Error while fetching App Data => ', error);
  }
};
