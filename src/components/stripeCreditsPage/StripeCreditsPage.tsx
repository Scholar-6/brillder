import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { connect } from 'react-redux';

import './StripeCreditsPage.scss';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import userActions from "../../redux/actions/user";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import map from 'components/map';
import { isPhone } from 'services/phone';
import StripeCredits from './StripeCredits';

interface StripePageProps {
  history: any;
  match: any;
  user: User;
  getUser(): void;
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

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(mapState, mapDispatch)(StripeCreditsPage);
