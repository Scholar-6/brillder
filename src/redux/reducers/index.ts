import { combineReducers } from 'redux';
import bricksReducer from './bricks-reducer';
import brickReducer from './brick-reducer';
import authReducer, {AuthState} from './auth';
import userReducer from './user';
import notificationReducer, {NotificationsState} from './notifications';


export interface ReduxCombinedState {
  bricks: any;
  brick: any;
  auth: AuthState;
  user: any;
  notifications: NotificationsState;
}

export default combineReducers({
  bricks: bricksReducer,
  brick: brickReducer,
  auth: authReducer,
  user: userReducer,
  notifications: notificationReducer,
});
