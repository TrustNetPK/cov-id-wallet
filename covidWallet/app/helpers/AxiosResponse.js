import { _showAlert } from "./Toast";

export const _handleAxiosError = (error, ownMessage, showAlert) => {
    if (showAlert == undefined || showAlert == true)
        showAlert = true;

    if (error.response) {
        _showAlert('ZADA Wallet', error.response.data.error);
    } else {
        if (showAlert)
            _showAlert('ZADA Wallet', ownMessage ? ownMessage : 'Something is going wrong, please try again later');
        else
            console.log("ERROR =>", error);
    }
}