import types from './types';

const initialState = {
  numOf: 10
}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case types.CREATE_BRICK: return {
      ...state,
    }
    default: return state;
  }
}