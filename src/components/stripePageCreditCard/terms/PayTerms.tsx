import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import userActions from 'redux/actions/user';
import { isPhone } from "services/phone";
import { hideZendesk } from "services/zendesk";
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import map from "components/map";


interface BricksListProps {
  history: any;
  location: any;

  getUser(): Promise<any>;
}

const MobileTheme = React.lazy(() => import('./themes/TermsMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/TermsTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/TermsDesktopTheme'));

class PayTerms extends Component<BricksListProps> {
  componentDidMount() {
    if (isPhone()) {
      hideZendesk();
    }
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <Grid
          className="user-preference-page terms-page-container"
          container direction="column"
          justify="center" alignItems="center"
        >
          <HomeButton link={map.MainPage} history={this.props.history} />
          <Grid className="user-preference-container subscribe-terms-page-container onboarding-terms" item>
            <div className="subscribe-terms-page">
              <div>
                <p>
                  Last Updated: 1st January 2023
                </p>
                <h1>
                  Terms and Conditions
                </h1>
                <h3>
                  Subscriptions
                </h3>
                <p>
                  Subscribers pay money to access Brillder without the restrictions of the “Free Trial” plan. Upon purchase, subscribers of all types are given 60 credits to play bricks in the catalogue or enter competitions. Subscribers to the educator plan also have the ability to assign unlimited bricks. By playing bricks and competitions, users earn brills to redeem for credits to continue playing, but can also redeem brills for prizes as outlined in Appendix C below. If a subscriber runs out of credits and brills (which we think is unlikely), Brillder will ensure their credits are ‘topped up’ so they can continue playing.
                </p>
                <h3>
                  Billing cycle
                </h3>
                <p>
                  The period of a Brillder subscription is 12 months, which will begin immediately upon purchase. Brillder will subsequently charge the subscription fee to your stored payment method on a recurring basis (ie. every 12 months), unless you cancel your subscription. The next payment date is shown on the “Manage Account” tab of the user profile settings.
                </p>
                <h3>
                  Cooling Off Period
                </h3>
                <p>
                  Subscribers can withdraw from this contract and receive a refund within 14 days by contacting Brillder. A user’s account type will be reverted to Free Trial status and accumulated brills and credits will be restored accordingly.
                </p>
                <h3>
                  Cancellation
                </h3>
                <p>
                  You can cancel your Brillder subscription at any time, and you will continue to have access to the service through the end of your billing period. To cancel, you will need to log in to your Brillder account and follow instructions to cancel your subscription. If you are unable to log in to your account, please contact us. Following the expiry of the Cooling Off Period, payments are non-refundable and we do not provide refunds or credits for any partial subscription periods. Following the expiry of the subscription period, the user account will revert to the Free plan, but data on user achievement will remain (including user library and brick scores). Accumulated brills and credits will be reset to the equivalent given to Free accounts on
                </p>
              </div>
            </div>
          </Grid>
        </Grid>
      </React.Suspense>
    );
  }
}


const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(null, mapDispatch)(PayTerms);
