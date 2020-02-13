import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
// @ts-ignore
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import './app.css';
import '../../font-numbers/style.css'
import reducer from '../../redux/reducers/index';
import PrivateRoute from './privateRoute';

import NewBrick from '../build/newBrick/newBrick';
import MainPage from '../build/mainPage/mainPage';
import ProFormaPage from '../build/proFormaPage/proFormaPage';
import BricksListPage from '../build/bricksListPage/bricksListPage';
import InvestigationBuildPage from '../build/investigationBuildPage/investigationBuildPage'
import LoginPage from '../loginPage/loginPage';
import RegisterPage from '../registerPage/registerPage';
import PreLoginPage from '../preLoginPage/preLoginPage';


const store = createStore(reducer, applyMiddleware(thunkMiddleware));

const App: React.FC = () => {
  const theme = React.useMemo(() =>
    createMuiTheme({
      palette: {
        primary: { main: "#0B3A7E" }
      }
    }),
    [],
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Switch>
          <PrivateRoute path="/build/new-brick" component={NewBrick} />
          <PrivateRoute path="/build/brick/:brickId" component={InvestigationBuildPage}/>
          <PrivateRoute path="/build/brick-create" exact component={ProFormaPage}/>
          <PrivateRoute path="/build/brick-create/:brickId" exact component={ProFormaPage}/>
          <PrivateRoute path="/build/bricks-list" component={BricksListPage}/>
          <Route path="/pre-login" component={PreLoginPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />
          <PrivateRoute path="/build" component={MainPage} />
          <PrivateRoute path="/" component={MainPage} />
        </Switch>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
