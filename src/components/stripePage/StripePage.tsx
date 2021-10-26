import React from 'react';
import './StripePage.scss';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePageCreditCard from 'components/stripePageCreditCard/StripePageCreditCard';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import userActions from "../../redux/actions/user";

interface StripePageProps {
  user: User;
}

const StripePage: React.FC<any> = (props: any) => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK as string);
  debugger

  var user = props.user;
  return (<div className="StripePayPage">
    <Elements stripe={stripePromise}>
      <StripePageCreditCard user={user}></StripePageCreditCard>
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
