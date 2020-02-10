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
      dispatch(loginSuccess());
    })
    .catch(error => {
      dispatch(loginFailure(error.message))
    })
  }
}

export default { login }
