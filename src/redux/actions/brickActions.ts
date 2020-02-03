import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';
import host from '../../hostname';

const fetchBrickSuccess = (data:any) => {
  return {
    type: types.FETCH_BRICK_SUCCESS,
    payload: data
  } as Action
}

const fetchBrickFailure = (errorMessage:string) => {
  return {
    type: types.FETCH_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const fetchBrick = (id: number) => {
  return function (dispatch: Dispatch) {
    return axios.get(host.BACKEND_HOST + '/brick/' + id)
      .then((res) => {
        dispatch(fetchBrickSuccess(res.data));
      })
      .catch(error => {
        dispatch(fetchBrickFailure(error.message));
      });
  }
}

export default { fetchBrick }
