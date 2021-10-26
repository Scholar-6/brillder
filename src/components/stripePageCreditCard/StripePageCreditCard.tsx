import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement } from "@stripe/stripe-js"
import axios from "axios";
import './StripePageCreditCard.scss';

const StripePageCreditCard: React.FC<any> = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  debugger
  const user = props.user;
  
  const handlePayment = async (e: any) => {
    debugger
    if (e)
      e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    
    var intent: any = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/stripe/subscription`, {state: 2}, { withCredentials: true });

    const clientSecret = intent.data;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
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
      return true
    }

    return false;
  };

  return <div className="">
    <form className="CheckOut" onSubmit={handlePayment}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>

  </div>
}

export default StripePageCreditCard;
