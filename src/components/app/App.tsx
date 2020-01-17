import React from 'react';
import './app.css';
import { Switch, Route } from 'react-router-dom';
import MainPage from '../mainPage/mainPage';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import CreateBrickPage from '../createBrickPage/createBrickPage';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware, Reducer} from 'redux';
import reducer from '../../redux/reducers';
import thunkMiddleware from 'redux-thunk';

const store = createStore(reducer as Reducer, applyMiddleware(thunkMiddleware));

const App: React.FC = () => {
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: "#0B3A7E"
          }
        }
      }),
    [],
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/brick-create">
            <CreateBrickPage />
          </Route>
          <Route path="/brick/build"></Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
