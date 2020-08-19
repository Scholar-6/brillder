import types from '../types';
import { Action, Dispatch } from 'redux';


const requestFailed = (error?: string) => {
  return function (dispatch: Dispatch) {
    dispatch({
      type: types.REQUEST_FAILED,
      error
    } as Action);
  }
}

const forgetFailture = () => {
  return function (dispatch: Dispatch) {
    dispatch({ type: types.REQUEST_FAILTURE_FORGOTTEN } as Action);
  }
}

export default {
  requestFailed,
  forgetFailture
}
