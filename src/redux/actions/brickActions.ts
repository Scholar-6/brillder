import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';
import { Brick } from 'model/brick';

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
    return axios.get(process.env.REACT_APP_BACKEND_HOST + '/brick/' + id, {withCredentials: true})
      .then((res) => {
        dispatch(fetchBrickSuccess(res.data));
      })
      .catch(error => {
        dispatch(fetchBrickFailure(error.message));
      });
  }
}

const saveBrickSuccess = (brick: Brick) => {
  return {
    type: types.SAVE_BRICK_SUCCESS,
    payload: brick,
  } as Action
}

const saveBrickFailure = (errorMessage:string) => {
  return {
    type: types.SAVE_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const saveBrick = (brick:any) => {
  return function (dispatch: Dispatch) {
    brick.type = 1;
    return axios.put(
      process.env.REACT_APP_BACKEND_HOST + '/brick', brick, {withCredentials: true}
    ).then(response => {
      const brick = response.data as Brick;
      dispatch(saveBrickSuccess(brick));
      return brick;
    }).catch(error => {
      dispatch(saveBrickFailure(error.message))
    });
  }
}

const forgetBrick = () => {
  return function (dispatch: Dispatch) {
    dispatch({ type: types.FORGET_BRICK })
  }
}

const createBrickSuccess = (brick: Brick) => {
  return {
    type: types.CREATE_BRICK_SUCCESS,
    payload: brick,
  } as Action
}

const createBrickFailure = (errorMessage:string) => {
  return {
    type: types.CREATE_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const createBrick = (brick:any) => {
  return function (dispatch: Dispatch) {
    brick.type = 1;
    return axios.post(process.env.REACT_APP_BACKEND_HOST + '/brick', brick, {withCredentials: true}).then(response => {
      const brick = response.data as Brick;
      dispatch(createBrickSuccess(brick));
    })
    .catch(error => {
      dispatch(createBrickFailure(error.message))
    });
  }
}

export default { fetchBrick, createBrick, saveBrick, forgetBrick }
