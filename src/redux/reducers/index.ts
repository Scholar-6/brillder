import { combineReducers } from 'redux';
import bricksReducer from './bricks-reducer';
import brickReducer from './brick-reducer';
import authReducer from './auth';

export default combineReducers({
  bricks: bricksReducer,
  brick: brickReducer,
  auth: authReducer,
});
