import React from 'react';
import { connect } from 'react-redux';

import './MobileUsernamePage.scss';
import { ReduxCombinedState } from "redux/reducers";
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User } from 'model/user';
import LabelTyping from 'components/baseComponents/LabelTyping';
import map from 'components/map';

interface UsernamePageProps {
  history: any;
  user: User;
}

const MobileUsernamePage: React.FC<UsernamePageProps> = props => {
  const { user } = props;
  const { username } = user;

  const move = () => props.history.push(map.SelectSubjectPage);

  return (
    <div className="mobile-username-page">
      <div className={username ? 'username-container' : 'only-icon-container'}>
        <div className="icon-container">
          <SpriteIcon name="user" />
        </div>
        <div className="submit-button" onClick={move}>
          <div><LabelTyping start={true} value="Get Started!" /></div>
          <SpriteIcon name="arrow-right" />
        </div>
      </div>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(MobileUsernamePage);
