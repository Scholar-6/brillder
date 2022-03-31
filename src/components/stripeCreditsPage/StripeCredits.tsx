import React, { useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Radio } from '@material-ui/core';
import { StripeCardElement } from "@stripe/stripe-js"
import axios from "axios";
import { connect } from 'react-redux';

import userActions from 'redux/actions/user';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User } from 'model/user';
import map from 'components/map';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import { isPhone } from 'services/phone';


interface Props {
  user: User;
  match: any;
  history: any;
  getUser(): void;
}

const StripeCredits: React.FC<Props> = ({user, ...props}) => {
  const stripe = useStripe();
  const elements = useElements() as any;

  const [clicked, setClicked] = useState(false);

  const [cardValid, setCardValid] = useState(false);
  const [expireValid, setExpireValid] = useState(false);
  const [cvcValid, setCvcValid] = useState(false);

  const [card, setCard] = useState(null as null | StripeCardElement);

  const loadPrices = async () => {
  }

  useEffect(() => {
    loadPrices();
    /*eslint-disable-next-line*/
  }, []);


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


    var intent: any = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/stripe/buyCredits/1`, {}, { withCredentials: true });
    console.log(intent)
    const clientSecret = intent.data;
    console.log(clientSecret);

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
        //props.history.push(map.MainPage + '?subscribedPopup=true');
        setClicked(false);
        return true
      }
    }
    setClicked(false);

    return false;
  };

  //return <PageLoader content="loading prices" />;

  const renderSubmitButton = () => {
    return (
      <button type="submit" disabled={!cardValid || !expireValid || !cvcValid || !stripe || clicked}>
        Agree
      </button>
    );
  }

  return (
    <div className="flex-center">
      <React.Suspense fallback={<></>}>
        <div className="pay-box">
          <form className="CheckOut" onSubmit={(e) => handlePayment(e)}>
            <div className="logo bold">Credits</div>
            <div className="label light">Card Number</div>
            <div id="card-number-element" className="field"></div>
            <div className="two-columns">
              <div>
                <div className="label light">Expiry Date</div>
                <div id="card-expiry-element" className="field" />
              </div>
              <div>
                <div className="label light">CVC</div>
                <div id="card-cvc-element" className="field"></div>
              </div>
            </div>
            <div className="small light">By clicking “Agree”, you are agreeing to start your subscription immediately, and you can withdraw from the contract and receive a refund within the first 14 days unless you have accessed Brillder content in that time. We will charge the monthly or annual fee to your stored payment method on a recurring basis. You can cancel at any time, effective at the end of the payment period.</div>
            {renderSubmitButton()}
          </form>
        </div>
      </React.Suspense>
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});


export default connect(null, mapDispatch)(StripeCredits);
