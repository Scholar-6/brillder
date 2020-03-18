import { combineReducers } from 'redux';
import bricksReducer from './bricks-reducer';
import brickReducer from './brick-reducer';
import authReducer from './auth';
import userReducer from './user';


export default combineReducers({
  bricks: bricksReducer,
  brick: brickReducer,
  auth: authReducer,
  user: userReducer,
});
