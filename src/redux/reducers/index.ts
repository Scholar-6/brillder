import { combineReducers } from 'redux';
import bricksReducer, {BricksState} from './bricks-reducer';
import brickReducer, {BrickState} from './brick-reducer';
import authReducer, {AuthState} from './auth';
import userReducer, {UserState} from './user';
import notificationReducer, {NotificationsState} from './notifications';
import commentsReducer, {CommentsState} from './comments';
import requestFailedReducer, {RequestFailedState} from './requestFailed';


export interface ReduxCombinedState {
  bricks: BricksState;
  brick: BrickState;
  auth: AuthState;
  user: UserState;
  notifications: NotificationsState;
  comments: CommentsState;
  requestFailed: RequestFailedState;
}

export default combineReducers({
  bricks: bricksReducer,
  brick: brickReducer,
  auth: authReducer,
  user: userReducer,
  notifications: notificationReducer,
  comments: commentsReducer,
  requestFailed: requestFailedReducer
});
