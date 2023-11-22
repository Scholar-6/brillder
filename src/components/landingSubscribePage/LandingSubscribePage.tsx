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
          <div className="subc-title bold">Subscribe to Brillder. <span className="text-orange">Save 50%!</span></div>
          {isPhone() ?
            <div className="subc-description">
              <div>Brillder is free to play!</div>
              <div>But if you’re a teacher, you can also create up to 10 classes.</div>
              <div>Subscribe to use Brillder without limits!</div>
            </div>
            :
            <div className="subc-description">
              <div>Brillder is free to play! But if you’re a teacher, you can also create up to 10 classes.</div>
              <div>Subscribe to use Brillder without limits!</div>
            </div>}
          <div className="subscribe-type-boxes">
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
                <div><SpriteIcon name="check-icon" /> Help with publishing your personal bricks to the public catalogue</div>
              </div>

              <button className="btn teacher" onClick={() => {
                history.push('/stripe-subscription/educator');
              }}>Get Brillder for Teachers</button>

              <div className="subsc-small">
                Students do not need to sign in or subscribe to play bricks which you set, but you may invite them to sign up in order to more easily
                monitor their progress. Many teachers recoup this outlay from departmental budgets. See institutional deals for multi-teacher packages.
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
