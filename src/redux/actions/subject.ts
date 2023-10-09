import { getSubjects } from "services/axios/subject";

import types from '../types';
import { Action } from 'redux';

const fetchSubjectsSuccess = (data:any) => {
  return {
    type: types.FETCH_SUBJECTS_SUCCESS,
    payload: data
  } as Action
}

const fetchSubjectsFailure = (errorMessage:string) => {
  return {
    type: types.FETCH_SUBJECTS_FAILURE,
    error: errorMessage
  } as Action
}

const fetchSubjects = () => {
  return async function (dispatch: any) {
    console.log('get subject rrrrr')
    const subjects = await getSubjects();
    if (subjects) {
      dispatch(fetchSubjectsSuccess(subjects));
      return subjects;
    } else {
      dispatch(fetchSubjectsFailure('Can`t load subjects'));
      return [];
    }
  }
}

export default {
  fetchSubjects
}
