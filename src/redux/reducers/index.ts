import { combineReducers } from 'redux';
import bricksReducer, {BricksState} from './bricks-reducer';
import brickReducer, {BrickState} from './brick-reducer';
import authReducer, {AuthState} from './auth';
import userReducer, {UserState} from './user';
import notificationReducer, {NotificationsState} from './notifications';
import commentsReducer, {CommentsState} from './comments';
import requestFailedReducer, {RequestFailedState} from './requestFailed';
import statsReducer, { StatsState } from './stats';
import sendPublisher, { SendPublisherState } from './sendPublisher';
import subjectReducer, { SubjectState } from './subjects';
import playReducer, { PlayState } from './play';


export interface ReduxCombinedState {
  play: PlayState,
  subjects: SubjectState,
  bricks: BricksState;
  brick: BrickState;
  auth: AuthState;
  user: UserState;
  sendPublisher: SendPublisherState;
  notifications: NotificationsState;
  comments: CommentsState;
  requestFailed: RequestFailedState;
  stats: StatsState;
}

export default combineReducers({
  play: playReducer,
  subjects: subjectReducer,
  bricks: bricksReducer,
  brick: brickReducer,
  auth: authReducer,
  user: userReducer,
  notifications: notificationReducer,
  comments: commentsReducer,
  sendPublisher: sendPublisher,
  requestFailed: requestFailedReducer,
  stats: statsReducer
});
