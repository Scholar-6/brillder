import types from '../types';

const MainPageInitialState = {
  bricks: [],
}

export default (state = MainPageInitialState, action: any) => {
  switch (action.type) {
    case types.FETCH_BRICKS_FAILURE:
      return {
        bricks: [],
        error: action.payload
      }
    case types.FETCH_BRICKS_SUCCESS:
      return {
        bricks: action.payload,
        error: ''
      }
    default: return state;
  }
}
