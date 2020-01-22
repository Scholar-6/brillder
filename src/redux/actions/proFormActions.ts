import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';

const fetchProFormaDataSuccess = (data:any) => {
  return {
    type: types.FETCH_PRO_FORMA_SUCCESS,
    payload: data
  } as Action
}

const fetchProFormaDataFailure = (errorMessage:string) => {
  return {
    type: types.FETCH_PRO_FORMA_FAILURE,
    error: errorMessage
  } as Action
}

const fetchBrickBuildData = () => {
  return function (dispatch: Dispatch) {
    return axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        var data = {
          subject: 'Geography',
          topic: 'Desertification',
          title: 'Exfoliatioin and Erosion in Arid Environments',
          author: 'E. Pound',
          editor: 'R. Unstead',
          comissionTime: '40 minutes',
          iteration: 1
        }
        // hardcode data for now
        dispatch(fetchProFormaDataSuccess(data));
      })
      .catch(error => {
        dispatch(fetchProFormaDataFailure(error.message));
      });
  }
}

export default {
  fetchBrickBuildData,
}
