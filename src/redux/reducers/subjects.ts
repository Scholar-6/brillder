import types from '../types';
import { Subject } from 'model/brick';

export interface SubjectState {
  subjects: Subject[];
  error: any;
}

const InitialState = {  subjects: [], error: null } as SubjectState;

export default (state = InitialState, action: any) => {
  switch (action.type) {
    case types.FETCH_SUBJECTS_FAILURE:
      return {
        subjects: [],
        error: action.payload
      } as SubjectState;
    case types.FETCH_SUBJECTS_SUCCESS:
      return {
        subjects: action.payload,
        error: ''
      } as SubjectState;
    default: return state;
  }
}
