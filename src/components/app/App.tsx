import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend'

import './app.css';
import '../../font-numbers/style.css'
import MainPage from '../mainPage/mainPage';
import reducer from '../../redux/reducers/index';
import ProFormaPage from '../proFormaPage/proFormaPage';
import BricksListPage from '../bricksListPage/bricksListPage';
import InvestigationBuildPage from '../investigationBuildPage/investigationBuildPage'


const store = createStore(reducer, applyMiddleware(thunkMiddleware));

const App: React.FC = () => {
  const theme = React.useMemo(() =>
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
          <DndProvider backend={Backend}>
            <Route path="/build/investigation" component={InvestigationBuildPage}></Route>
          </DndProvider>
          <Route path="/brick-create" exact component={ProFormaPage}></Route>
          <Route path="/brick-create/:brickId" exact component={ProFormaPage}></Route>
          <Route path="/brick/build/:brickId" component={InvestigationBuildPage}></Route>
          <Route path="/bricks-list">
            <BricksListPage />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
