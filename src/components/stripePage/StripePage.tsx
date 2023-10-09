import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { connect } from 'react-redux';

import './StripePage.scss';
import StripePageCreditCard from 'components/stripePageCreditCard/StripePageCreditCard';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import map from 'components/map';
import { isPhone } from 'services/phone';

interface StripePageProps {
  history: any;
  match: any;
  user: User;
}

const StripePage: React.FC<any> = (props: StripePageProps) => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK as string);

  const options = {
    fonts: [],
  }

  return (<div className="StripePayPage">
    {!isPhone() && <HomeButton link={map.MainPage} history={props.history} />}
    <Elements stripe={stripePromise} options={options}>
      <StripePageCreditCard user={props.user} history={props.history} match={props.match}></StripePageCreditCard>
    </Elements>
  </div>)
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(StripePage);
