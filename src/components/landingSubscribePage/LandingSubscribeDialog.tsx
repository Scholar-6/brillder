import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { connect } from 'react-redux';
import { useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { StripeCardElement } from "@stripe/stripe-js"
import axios from "axios";

import './LandingSubscribePage.scss';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import userActions from "../../redux/actions/user";
import BaseDialogWrapper from 'components/baseComponents/dialogs/BaseDialogWrapper';
import map from 'components/map';

interface StripePageProps {
  history: any;
  match: any;
  user: User;
  isAnnual: boolean;
  isLearner: boolean;
  getUser(): void;
}

const StripeCreditsPage: React.FC<any> = (props: StripePageProps) => {
  const { user, isAnnual, isLearner } = props;
  const [isOpen, setOpen] = React.useState(false);

  const stripe = useStripe();
  const elements = useElements() as any;
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK as string);

  const [cardValid, setCardValid] = useState(false);
  const [expireValid, setExpireValid] = useState(false);
  const [cvcValid, setCvcValid] = useState(false);

  const [card, setCard] = useState(null as null | StripeCardElement);

  const [clicked, setClicked] = useState(false);


  useEffect(() => {
    var style = {
      base: {
        fontFamily: 'Brandon Grotesque Regular',
        fontSize: '18px',
      },
    };

    if (elements) {
      const cardNumberElement = elements.create('cardNumber', {
        style,
      });
      cardNumberElement.mount('#card-number-element');
      setCard(cardNumberElement);

      cardNumberElement.on('change', function (event: any) {
        if (event.error) {
          setCardValid(false);
        } else {
          setCardValid(true)
        }
      });


      const cardExpiryElement = elements.create('cardExpiry', {
        style,
      });
      cardExpiryElement.mount('#card-expiry-element');

      cardExpiryElement.on('change', function (event: any) {
        if (event.error) {
          setExpireValid(false);
        } else {
          setExpireValid(true)
        }
      });

      const cardCvcElement = elements.create('cardCvc', {
        style,
      });
      cardCvcElement.mount('#card-cvc-element');

      cardCvcElement.on('change', function (event: any) {
        if (event.error) {
          setCvcValid(false);
        } else {
          setCvcValid(true)
        }
      });
    }
  }, [elements]);


  const handlePayment = async (e: any) => {
    if (e)
      e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    if (clicked) {
      return;
    }

    setClicked(true);

    var intent: any = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/stripe/subscription`,
      { state: isLearner ? 2 : 3, interval: isAnnual ? 0 : 1 },
      { withCredentials: true });

    const clientSecret = intent.data.clientSecret;

    if (card) {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            email: user.email,
          },
        },
      });

      if (result.error) {
        console.log('[error]', result.error);
      } else {
        console.log('[PaymentIntent]', result.paymentIntent);
      }

      if (result.paymentIntent?.status === 'succeeded') {
        await props.getUser();
        props.history.push(map.MainPage + '?subscribedPopup=true');
        setClicked(false);
        return true
      }
    }

    setClicked(false);
    return false;
  };

  const renderSubmitButton = () => {
    return (
      <button type="submit" disabled={!cardValid || !expireValid || !cvcValid || !stripe || clicked}>
        Agree & Subscribe
      </button>
    );
  }

  const options = {
    fonts: [],
  }

  return (
    <BaseDialogWrapper open={isOpen} close={() => setOpen(false)} submit={() => { /* enter key clicked */ }}>
      <Elements stripe={stripePromise} options={options}>
        <div className="StripePayPage">
          <div className="pay-box">
            <form className="CheckOut" onSubmit={(e) => {
              handlePayment(e);
            }}>
              <div className="logo bold">Go Premium today</div>
              <div className="label light">Card Number</div>
              <div id="card-number-element" className="field"></div>
              <div className="two-columns hidden">
                <div>
                  <div className="label light">Expiry Date</div>
                  <div id="card-expiry-element" className="field" />
                </div>
                <div>
                  <div className="label light">CVC</div>
                  <div id="card-cvc-element" className="field"></div>
                </div>
              </div>
              <div className="small light">By clicking “Agree & Subscribe”, you are agreeing to start your subscription immediately, and you can withdraw from the contract and receive a refund within the first 14 days unless you have accessed Brillder content in that time. We will charge the monthly or annual fee to your stored payment method on a recurring basis. You can cancel at any time, effective at the end of the payment period.</div>
              {renderSubmitButton()}
            </form>
          </div>
        </div>
      </Elements>
    </BaseDialogWrapper>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(mapState, mapDispatch)(StripeCreditsPage);
