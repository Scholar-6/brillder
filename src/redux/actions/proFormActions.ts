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
    return axios.get('http://35.177.96.218/brick')
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
  console.log("submit", data)
  return function (dispatch: Dispatch) {
    data.type = 1;
    var config = {
      //mode: 'no-cors',
      //headers: {'Access-Control-Allow-Origin': '*'}
    };

    console.log(66)

    return axios.post('http://35.177.96.218/brick', data, config).then(response => {
      console.log("44", response);
    })
    .catch(error => {
      console.log(55, error)
    })
  }
}

export default {
  fetchBrickBuildData,
  submitBrickBuildData
}
