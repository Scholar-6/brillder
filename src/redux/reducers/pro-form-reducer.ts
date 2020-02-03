import types from '../types';

interface ProFormState {
  data: any,
  error?: string,
  submitted?: boolean
}

const ProFormPageInitialState = {
  data: null,
} as ProFormState;

export default (state = ProFormPageInitialState, action: any) => {
  switch (action.type) {
    case types.FETCH_PRO_FORMA_FAILURE:
      return {
        data: null,
        error: action.payload
      }
    case types.FETCH_PRO_FORMA_SUCCESS:
      return {
        data: action.payload,
        error: ''
      }
    case types.SUBMIT_PRO_FORMA_FAILURE:
      return {
        error: action.payload
      }
    case types.SUBMIT_PRO_FORMA_SUCCESS:
      return {
        submitted: true,
        data: state.data,
        error: action.payload
      }
    default: return state;
  }
}
