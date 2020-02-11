import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';
import host from '../../hostname';

const loginSuccess = () => {
  return {
    type: types.LOGIN_SUCCESS,
  } as Action
}

const loginFailure = (errorMessage:string) => {
  return {
    type: types.LOGIN_FAILURE,
    error: errorMessage
  } as Action
}

const login = (model:any) => {
  return function (dispatch: Dispatch) {
    return axios.post(host.BACKEND_HOST + '/auth/login', model, {withCredentials: true}).then(response => {
      const {data} = response;
      if (data == "OK") {
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
      dispatch(loginFailure(error.message))
    })
  }
}

const logoutSuccess = () => {
  return {
    type: types.LOGOUT_SUCCESS,
  } as Action
}

const logout = () => {
  return function (dispatch: Dispatch) {
    dispatch(logoutSuccess());
  }
}

export default { login, logout }
