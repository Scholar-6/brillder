import { combineReducers } from 'redux';
import MainPageReducer from './main-page-reducer';
import proFormReducer from './pro-form-reducer';
import bricksReducer from './bricks-reducer';
import brickReducer from './brick-reducer';
import authReducer from './auth';

export default combineReducers({
  mainPage: MainPageReducer,
  proForm: proFormReducer,
  bricks: bricksReducer,
  brick: brickReducer,
  auth: authReducer,
});
