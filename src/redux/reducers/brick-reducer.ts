import types from '../types';

const BrickInitialState = {
  brick: null,
}

export default (state = BrickInitialState, action: any) => {
  switch (action.type) {
    case types.FETCH_BRICK_FAILURE:
      return {
        brick: null,
        error: action.payload
      }
    case types.FETCH_BRICK_SUCCESS:
      return {
        brick: action.payload,
        error: ''
      }
    case types.SUBMIT_PRO_FORMA_SUCCESS:
      return {
        brick: action.payload,
        error: ''
      }
    case types.CREATE_BRICK_SUCCESS:
      return {
        brick: action.payload,
        error: ''
      }
    case types.FORGET_BRICK:
      return BrickInitialState
    default: return state;
  }
}
