import React from 'react';
import './StripePage.scss';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePageCreditCard from 'components/stripePageCreditCard/StripePageCreditCard';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import userActions from "../../redux/actions/user";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import map from 'components/map';

interface StripePageProps {
  history: any;
  match: any;
  user: User;
  getUser(): void;
}

const StripePage: React.FC<any> = (props: StripePageProps) => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK as string);

  return (<div className="StripePayPage">
    <HomeButton link={map.MainPage} history={props.history} />
    <Elements stripe={stripePromise}>
      <StripePageCreditCard user={props.user} match={props.match}></StripePageCreditCard>
    </Elements>
  </div>)
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(mapState, mapDispatch)(StripePage);
