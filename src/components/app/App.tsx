import React from 'react';
import './app.css';
import { Switch, Route } from 'react-router-dom';
import MainPage from '../mainPage/mainPage';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import CreateBrickPage from '../createBrickPage/createBrickPage';

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
  );
}

export default App;
