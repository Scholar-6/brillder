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

const fetchBrickBuildData = (brickId: string = '') => {
  return function (dispatch: Dispatch) {
    return axios.get('https://jsonplaceholder.typicode.com/users')
      .then(() => {
        var data = {
          //subject: 'Geography',
          //topic: 'Desertification',
          //title: 'Exfoliatioin and Erosion in Arid Environments',
          author: 'E. Pound',
          editor: 'R. Unstead',
          comissionTime: '40 minutes',
          //iteration: 1
        } as any;
        if (brickId) {
          data.subject = 'Test'
          data.topic = 'Test'
        }
        // hardcode data for now
        dispatch(fetchProFormaDataSuccess(data));
      })
      .catch(error => {
        dispatch(fetchProFormaDataFailure(error.message));
      });
  }
}

const submitBrickBuildData = (data:any) => {
  return function (proFormData: any, gg: any, hh:any) {
    return axios.post('', proFormData).then(response => {
    })
    .catch(error => {
    })
  }
}

export default {
  fetchBrickBuildData,
  submitBrickBuildData
}
