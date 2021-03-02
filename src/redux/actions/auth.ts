import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';


import {LoginModel} from 'model/auth';
import { socketLogout } from './socket';
import notificationActions from './notifications';
import { enableTracking } from 'services/matomo';

const loginSuccess = () => {
  enableTracking();
  return { type: types.LOGIN_SUCCESS } as Action
}

const loginFailure = (errorMessage:string) => {
  return {
    type: types.LOGIN_FAILURE,
    error: errorMessage
  } as Action
}

const login = (model:LoginModel) => {
  return function (dispatch: Dispatch) {
    return axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/auth/login/3`,
      model, {withCredentials: true}
    ).then(response => {
      const {data} = response;
      if (data === "OK") {
        dispatch(loginSuccess());
        return;
      }
      let {msg} = data;
      if (!msg) {
        const {errors} = data;
        msg = errors[0].msg
      }
      alert(msg);
      dispatch(loginFailure(msg))
    })
    .catch(error => {
      dispatch(loginFailure(error.message));
    })
  }
}

const logoutSuccess = () => {
  return {
    type: types.LOGOUT_SUCCESS,
  } as Action
}

const logoutFailure = (errorMessage:string) => {
  return {
    type: types.LOGOUT_FAILURE,
    error: errorMessage
  } as Action
}

const authorizedSuccess = () => {
  return {
    type: types.AUTHORIZED_SUCCESS
  } as Action;
}

const authorizedFailure = (errorMessage:string) => {
  return {
    type: types.AUTHORIZED_FAILURE,
    error: errorMessage
  } as Action;
}

const setLogoutSuccess = () => {
  return function (dispatch: Dispatch) {
    dispatch(logoutSuccess());
  }
}

const logout = () => {
  return function (dispatch: Dispatch) {
    return axios.post(process.env.REACT_APP_BACKEND_HOST + '/auth/logout', {}, {withCredentials: true}).then(response => {
      const {data} = response;
      if (data === "OK") {
        dispatch(logoutSuccess());
        dispatch(socketLogout());
        dispatch(notificationActions.notificationReset());
        return;
      }
      let {msg} = data;
      if (!msg) {
        const {errors} = data;
        msg = errors[0].msg
      }
      alert(msg);
      dispatch(logoutFailure(msg))
    })
    .catch(error => {
      dispatch(logoutFailure(error.message))
    })
  }
} 

const isAuthorized = () => {
  return async function (dispatch: Dispatch) {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_HOST + '/auth/check', { withCredentials: true });
      if (response.status === 200 && response.data === "OK") {
        dispatch(authorizedSuccess());
      } else {
        dispatch(authorizedFailure('Something wrong in response'));
      }
    } catch (error) {
      dispatch(authorizedFailure(error.message));
    }
  }
}

const redirectedToProfile = () => {
  return function (dispatch: Dispatch) {
    dispatch({type: types.AUTH_PROFILE_REDIRECT} as Action);
  }
}


export default { login, logout, loginSuccess, setLogoutSuccess, isAuthorized, redirectedToProfile }
