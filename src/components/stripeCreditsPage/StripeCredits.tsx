import React, { useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Radio } from '@material-ui/core';
import { StripeCardElement } from "@stripe/stripe-js"
import { connect } from 'react-redux';

import userActions from 'redux/actions/user';
import { User } from 'model/user';
import { buyCredits } from 'services/axios/stripe';

export enum CreditPrice {
  Small = 1,
  Medium
}

interface Props {
  user: User;
  match: any;
  history: any;
  getUser(): void;
}

const StripeCredits: React.FC<Props> = ({ user, ...props }) => {
  const stripe = useStripe();
  const elements = useElements() as any;

  const [clicked, setClicked] = useState(false);

  const [cardValid, setCardValid] = useState(false);
  const [expireValid, setExpireValid] = useState(false);
  const [cvcValid, setCvcValid] = useState(false);

  const [creditPrice, setCreditPrice] = useState(CreditPrice.Small);

  const [card, setCard] = useState(null as null | StripeCardElement);


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

    const intent = await buyCredits(creditPrice);
    const clientSecret = intent.data;

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
        setClicked(false);
        return true
      }
    }
    setClicked(false);

    return false;
  };

  return (
    <div className="flex-center">
      <React.Suspense fallback={<></>}>
        <div className="pay-box">
          <form className="CheckOut" onSubmit={(e) => handlePayment(e)}>
            <div className="logo bold">Credits</div>
            <div className="radio-row">
              <div className={creditPrice === CreditPrice.Small ? "active" : ''} onClick={() => setCreditPrice(CreditPrice.Small)}>
                <Radio checked={creditPrice === CreditPrice.Small} />
                £5 for 5 Credits
              </div>
              <div className={creditPrice === CreditPrice.Medium ? 'active' : ''} onClick={() => setCreditPrice(CreditPrice.Medium)}>
                <Radio checked={creditPrice === CreditPrice.Medium} />
                <span>£10 for 11 Credits</span>
              </div>
            </div>
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
            <button type="submit" disabled={!cardValid || !expireValid || !cvcValid || !stripe || clicked}>
              Agree
            </button>
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
