import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { connect } from 'react-redux';

import './StripeCreditsPage.scss';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import map from 'components/map';
import { isPhone } from 'services/phone';
import StripeCredits from './StripeCredits';

interface StripePageProps {
  history: any;
  match: any;
  user: User;
}

const StripeCreditsPage: React.FC<any> = (props: StripePageProps) => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK as string);

  return (<div className="StripePayPage BuyCredits">
    {!isPhone() && <HomeButton link={map.MainPage} history={props.history} />}
    <Elements stripe={stripePromise}>
      <StripeCredits user={props.user} history={props.history} match={props.match}></StripeCredits>
    </Elements>
  </div>)
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(StripeCreditsPage);
