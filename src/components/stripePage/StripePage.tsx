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
import { isPhone } from 'services/phone';

interface StripePageProps {
  history: any;
  match: any;
  user: User;
  getUser(): void;
}

const StripePage: React.FC<any> = (props: StripePageProps) => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK as string);

  const options = {
    fonts: [
      {
        family: 'Brandon Grotesque Regular',
        src: 'url(https://brillder.com/asserts/fonts/BrandonGrotesque/Brandon_bld.woff) format(woff)'
      },
    ],
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

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(mapState, mapDispatch)(StripePage);
