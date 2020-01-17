import types from './types';

const MainPageInitialState = {
  username: ''
}

export default (state = MainPageInitialState, action: any) => {
  switch (action.type) {
    case types.CREATE_BRICK: return {
      good: true,
    }
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