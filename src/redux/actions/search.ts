import { PageEnum } from 'components/baseComponents/pageHeader/PageHeadWithMenu';
import types from '../types';
import { Action, Dispatch } from 'redux';

const clearSearch = () => {
  return function (dispatch: Dispatch) {
    dispatch({
      type: types.CLEAR_SEARCH
    } as Action);
  }
}

const setSearchString = (searchString: string, page: PageEnum) => {
  return function (dispatch: Dispatch) {
    if (page === PageEnum.ManageClasses) {
      dispatch({
        type: types.SET_CLASSES_SEARCH_VALUE,
        value: searchString
      } as Action);
    } else {
      dispatch({
        type: types.SET_SEARCH_VALUE,
        value: searchString
      } as Action);
    }
  }
}

export default {
  clearSearch,
  setSearchString
}
