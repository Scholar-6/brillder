import React from 'react';

import './LandingSubscribePage.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import { isPhone } from 'services/phone';
import map from 'components/map';

const PhoneTheme = React.lazy(() => import('./themes/PhoneTheme'));

interface StripePageProps {
  history: any;
  match: any;
}

const StripeCreditsPage: React.FC<any> = (props: StripePageProps) => {
  const { history } = props;

  return (
    <React.Suspense fallback={<></>}>
      {isPhone() && <PhoneTheme />}
      <div className="LandingSubscribePage">
        <div className="page1-1">
          <HomeButton link="/home" history={history} />
          <div className="subc-title bold">Choose your Subscription. <span className="text-orange">Save 50%!</span></div>
          {isPhone() ?
            <div className="subc-description">
              <div>Trial Brillder for free - 6 complimentary credits for learners,</div>
              <div>10 for teachers. When you run out of credits, you’re obviously</div>
              <div>  hooked. It’s time to subscribe!</div>
            </div>
            :
            <div className="subc-description">
              <div>Trial Brillder for free - 6 complimentary credits for learners, 10 for teachers.</div>
              <div>When you run out of credits, you’re obviously hooked. It’s time to subscribe!</div>
            </div>}
          <div className="flex-center">
            <div className="subc-help-text bold flex-center">
              <div>Tell me about credits, brills and books</div>
              <SpriteIcon name="help-circle-custom" />
              <div className="absolute-subscription-hover">
                <div className="bold">Credits, brills and books</div>
                <div>
                  Each brick costs 1 credit to play (as a learner) or assign (as a teacher). Competition bricks cost 2 credits to play. With every brick played, you earn brills, our reward points, by scoring 50% or more (65% = 65 brills). You can earn loads more brills by playing competition bricks (4 are set every week).  Brills can be collected, exchanged for more credits, or even cashed in if you earn loads through competitions. Your progress will  also be reflected in your Library - with each brick on which you score 50% or more you collect a personalised virtual book.
                </div>
              </div>
            </div>
          </div>
          <div className="subscribe-type-boxes">
            <div>
              <div className="subc-type dd-learner bold">Learner</div>
              <div className="price-before">£99</div>
              <div className="bold price-now">£49.99</div>
              <div className="price-description">
                Billed Annually
              </div>

              <div className="subsc-list">
                <div><SpriteIcon name="check-icon" /> Play unlimited bricks *</div>
                <div><SpriteIcon name="check-icon" /> Cash in Brills for prizes or additional credits</div>
                <div><SpriteIcon name="check-icon" /> Collect unlimited books in your library</div>
                <div><SpriteIcon name="check-icon" /> New content notifications</div>
                <div><SpriteIcon name="check-icon" /> Access to weekly competitions</div>
                <div><SpriteIcon name="check-icon" /> Unlimited replays of bricks in your library</div>
              </div>

              <div className="btn learner" onClick={() => {
                history.push('/stripe-subscription/learner');
              }}>Get Brillder for Learners</div>

              <div className="subsc-small">
                * You get 60 credits, but every brick you play earns brills, which are Brillder’s prize points. Brills can be exchanged for more credits or, if you have enough, for cash prizes. It’s almost impossible to run out of credits, but if you do we’ll top you up.
              </div>
            </div>
            <div>
              <div className="subc-type dd-teacher bold">Teacher</div>
              <div className="price-before">£129.99</div>
              <div className="bold price-now">£64.99</div>
              <div className="price-description">
                Billed Annually
              </div>

              <div className="subsc-list">
                <div><SpriteIcon name="check-icon" /> Set unlimited bricks to your students</div>
                <div><SpriteIcon name="check-icon" /> Self-marking, with full data read-out </div>
                <div><SpriteIcon name="check-icon" /> Priority requests for content</div>
                <div><SpriteIcon name="check-icon" /> Free training on request</div>
                <div><SpriteIcon name="check-icon" /> Adapt catalogue bricks or build personal bricks</div>
                <div><SpriteIcon name="check-icon" /> Sell your best personal bricks to us</div>
              </div>

              <button className="btn teacher" onClick={() => {
                history.push('/stripe-subscription/educator');
              }}>Get Brillder for Teachers</button>

              <div className="subsc-small">
                Your students do not need to subscribe to play bricks which you set. All you need is a student email to assign them a brick. Many teachers recoup this outlay from departmental resources budgets. See institutional deals for multi-teacher packages.
              </div>
            </div>
          </div>
          <div className="terms-link-absolute policy-text">
            <span>
              <a href={window.location.hostname + map.TermsPage} onClick={(e) => { e.preventDefault(); history.push(map.TermsPage); }}>
                Terms
              </a>
            </span>
          </div>
        </div>
        <div className="page2-1">
          <div className="bold p-e3">Brillder for Institutions</div>
          <div className="bold p-e4">Schools & Colleges</div>
          <div className="p-e5">
            More and more institutions are discovering that Brillder can save teachers hours in marking (our bricks are self-marking and assignable) and can offer independent learners hours of stretching study.
          </div>
          <ul>
            <li>
              Full integrations to your teacher and classroom data are available. Integrations are usually priced on a per pupil basis and can be as little as £10 each. Teachers are free and administrators can access a data dashboard. Ask about our Keystone Partner Scheme if you are an institution wanting to subscribe more than 500 students.
            </li>
            <li>
              Department only subscriptions are available, either only for teachers to assign bricks, or for both teachers and learners. A typical annual charge for 10 teacher accounts would be £250 per annum. For 10 teachers and 100 learners (able to access bricks for themselves), £750.
            </li>
          </ul>
          <div className="p-e6">We are fully compliant with data protection requirements. Our admin and data-management teams are DBS checked.</div>
          <div className="p-e7">Please contact us at hello@brillder.com.</div>
        </div>
        <div className="page3-1">
          <div className="p-img-container">
            <img src="/images/book.png"></img>
          </div>
          <div className="p-3-text-cont">
            <div className="bold">Brillder for Libraries</div>
            <div>
              <div>Brillder serves libraries too and we offer amazing deals based on the size of the community you</div>
              <div>serve, enabling log-ins via the unique Library numbers or cards you issue to your users.</div>
              <div>A typical charge for a large user base such as 50,000 could be as low as 5p per potential user.</div>
            </div>
          </div>
        </div>
        <div className="page4-1">
          <div className="p4-text-container">
            <div className="bold">Are you a Builder?</div>
            <div>If you want to create content for your own students, you are best off with a Teacher Subscription. If you want to create content professionally for us, please contact us at hello@brillder.com.</div>
          </div>
          <div className="img-34">
            <img src="/images/subscribe-builder.png"></img>
          </div>
        </div>
      </div>
    </React.Suspense>
  );
}

export default StripeCreditsPage;
