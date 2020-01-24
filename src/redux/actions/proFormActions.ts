import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';
import host from '../../hostname';

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
    return axios.get(host.BACKEND_HOST + '/brick')
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

const submitProFormaSuccess = () => {
  return {
    type: types.SUBMIT_PRO_FORMA_SUCCESS,
  } as Action
}

const submitProFormaFailure = (errorMessage:string) => {
  return {
    type: types.SUBMIT_PRO_FORMA_FAILURE,
    error: errorMessage
  } as Action
}

const submitBrickBuildData = (data:any) => {
  return function (dispatch: Dispatch) {
    data.type = 1;
    return axios.post(host.BACKEND_HOST + '/brick', data).then(response => {
      dispatch(submitProFormaSuccess());
    })
    .catch(error => {
      dispatch(submitProFormaFailure(error.message))
    })
  }
}

export default {
  fetchBrickBuildData,
  submitBrickBuildData
}
