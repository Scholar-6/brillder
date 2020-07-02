import { combineReducers } from 'redux';
import bricksReducer, {BricksState} from './bricks-reducer';
import brickReducer, {BrickState} from './brick-reducer';
import authReducer, {AuthState} from './auth';
import userReducer, {UserState} from './user';


export interface ReduxCombinedState {
  bricks: BricksState;
  brick: BrickState;
  auth: AuthState;
  user: UserState;
}

export default combineReducers({
  bricks: bricksReducer,
  brick: brickReducer,
  auth: authReducer,
  user: userReducer,
});
