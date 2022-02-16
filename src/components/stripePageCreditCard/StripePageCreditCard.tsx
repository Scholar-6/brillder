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
import { isIPad13, isTablet } from 'react-device-detect';
import { checkCoupon, Coupon, getPrices } from 'services/axios/stripe';
import PageLoader from 'components/baseComponents/loaders/pageLoader';


const TabletTheme = React.lazy(() => import('./themes/StripeTabletTheme'));
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

  const [originalPrice, setOriginalPrice] = useState(0);
  const [originalAnnualPrice, setOriginalAnnualPrice] = useState(0);

  const [discount] = useState('WELCOME50');

  const [tempDiscount, setTempDiscount] = useState('WELCOME50');
  const [changed, setChanged] = useState(false);

  const [clicked, setClicked] = useState(false);
  const [coupon, setCoupon] = useState(null as Coupon | null);

  const [cardValid, setCardValid] = useState(false);
  const [expireValid, setExpireValid] = useState(false);
  const [cvcValid, setCvcValid] = useState(false);

  const [isMonthly, setMonthly] = useState(true);
  const [card, setCard] = useState(null as null | StripeCardElement);

  const loadPrices = async () => {
    const stripePrices = await getPrices();
    if (stripePrices) {
      if (isLearner) {
        setOriginalPrice(stripePrices.studentMonth / 100);
        setOriginalAnnualPrice(stripePrices.studentYearly / 100);
      } else {
        setOriginalPrice(stripePrices.teacherMonth / 100);
        setOriginalAnnualPrice(stripePrices.teacherYearly / 100);
      }
    }
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

  const applyCode = async () => {
    const coupon = await checkCoupon(tempDiscount);
    if (coupon) {
      setCoupon(coupon);
      setMonthly(true);
      console.log(coupon);
    }
  }

  const handleFreePayment = async (e: any) => {
    if (e)
      e.preventDefault();
    if (clicked) {
      return;
    }

    setClicked(true);

    let couponString = discount;
    if (coupon) {
      couponString = coupon.code;
    }

    var intent: any = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/stripe/subscription`,
      { state: isLearner ? 2 : 3, interval: isMonthly ? 0 : 1, coupon: couponString },
      { withCredentials: true });

    if (intent) {
      await props.getUser();
      props.history.push(map.MainPage + '?subscribedPopup=true');
      setClicked(false);
      return true
    }

    setClicked(false);
    return false;
  }

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

    let couponString = discount;
    if (coupon) {
      couponString = coupon.code;
    }

    var intent: any = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/stripe/subscription`,
      { state: isLearner ? 2 : 3, interval: isMonthly ? 0 : 1, coupon: couponString },
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

  const renderPercentage = () => {
    if (coupon) {
      if (coupon.percentOff) {
        return 'Save ' + coupon.percentOff + '%';
      }
    }
    return 'Save 50%';
  }

  const renderAnnualPercentage = () => {
    if (coupon && coupon.percentOff) {
      // if forever
      if (coupon.duration === "forever") {
        // percentage formula: 1 - (0.84 * 0.5)
        return 'Save ' + Math.round(100 - (0.84 * (coupon.percentOff))) + '%';
      } else if (coupon.duration === "repeating" && coupon.durationInMounths && coupon.durationInMounths > 0) {
        // forumula adding percentages depands on duration (need to test)
        const percentage = 100 - coupon.percentOff;
        const finalPercentage = (1 - ((((12 - coupon.durationInMounths)) + (percentage * coupon.durationInMounths)) / 12)) * 100;
        return 'Save ' + Math.round(finalPercentage) + '%';
      }
      return '';
    }
    return 'Save 58%';
  }

  const renderPriceValue = () => {
    if (coupon && coupon.percentOff) {
      return Math.round(originalPrice * (100 - coupon.percentOff)) / 100;
    }
    return Math.round(originalPrice * 0.5 * 100) / 100;
  }

  const renderAnnualPriceValue = () => {
    if (coupon && coupon.percentOff) {
      if (coupon.duration === "forever") {
        return Math.round(originalAnnualPrice * Math.round(100 - coupon.percentOff)) / 100;
      } else if (coupon.duration === "repeating" && coupon.durationInMounths && coupon.durationInMounths > 0) {
        // forumula adding percentages depands on duration (need to test)
        const percentage = 100 - coupon.percentOff;
        const finalPercentage = ((100 * (12 - coupon.durationInMounths)) + (percentage * coupon.durationInMounths)) / 12;

        return Math.round(originalAnnualPrice * finalPercentage) / 100;
      }
    }
    return Math.round(originalAnnualPrice * 0.5 * 100) / 100;
  }

  if (originalPrice === -1) {
    return <PageLoader content="loading prices" />;
  }

  // free coupon without stripe form
  let isFree = false;
  if (coupon && coupon.duration === 'forever' && coupon.percentOff === 100) {
    isFree = true;
  }

  // other coupons
  let isOtherCoupon = false;
  if (coupon && coupon.percentOff && coupon.percentOff> 50) {
    isOtherCoupon = true;
  }

  const renderSubmitButton = () => {
    if (isFree) {
      return (
        <button type="submit" disabled={clicked}>
          Agree & Subscribe
        </button>
      );
    }
    return (
      <button type="submit" disabled={!cardValid || !expireValid || !cvcValid || !stripe || clicked}>
        Agree & Subscribe
      </button>
    );
  }

  const renderGreenPricingBox = () => {
    if (!isOtherCoupon) {
      return (
            <div className={`radio-row ${(isFree || isOtherCoupon) ? 'one-button' : ''}`}>
              <div className={isMonthly ? "active" : ''} onClick={() => setMonthly(true)}>
                {!(isFree || isOtherCoupon) && <Radio checked={isMonthly} />}
                <div className="absoulte-price">£{originalPrice}</div>
                £{renderPriceValue()} <span className="label">Monthly</span>
                <div className="absolute-label" >{renderPercentage()}</div>
              </div>
              {!isFree && !isOtherCoupon &&
                <div className={!isMonthly ? 'active' : ''} onClick={() => setMonthly(false)}>
                  <Radio checked={!isMonthly} />
                  <span>£{renderAnnualPriceValue()}</span> <span className="label">Annually</span>
                  <div className="absolute-label" >{renderAnnualPercentage()}</div>
                </div>}
            </div>
      )}
      return;
  }

  return (
    <div className="flex-center">
      <React.Suspense fallback={<></>}>
        {(isIPad13 || isTablet) && <TabletTheme />}
        <div className="voucher-box">
          <SpriteIcon name="brain-storm" />
          <div className="absolute-voucher">
            <div className="light label">Your discount code has been added!{/*Have a discount code? Add it here*/}</div>
            <input value={tempDiscount} onChange={e => {
              const { value } = e.target;
              setChanged(true);
              if (value.length < 20) {
                setTempDiscount(e.target.value);
              }
            }} />
            {changed && tempDiscount.length > 2 && <div className="apply-btn flex-center" onClick={applyCode}>Apply</div>}
          </div>
        </div>
        <div className="pay-box">
          <form className="CheckOut" onSubmit={(e) => {
            if (isFree) {
              handleFreePayment(e);
            } else {
              handlePayment(e);
            }
          }}>
            <div className="logo bold">Go Premium today</div>
            <div className="bigger">
              Join an incredible platform and {isLearner ? ' build a brilliant mind.' : ' start building brilliant minds.'}
            </div>
            {!isOtherCoupon && <div className="normal">From just £{originalPrice}/month. Cancel anytime.</div>}
            {renderGreenPricingBox()}
            {isOtherCoupon &&
            <div className="custom-voucher-label">
              <div> Custom Pricing Applies.</div>
              <div className="smaller"> Please check your original email offer.</div>
            </div>}

            <div className={`label light ${isFree ? 'hidden' : ''}`}>Card Number</div>
            <div id="card-number-element" className={`field ${isFree ? 'hidden' : ''}`}></div>
            <div className={`two-columns ${isFree ? 'hidden' : ''}`}>
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
      </React.Suspense>
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});


export default connect(null, mapDispatch)(StripePageCreditCard);
