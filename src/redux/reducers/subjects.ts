import types from '../types';
import { Subject } from 'model/brick';

export interface SubjectState {
  subjects: Subject[] | null;
  error: any;
}

const InitialState = {
  subjects: null, // null - not loaded, else - array
} as SubjectState;

export default (state = InitialState, action: any) => {
  switch (action.type) {
    case types.FETCH_BRICKS_FAILURE:
      return {
        subjects: [],
        error: action.payload
      } as SubjectState;
    case types.FETCH_BRICKS_SUCCESS:
      return {
        subjects: action.payload,
        error: ''
      } as SubjectState;
    default: return state;
  }
}
