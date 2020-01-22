import types from '../types';

const ProFormInitialState = {
  username: ''
}

export default (state = ProFormInitialState, action: any) => {
  switch (action.type) {
    case types.FETCH_USERNAME_FAILURE:
      return {
        loading: false,
        username: '',
        error: action.payload
      }
    case types.FETCH_USERNAME_SUCCESS:
      return {
        loading: false,
        username: action.payload,
        error: ''
      }
    default: return state;
  }
}