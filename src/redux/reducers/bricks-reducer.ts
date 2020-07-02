import types from '../types';
import { Brick } from 'model/brick';

export interface BricksState {
  bricks: Brick[];
}

const BricksInitialState = {
  bricks: [],
}

export default (state = BricksInitialState, action: any) => {
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
