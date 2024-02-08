import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { isSafari, isTablet } from 'react-device-detect';

import './app.scss';


import { setupZendesk } from 'services/zendesk';
import Scholar6Page from 'components/scholar6/Scholar6Page';


interface AppProps {
}

const App: React.FC<AppProps> = props => {
  const [zendeskCreated, setZendesk] = React.useState(false);

  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        secondary: { main: "#001c58" },
        primary: { main: "#0B3A7E" }
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 760,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
      },
    }),
    [],
  );

  setupZendesk(zendeskCreated, setZendesk);

  return (
    <div className={isSafari ? 'root-safari browser-type-container' : 'browser-type-container'}>
      <Helmet>
        <title>SCHOLAR6 | Transforming the Sixth From</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        <Scholar6Page />
      </ThemeProvider>
    </div>
  );
}

export default App;
