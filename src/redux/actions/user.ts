import axios from 'axios';
import { User } from 'model/user';
import { Action, Dispatch } from 'redux';

import types from '../types';
import { socketLogin } from './socket';


const getUserSuccess = (user: any) => {
    return {
      type: types.GET_USER_SUCCESS,
      user
    } as Action
  }
  
  const getUserFailure = (errorMessage:string) => {
    return {
      type: types.GET_USER_FAILURE,
      error: errorMessage
    } as Action
  }

const getUser = () => {
  return function (dispatch: Dispatch) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_HOST}/user/current`,
      {withCredentials: true}
    ).then(response => {
      const {data} = response;
      dispatch(getUserSuccess(data));
      dispatch(socketLogin(data.id));
      return data;
    }).catch(error => {
      dispatch(getUserFailure(error.message));
    });
  }
}

const setUser = (user: User) => {
  return getUserSuccess(user);
}

export default { getUser, setUser }
