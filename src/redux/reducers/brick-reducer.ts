import types from '../types';

export interface BrickState {
  brick?: any;
}

const BrickInitialState: BrickState = {
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
    case types.SAVE_BRICK_SUCCESS:
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
