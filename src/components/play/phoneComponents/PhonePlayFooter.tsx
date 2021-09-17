import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { connect } from 'react-redux';

import { isAuthenticated } from 'model/brick';
import { PlayMode } from '../model';
import { Brick } from 'model/brick';
import { User } from 'model/user';
import actions from "redux/actions/brickActions";
import { checkTeacherOrAdmin } from 'components/services/brickService';
import { getCookies, clearCookiePolicy, acceptCookies } from 'localStorage/cookies';
import routes from 'components/play/routes';
import { ReduxCombinedState } from 'redux/reducers';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';
import CookiePolicyDialog from 'components/baseComponents/policyDialog/CookiePolicyDialog';
import ExitPlayDialog from '../baseComponents/dialogs/ExitPlayDialog';
import ShareDialogs from '../finalStep/dialogs/ShareDialogs';
import GenerateCoverButton from '../baseComponents/sidebarButtons/GenerateCoverButton';

interface FooterProps {
  brick: Brick;
  isAuthenticated: isAuthenticated;
  history: any;
  user: User;
  menuOpen?: boolean;
  moveToPostPlay(): void;
  mode: PlayMode;
  setMode(mode: PlayMode): void;
  fetchBrick(brickId: number): void;
}

const PhonePlayFooter: React.FC<FooterProps> = (props) => {
  let isInitCookieOpen = false;

  if (props.isAuthenticated !== isAuthenticated.True && !getCookies()) {
    isInitCookieOpen = true;
  }

  const { brick, user, history } = props;
  const [exitPlay, setExit] = React.useState(false);
  const [cookieOpen, setCookiePopup] = React.useState(isInitCookieOpen);
  const [cookieReOpen, setCookieReOpen] = React.useState(false);
  const [share, setShare] = React.useState(false);

  const [assign, setAssign] = React.useState(false);
  const [assignItems, setAssignItems] = React.useState([] as any[]);
  const [assignFailedItems, setAssignFailedItems] = React.useState([] as any[]);
  const [assignSuccess, setAssignSuccess] = React.useState(false);
  const [assignFailed, setAssignFailed] = React.useState(false);

  let initMenuOpen = props.menuOpen ? true : false;
  const [menuOpen, setMenu] = React.useState(initMenuOpen);

  const isIntro = () => {
    return history.location.pathname.slice(-6) === routes.PlayPhonePrepLastPrefix;
  }

  const isPrep = () => {
    return history.location.pathname.slice(-5) === '/prep';
  }

  const isSynthesis = () => {
    return history.location.pathname.slice(-10) === routes.PlaySynthesisLastPrefix;
  }

  const isFinalScore = () => {
    return history.location.pathname.slice(-7) === '/ending';
  }

  const isFinalStep = () => {
    return history.location.pathname.slice(-10) === '/finalStep';
  }

  let canSee = false;
  try {
    canSee = checkTeacherOrAdmin(user);
  } catch { }

  const renderPopups = () => {
    return <div>
      {canSee && <div>
        <AssignPersonOrClassDialog
          isOpen={assign}
          history={history}
          success={(items: any[], failedItems: any[]) => {
            if (items.length > 0) {
              setAssign(false);
              setAssignItems(items);
              setAssignFailedItems(failedItems);
              setAssignSuccess(true);
            } else if (failedItems.length > 0) {
              setAssignFailedItems(failedItems);
              setAssignFailed(true);
            }
          }}
          close={() => setAssign(false)}
        />
        <AssignSuccessDialog
          isOpen={assignSuccess}
          brickTitle={brick.title}
          selectedItems={assignItems}
          close={() => {
            setAssignSuccess(false);
            if (assignFailedItems.length > 0) {
              setAssignFailed(true);
            }
          }}
        />
        <AssignFailedDialog
          isOpen={assignFailed}
          brickTitle={brick.title}
          selectedItems={assignFailedItems}
          close={() => {
            setAssignFailedItems([]);
            setAssignFailed(false);
          }}
        />
      </div>}
      <ShareDialogs
        shareOpen={share}
        brick={brick}
        user={user}
        close={() => setShare(false)}
      />
    </div>
  }

  const renderFinalStep = () => {
    return (
      <div>
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="arrow-right" onClick={props.moveToPostPlay} />
        <span className="exit-text">See Results</span>
      </div>
    );
  }

  const renderEveryOtherStep = () => {
    return (
      <div>
        <SpriteIcon name="logo" className="text-theme-orange" onClick={() => setExit(true)} />
        {(isIntro() || isPrep() || isFinalScore() || isSynthesis())
          ? <SpriteIcon name="" />
          : <SpriteIcon name="file-text" className="ff-prep-icon" onClick={() => history.push(routes.playNewPrep(brick.id) + '?prepExtanded=true&resume=true')} />}
        <SpriteIcon name="" className="ff-smaller" />
        <SpriteIcon name="f-more-vertical" onClick={() => setMenu(!menuOpen)} />
        <SpriteIcon name="" className="ff-smaller" />
      </div>
    );
  }

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    clearCookiePolicy();
  }

  let canStopTrack = false;
  if (props.isAuthenticated !== isAuthenticated.True && getCookies()) {
    canStopTrack = true;
  }

  return <div className="phone-play-footer q-phone-play-footer">
    {(isFinalStep()) ? renderFinalStep() : renderEveryOtherStep()}
    <Menu
      className="phone-down-play-menu menu-dropdown"
      keepMounted
      open={menuOpen}
      onClose={() => setMenu(false)}
    >
      <MenuItem onClick={() => {
        setShare(true);
        setMenu(false);
      }}>
        Share Brick <SpriteIcon name="feather-share" />
      </MenuItem>
      {canSee &&
        <MenuItem onClick={() => {
          setAssign(true);
          setMenu(false);
        }}>
          Assign Brick <SpriteIcon name="file-plus" />
        </MenuItem>}
      {canStopTrack &&
        <MenuItem onClick={() => {
          deleteAllCookies();
          setMenu(false);
          setCookiePopup(true);
          setCookieReOpen(true);
        }}>
          Stop Tracking <SpriteIcon name="feather-x-octagon" />
        </MenuItem>}
      {canSee && <GenerateCoverButton brick={brick} isMenuItem={true} />}
    </Menu>
    {renderPopups()}
    <CookiePolicyDialog isOpen={cookieOpen} isReOpened={cookieReOpen} close={() => {
      acceptCookies();
      setCookiePopup(false);
    }} />
    <ExitPlayDialog isOpen={exitPlay} history={history} subjectId={brick.subject?.id || brick.subjectId} close={() => setExit(false)} />
  </div>;
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id)),
});

export default connect(mapState, mapDispatch)(PhonePlayFooter);
