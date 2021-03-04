import React from 'react';
import { connect } from 'react-redux';

import './MobileUsernamePage.scss';
import { ReduxCombinedState } from "redux/reducers";
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User, UserType } from 'model/user';
import LabelTyping from 'components/baseComponents/LabelTyping';
import map from 'components/map';

interface UsernamePageProps {
  history: any;
  user: User;
}

const MobileUsernamePage: React.FC<UsernamePageProps> = props => {
  const { user } = props;
  const { username } = user;

  const [labelFinished, setLabelFinished] = React.useState(false);
  const [secondFinished, setSecondFinished] = React.useState(false);

  const move = () => props.history.push(map.SelectSubjectPage);

  const renderUsername = () => {
    return (
      <div>
        <LabelTyping
          value="Your username will be"
          className="username-help-label" start={true} onFinish={() => setLabelFinished(true)} />
        <LabelTyping value={username} className="username" start={labelFinished} onFinish={() => setSecondFinished(true)} />
        {user.rolePreference?.roleId === UserType.Builder &&
          <div>
            <p className="username-fade-text animation-300" style={{ opacity: secondFinished ? "1" : '0' }}>Use it to connect with people to create and assign bricks</p>
          </div>}
      </div>
    );
  }

  return (
    <div className="mobile-username-page">
      <div className={username ? 'username-container' : 'only-icon-container'}>
        <div className="icon-container">
          <SpriteIcon name="user" />
        </div>
        {username && renderUsername()}
        {secondFinished && <div className="submit-button" onClick={move}>
          <div><LabelTyping start={true} value="Get Started!" /></div>
          <SpriteIcon name="arrow-right" />
        </div>}
      </div>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(MobileUsernamePage);
