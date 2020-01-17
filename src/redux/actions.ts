import types from './types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';

const fetchUsernameSuccess = (username:string) => {
  return {
    type: types.FETCH_USERNAME_SUCCESS,
    payload: username
  } as Action
}

const fetchUsernameFailure = (errorMessage:string) => {
  return {
    type: types.FETCH_USERNAME_FAILURE,
    error: errorMessage
  } as Action
}

const fetchUsername = () => {
  return function (dispatch: Dispatch) {
    return axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        // hardcode username for now
        dispatch(fetchUsernameSuccess('Joe'));
      })
      .catch(error => {
        dispatch(fetchUsernameFailure(error.message));
      });
  }
}

function createBrick() {
  return {
    type: types.CREATE_BRICK
  };
}

export default {
  createBrick,
  fetchUsername
}
