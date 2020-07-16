import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducer from 'redux/reducers/index';
import actions from 'redux/actions/auth';

import { socketIoMiddleware } from 'socket/socket';

const store = createStore(reducer, applyMiddleware(thunkMiddleware, socketIoMiddleware));
store.dispatch(actions.isAuthorized());

export default store;