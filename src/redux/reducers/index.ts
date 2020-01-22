import { combineReducers } from 'redux';
import MainPageReducer from './main-page-reducer';
import proFormReducer from './pro-form-reducer';

export default combineReducers({
  mainPage: MainPageReducer,
  proForm: proFormReducer,
});
