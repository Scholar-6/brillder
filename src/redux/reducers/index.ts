import { combineReducers } from 'redux';
import MainPageReducer from './main-page-reducer';
import proFormReducer from './pro-form-reducer';
import bricksReducer from './bricks-reducer';
import brickReducer from './brick-reducer';
import accountReducer from './account-reducer';

export default combineReducers({
  mainPage: MainPageReducer,
  proForm: proFormReducer,
  bricks: bricksReducer,
  brick: brickReducer,
  account: accountReducer,
});
