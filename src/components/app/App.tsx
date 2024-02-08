import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { isSafari, isTablet } from 'react-device-detect';

import './app.scss';
import actions from "redux/actions/auth";


import { setupZendesk } from 'services/zendesk';
import RotateIPadInstruction from 'components/baseComponents/rotateInstruction/RotateIPadInstruction';
import { ReduxCombinedState } from 'redux/reducers';
import { User } from 'model/user';

import Scholar6Page from 'components/scholar6/Scholar6Page';


interface AppProps {
  user: User;
  setLogoutSuccess(): void;
  setReferralId(referralId: string): void;
}

const App: React.FC<AppProps> = props => {
  const [zendeskCreated, setZendesk] = React.useState(false);
  const isHorizontal = () => {
    // Apple does not seem to have the window.screen api so we have to use deprecated window.orientation instead.
    if (window.orientation && typeof window.orientation === "number" && Math.abs(window.orientation) === 90) {
      return true;
    }
    if (window.screen.orientation && window.screen.orientation.type.includes('/^landscape-.+$/') === true) {
      return true;
    }
    return false;
  };
  const [horizontal, setHorizontal] = React.useState(isHorizontal());

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

  // If is tablet and portrait tell them to go to landscape
  if (isTablet && !horizontal) {
    return <RotateIPadInstruction />;
  }

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

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  setLogoutSuccess: () => dispatch(actions.setLogoutSuccess()),
  setReferralId: (referralId: string) => dispatch(actions.setReferralId(referralId)),
});

export default connect(mapState, mapDispatch)(App);
