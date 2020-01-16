import React from 'react';
import './app.css';
import { Switch, Route } from 'react-router-dom';
import MainPage from '../mainPage/mainPage';
import { useMediaQuery, createMuiTheme, ThemeProvider, Color } from '@material-ui/core';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: "#0B3A7E"
          }
        }
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/gg">
          <MainPage />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
