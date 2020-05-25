import axios from 'axios';

import { User, UserType, UserStatus } from 'model/user';


export function activateUser(userId: number, callback: Function, error: Function) {
  axios.put(
    `${process.env.REACT_APP_BACKEND_HOST}/user/activate/${userId}`, {}, {withCredentials: true} as any
  ).then(res => {
    if (res.data === 'OK') {
      callback(res);
    } else {
      error(res);
    }
  }).catch(error => { 
    error(error);
  });
}