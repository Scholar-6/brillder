import types from '../types';
import { Action, Dispatch } from 'redux';

const fetchProFormaDataSuccess = (data: any) => {
  return {
    type: types.FETCH_PRO_FORMA_SUCCESS,
    payload: data
  } as Action
}

const fetchProFormaDataFailure = (errorMessage: string) => {
  return {
    type: types.FETCH_PRO_FORMA_FAILURE,
    error: errorMessage
  } as Action
}

const fetchBrickBuildData = (brickId: string = '') => {
  return function (dispatch: Dispatch) {
    var data = {
      author: 'E. Pound',
      editor: 'R. Unstead',
      comissionTime: '40 minutes',
    } as any;
    if (brickId) {
      data.subject = 'Test'
      data.topic = 'Test'
    }
    // hardcode data for now
    dispatch(fetchProFormaDataSuccess(data));
  }
}

export default {
  fetchBrickBuildData
}
