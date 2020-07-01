import { combineReducers } from 'redux';
import bricksReducer from './bricks-reducer';
import brickReducer from './brick-reducer';
import authReducer, {AuthState} from './auth';
import userReducer from './user';


export interface ReduxCombinedState {
  bricks: any;
  brick: any;
  auth: AuthState;
  user: any;
}

export default combineReducers({
  bricks: bricksReducer,
  brick: brickReducer,
  auth: authReducer,
  user: userReducer,
});
