import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';


const fetchBricksSuccess = (data:any) => {
  return {
    type: types.FETCH_BRICKS_SUCCESS,
    payload: data
  } as Action
}

const fetchBricksFailure = (errorMessage:string) => {
  return {
    type: types.FETCH_BRICKS_FAILURE,
    error: errorMessage
  } as Action
}

const fetchBricks = () => {
  return function (dispatch: Dispatch) {
    return axios.get(process.env.REACT_APP_BACKEND_HOST + '/bricks', {withCredentials: true})
      .then((res) => {
        dispatch(fetchBricksSuccess(res.data));
      })
      .catch(error => {
        dispatch(fetchBricksFailure(error.message));
      });
  }
}

export default {
  fetchBricks
}
