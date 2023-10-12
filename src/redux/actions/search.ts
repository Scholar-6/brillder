import types from '../types';
import { Action, Dispatch } from 'redux';

const clearSearch = () => {
  return function (dispatch: Dispatch) {
    dispatch({
      type: types.CLEAR_SEARCH
    } as Action);
  }
}

const setSearchString = (searchString: string) => {
  return function (dispatch: Dispatch) {
    dispatch({
      type: types.SET_SEARCH_VALUE,
      value: searchString
    } as Action);
  }
}

export default {
  clearSearch,
  setSearchString
}
