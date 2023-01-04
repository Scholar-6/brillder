import React, { useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Radio } from '@material-ui/core';
import { StripeCardElement } from "@stripe/stripe-js"
import axios from "axios";
import { connect } from 'react-redux';
import queryString from 'query-string';

import userActions from 'redux/actions/user';
import './StripePageCreditCard.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User, UserPreferenceType } from 'model/user';
import map from 'components/map';
import { isIPad13, isTablet } from 'react-device-detect';
import { checkCoupon, Coupon, getPrices } from 'services/axios/stripe';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import { isPhone } from 'services/phone';
import { setUserPreference } from 'services/axios/user';


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

  const [discount] = useState('WELCOME50');

  const [tempDiscount, setTempDiscount] = useState('WELCOME50');
  const [changed, setChanged] = useState(false);

  const [clicked, setClicked] = useState(false);
  const [coupon, setCoupon] = useState(null as Coupon | null);

  const [cardValid, setCardValid] = useState(false);
  const [expireValid, setExpireValid] = useState(false);
  const [cvcValid, setCvcValid] = useState(false);

  const [isMonthly, setMonthly] = useState(false);
  const [card, setCard] = useState(null as null | StripeCardElement);

  const loadPrices = async () => {
    const stripePrices = await getPrices();
    if (stripePrices) {
      if (isLearner) {
        setOriginalPrice(stripePrices.studentYearly / 100);
      } else {
        setOriginalPrice(stripePrices.teacherYearly / 100);
      }
    }
  }

  useEffect(() => {
    loadPrices();
    /*eslint-disable-next-line*/
  }, []);


  useEffect(() => {
    if (elements) {
      var style = {
        base: {
          fontSize: '4.5vw',
        },
      };

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

      style = {
        base: {
          fontSize: '10vw',
        },
      };

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
      const type = isLearner ? UserPreferenceType.Student : UserPreferenceType.Teacher;
      await setUserPreference(type);
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
        const type = isLearner ? UserPreferenceType.Student : UserPreferenceType.Teacher;
        await setUserPreference(type);
        await props.getUser();
        props.history.push(map.MainPage + '?subscribedPopup=true');
        setClicked(false);
        return true
      }
    }

    setClicked(false);
    return false;
  };

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
    return 'Save 50%';
  }

  const renderAnnualPriceValue = () => {
    if (coupon && coupon.percentOff) {
      if (coupon.duration === "forever") {
        return Math.round(originalPrice * Math.round(100 - coupon.percentOff)) / 100;
      } else if (coupon.duration === "repeating" && coupon.durationInMounths && coupon.durationInMounths > 0) {
        // forumula adding percentages depands on duration (need to test)
        const percentage = 100 - coupon.percentOff;
        const finalPercentage = ((100 * (12 - coupon.durationInMounths)) + (percentage * coupon.durationInMounths)) / 12;

        return Math.round(originalPrice * finalPercentage) / 100;
      }
    }
    if (isLearner) {
      return 49.99;
    } else {
      return 64.99;
    }
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
  if (coupon && coupon.percentOff && coupon.percentOff > 50) {
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

    if (isLearner) {
      return (
        <button type="submit" disabled={!cardValid || !expireValid || !cvcValid || !stripe || clicked}>
          Agree & Subscribe
        </button>
      );
    } 

    return (
      <button className="teacher-button" type="submit" disabled={!cardValid || !expireValid || !cvcValid || !stripe || clicked}>
        Agree & Subscribe
      </button>
    );
  }

  const renderGreenPricingBox = () => {
    if (!isOtherCoupon) {
      return (
        <div className="radio-row one-button">
          {!isFree && !isOtherCoupon &&
            <div className="active">
              <span>£{renderAnnualPriceValue()}</span> <span className="label">Annually</span>
              {/* <div className="absolute-label" >{renderAnnualPercentage()}</div> */}
            </div>}
        </div>
      )
    }
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
            <div className="logo bold">Subscribe to Brillder</div>
            {isPhone() ? <div className="bigger">
              Join an incredible platform and {isLearner ? ' build a brilliant mind' : ' start building brilliant minds'}. For just £{renderAnnualPriceValue()}/year. Cancel anytime.
            </div> : <div>
              <div className="bigger">
                Join an incredible platform and {isLearner ? ' build a brilliant mind' : ' start building brilliant minds'}.
              </div>
              {!isOtherCoupon && <div className="bigger">For just £{renderAnnualPriceValue()}/year. Cancel anytime.</div>}
            </div>}
            {renderGreenPricingBox()}
            {isOtherCoupon &&
              <div className="custom-voucher-label">
                <div> Custom Pricing Applies.</div>
                <div className="smaller"> Please check your original email offer.</div>
              </div>}

            <div className={`label ${isFree ? 'hidden' : ''}`}>Card Number</div>
            <div id="card-number-element" className={`field ${isFree ? 'hidden' : ''}`}></div>
            <div className={`two-columns ${isFree ? 'hidden' : ''}`}>
              <div>
                <div className="label">Expiry Date</div>
                <div id="card-expiry-element" className="field" />
              </div>
              <div>
                <div className="label">CVC</div>
                <div id="card-cvc-element" className="field"></div>
              </div>
            </div>
            <div className="terms-text">
              By clicking “Agree & Subscribe” your are agreeing to our <span className="link-to-terms" onClick={() => {
                const a = document.createElement('a');
                a.target = "_blank";
                a.href = map.SubscriptionTerms;
                a.click();
              }}>Terms and Conditions</span>
            </div>
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
