import http_client from './http_client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthenticateUser} from '../helpers/Authenticate';
import {
  analytics_log_register_success,
  analytics_log_verifies_otp,
} from '../helpers/analytics';

async function getToken() {
  let resp = await AuthenticateUser();
  if (resp.success) {
    return resp.token;
  } else {
    return '';
  }
}

// Login Api
export async function login(email: string, password: string) {
  // let fd = new FormData();
  // fd.append('email', email);
  // fd.append('password', password);
  // try {
  //   const result = await http_client({
  //     method: 'POST',
  //     url: 'login',
  //     data: fd,
  //   });
  //   return result;
  // } catch (error) {
  //   console.log('error => ', error);
  //   alert(error.response.data.message);
  // }
}

// register user api
export const _resgiterUserAPI = async (data: Object) => {
  try {
    const result = await http_client({
      method: 'POST',
      url: '/api/register',
      data: data,
    });

    analytics_log_register_success();

    return result;
  } catch (error) {
    throw error;
  }
};

// resend otp code api
export const _resendOTPAPI = async (userID: string, type: string) => {
  try {
    const result = await http_client({
      method: 'POST',
      url: '/api/resend_codes',
      data: {
        userId: userID,
        type: type,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// Send password reset link
export const _sendPasswordResetAPI = async (phone: string) => {
  try {
    const result = await http_client({
      method: 'POST',
      url: '/api/recover',
      data: {
        phone,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// api to fetch user profile data
export const _fetchProfileAPI = async () => {
  try {
    const token = await getToken();
    const result = await http_client({
      method: 'GET',
      url: '/api/get_user_data',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// api to update user profile
export const _updateProfileAPI = async (data: Object) => {
  try {
    const token = await getToken();
    const result = await http_client({
      method: 'POST',
      url: '/api/update_user',
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// Validate OTP
export async function validateOTP(
  phoneConfirmationCode: string,
  //emailConfirmationCode: string,
  userId: string,
) {
  try {
    let obj = {
      otpsms: phoneConfirmationCode,
      //otpmail: emailConfirmationCode,
      userId: userId,
    };

    let headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await getToken()),
    };

    const result = await http_client({
      method: 'POST',
      url: '/api/validateOTPs',
      data: obj,
      headers,
    });

    analytics_log_verifies_otp();

    return result;
  } catch (error) {
    throw error;
  }
}

// Register device token.
export async function registerDeviceToken(
  devicePlatform: string,
  devicePushToken: string,
) {
  try {
    let obj = {
      platform: devicePlatform,
      deviceToken: devicePushToken,
    };

    let headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await getToken()),
    };

    const result = await http_client({
      method: 'POST',
      url: '/api/enableNotifications',
      data: obj,
      headers,
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// // Register Api
// export async function register(
//   email: string,
//   name: string,
//   login_id: string,
// ) {
//   let fd = new FormData();
//   fd.append('email', email);
//   fd.append('name', name);
//   fd.append('login_id', login_id);
//   try {
//     const result = await http_client({
//       method: 'POST',
//       url: 'register',
//       data: fd,
//     });
//     return result;
//   } catch (error) {
//     alert(error.response.data.message);
//   }
// }
