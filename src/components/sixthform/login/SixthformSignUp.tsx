import React from 'react';

import './SixthformLoginPage.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { useHistory } from 'react-router-dom';
import routes from './routes';


const SixthformSignUp: React.FC<any> = () => {
  const history = useHistory();

  return (
    <div className="content-box second-column">
      <div className="abolute-form-container">
        <div>
          <div className="font-40 flex-center title-container bold">
            <SpriteIcon name='sixth-login-hand' className="sixth-login-hand" />
            <div>Hey there!</div>
          </div>
          <div className="font-24 text-center">
            Welcome to Scholar 6.<br />
            Sign up for an account to get started
          </div>
          <a className="google-button-desktop font-25 bold" href={""}>
            <SpriteIcon name="gmail" className="active" />
            <span>Register with Google</span>
          </a>
          <a className="microsoft-button-v5 font-25 bold" href={`${process.env.REACT_APP_BACKEND_HOST}/auth/microsoft/login`}>
            <img alt="" src="/images/microsoft.png" />
            <span>School or Institution (Microsoft)</span>
          </a>
          <div className="line-container flex-center">
            <div className="line" />
            <div className="font-20">OR</div>
            <div className="line" />
          </div>
          <button className="font-30 btn" onClick={() => {
            history.push(routes.EmailSignUp);
          }}>Register with Email</button>
        </div>
      </div>
    </div>
  );
}
export default SixthformSignUp;
