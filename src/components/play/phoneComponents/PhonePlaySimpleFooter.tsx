import React from 'react';
import { connect } from 'react-redux';

import { isAuthenticated } from 'model/brick';
import { Brick } from 'model/brick';
import { User } from 'model/user';
import { getCookies, acceptCookies } from 'localStorage/cookies';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { ReduxCombinedState } from 'redux/reducers';
import CookiePolicyDialog from 'components/baseComponents/policyDialog/CookiePolicyDialog';
import ExitPlayDialog from '../baseComponents/dialogs/ExitPlayDialog';
import routes from '../routes';


interface FooterProps {
  brick: Brick;
  history: any;

  isAuthenticated: isAuthenticated;
  user: User;
}

const PhonePlaySimpleFooter: React.FC<FooterProps> = (props) => {
  let isInitCookieOpen = false;

  if (props.isAuthenticated !== isAuthenticated.True && !getCookies()) {
    isInitCookieOpen = true;
  }

  const { brick, history } = props;
  const [exitPlay, setExit] = React.useState(false);
  const [cookieOpen, setCookiePopup] = React.useState(isInitCookieOpen);

  const renderFooter = () => {
    return (
      <div>
        <span>{/* Requires 6 SpriteIcons to keep spacing correct  */}</span>
        <SpriteIcon name="" />
        <SpriteIcon name="logo" className="text-theme-orange" onClick={() => setExit(true)} />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <div
          className="f-fixed-arrow-button"
          onClick={() => history.push(routes.playNewPrep(brick.id))}
        >
          Start Prep
          <SpriteIcon name="arrow-right" className="text-white" />
        </div>
      </div>
    );
  }

  return <div className="phone-play-footer phone-simple-footer">
    {renderFooter()}
    <CookiePolicyDialog isOpen={cookieOpen} isReOpened={false} close={() => {
      acceptCookies();
      setCookiePopup(false);
    }} />
    <ExitPlayDialog isOpen={exitPlay} history={history} subjectId={brick.subject?.id || brick.subjectId} close={() => setExit(false)} />
  </div>;
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapState)(PhonePlaySimpleFooter);
function setAssign(arg0: boolean): void {
  throw new Error('Function not implemented.');
}

