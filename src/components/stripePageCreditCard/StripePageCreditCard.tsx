import React, { useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Radio } from '@material-ui/core';
import { StripeCardElement } from "@stripe/stripe-js"
import axios from "axios";
import { connect } from 'react-redux';

import userActions from 'redux/actions/user';
import './StripePageCreditCard.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User } from 'model/user';
import map from 'components/map';

interface Props {
  user: User;
  match: any;
  history: any;
  getUser(): void;
}

const StripePageCreditCard: React.FC<Props> = (props) => {
  const stripe = useStripe();
  const elements = useElements() as any;
  const user = props.user;

  const isLearner = props.match.params.type === 'learner';

  let price = 4.99;
  let annualPrice = 49;

  if (!isLearner) {
    price = 6.49;
    annualPrice = 64.99;
  }

  const [discount, setDiscount] = useState('WELCOME50');

  const [cardValid, setCardValid] = useState(false);
  const [expireValid, setExpireValid] = useState(false);
  const [cvcValid, setCvcValid] = useState(false);
  
  const [isMonthly, setMonthly] = useState(true);
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

      cardNumberElement.on('change', function(event: any) {
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

      cardExpiryElement.on('change', function(event: any) {
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

      cardCvcElement.on('change', function(event: any) {
        if (event.error) {
          setCvcValid(false);
        } else {
          setCvcValid(true)
        }
      });
    }
  }, [elements]);

  const handlePayment = async (e: any) => {
    debugger
    if (e)
      e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    var intent: any = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/stripe/subscription`, 
      { state: isLearner ? 2 : 3, interval: isMonthly ? 0 : 1, coupon: discount }, 
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
        return true
      }
    }

    return false;
  };

  return (
    <div className="flex-center">
      <div className="voucher-box">
        <SpriteIcon name="brain-storm" />
        <div className="absolute-voucher">
          <div className="light label">Your discount code has been added!{/*Have a discount code? Add it here*/}</div>
          <input value={discount} disabled onChange={e => {
            const {value} = e.target;
            if (value.length < 20) {
              setDiscount(e.target.value)
            }
          }} />
        </div>
      </div>
      <div className="pay-box">
        <form className="CheckOut" onSubmit={handlePayment}>
          <div className="logo bold">Go Premium today</div>
          <div className="bigger">
            Join an incredible platform and {isLearner ? ' build a brilliant mind.' : ' start building brilliant minds.'}
          </div>
          <div className="normal">From just £{price}/month. Cancel anytime.</div>
          <div className="radio-row">
            <div className={isMonthly ? "active" : ''} onClick={() => setMonthly(true)}>
              <Radio checked={isMonthly} />
              <div className="absoulte-price">£9.99</div>
              £{price} <span className="label">Monthly</span>
              <div className="absolute-label" >Save 50%</div>
            </div>
            <div className={!isMonthly ? 'active' : ''} onClick={() => setMonthly(false)}>
              <Radio checked={!isMonthly} />
              <span>£{annualPrice}</span> <span className="label">Annually</span>
              <div className="absolute-label" >Save 59%</div>
            </div>
          </div>
          <div className="label light">12 Card Number</div>
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
          <div className="small light">By clicking “Agree & Subscribe”, you are agreeing to start your subscription immediately, and you can withdraw from the contract and receive a refund within the first 14 days unless you have accessed Brillder content in that time. We will charge the monthly or annual fee to your stored payment method on a recurring basis. You can cancel at any time, effective at the end of the payment period.</div>
          <button type="submit" disabled={!cardValid|| !expireValid || !cvcValid || !stripe}>
            Agree & Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});


export default connect(null, mapDispatch)(StripePageCreditCard);
