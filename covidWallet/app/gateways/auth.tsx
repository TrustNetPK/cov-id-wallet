import http_client from './http_client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthenticateUser} from '../helpers/Authenticate';

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

// Validate OTP
export async function validateOTP(
  phoneConfirmationCode: string,
  emailConfirmationCode: string,
  secret: string,
) {
  try {
    let obj = {
      otpsms: phoneConfirmationCode,
      otpmail: emailConfirmationCode,
      secretPhrase: secret,
    };
    console.log(obj);

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

    console.log(obj)

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
    console.log("RESULT => ", result.data);
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
