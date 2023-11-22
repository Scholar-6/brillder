import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { isAuthenticated } from 'model/brick';
import { Brick } from 'model/brick';
import { User } from 'model/user';
import { getCookies, acceptCookies, clearCookiePolicy } from 'localStorage/cookies';
import { ReduxCombinedState } from 'redux/reducers';
import { checkTeacherOrAdmin } from 'components/services/brickService';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import CookiePolicyDialog from 'components/baseComponents/policyDialog/CookiePolicyDialog';
import ExitPlayDialog from '../baseComponents/dialogs/ExitPlayDialog';
import ShareDialogs from '../finalStep/dialogs/ShareDialogs';
import FullScreenButton from 'components/baseComponents/pageHeader/fullScreenButton/FullScreen';
import VolumeButton from 'components/baseComponents/VolumeButton';
import { getAssignmentsCount } from 'services/axios/brick';
import map from 'components/map';
import LockedDialog from 'components/baseComponents/dialogs/LockedDialog';

interface FooterProps {
  brick: Brick;
  history: any;
  next(): void;
  onlyLibrary?: boolean;
  setLibrary?(): void;

  isCover?: boolean;

  isAuthenticated: isAuthenticated;
  user: User;
}

const PhonePlayShareFooter: React.FC<FooterProps> = (props) => {
  let isInitCookieOpen = false;

  if (props.isAuthenticated !== isAuthenticated.True && !getCookies()) {
    isInitCookieOpen = true;
  }

  let canStopTrack = false;
  if (props.isAuthenticated !== isAuthenticated.True && getCookies()) {
    canStopTrack = true;
  }

  const { brick, history } = props;
  const [exitPlay, setExit] = React.useState(false);
  const [cookieOpen, setCookiePopup] = React.useState(isInitCookieOpen);
  const [assignedCount, setAssignedCount] = React.useState(-1);
  const [noAassignmentsOpen, setNoAssignments] = React.useState(false);
  const [cookieReOpen, setCookieReOpen] = React.useState(false);

  const [share, setShare] = React.useState(false);

  const [menuOpen, setMenu] = React.useState(false);
  
  const prepare = async () => {
    const count = await getAssignmentsCount();
    if (count && count > 0) {
      setAssignedCount(count);
    } else {
      setAssignedCount(0);
    }
  }

  /*eslint-disable-next-line*/
  React.useEffect(() => {
    if (assignedCount === -1) {
      prepare();
    }
  }, []);

  let canSee = false;
  try {
    canSee = checkTeacherOrAdmin(props.user);
  } catch { }

  const renderFooter = () => {
    if (props.isCover) {
      return (
        <div>
          <svg />
          <SpriteIcon name="logo" className="text-theme-orange" onClick={() => {
            if (props.onlyLibrary && props.setLibrary) {
              props.setLibrary();
            } else {
              setExit(true);
            }
          }} />
          <SpriteIcon name="feather-share" className="gt-smaller" onClick={() => setShare(true)} />
          <svg />
          <SpriteIcon name="f-more-vertical" className="gt-smaller" onClick={() => setMenu(true)} />
        </div>
      );
    }

    return (
      <div>
        <span>{/* Requires 6 SpriteIcons to keep spacing correct  */}</span>
        <SpriteIcon name="logo" className="text-theme-orange" onClick={() => {
          if (props.onlyLibrary && props.setLibrary) {
            props.setLibrary();
          } else {
            setExit(true);
          }
        }} />
        {props.isCover && <SpriteIcon name="" />}
        {props.isCover && canSee && <svg />}
        <SpriteIcon name="feather-share" className="gt-smaller" onClick={() => setShare(true)} />
        {canSee
          ? <SpriteIcon name="f-more-vertical" className="gt-smaller" onClick={() => setMenu(true)} />
          : <SpriteIcon name="" />
        }
        <svg />
        <svg />
        <div
          className="f-fixed-arrow-button"
          onClick={props.next}
        >
          Next
          <SpriteIcon name="arrow-right" className="text-white" />
        </div>
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

  return <div className="phone-play-footer phone-share-footer">
    {renderFooter()}
    <CookiePolicyDialog isOpen={cookieOpen} isReOpened={false} close={() => {
      acceptCookies();
      setCookiePopup(false);
    }} />
    <Menu
      className="phone-down-play-menu menu-dropdown"
      keepMounted
      open={menuOpen}
      onClose={() => setMenu(false)}
    >
      <MenuItem onClick={() => {
        if (assignedCount > 0) {
          props.history.push(map.AssignmentsPage);
        } else {
          setNoAssignments(true);
        }
      }}>
        My Assignments <SpriteIcon name="student-back-to-work" className={`active ${assignedCount > 0 ? 'text-white' : 'text-theme-dark-blue'}`} />
      </MenuItem>
      <MenuItem onClick={() => {
        setShare(true);
        setMenu(false);
      }}>
        Share Brick <SpriteIcon name="feather-share" />
      </MenuItem>
      {canStopTrack &&
        <MenuItem onClick={() => {
          deleteAllCookies();
          setMenu(false);
          setCookiePopup(true);
          setCookieReOpen(true);
        }}>
          Stop Tracking <SpriteIcon name="feather-x-octagon" />
        </MenuItem>}
      <VolumeButton />
      <FullScreenButton />
    </Menu>
    <ExitPlayDialog isOpen={exitPlay} history={history} subjectId={brick.subject?.id || brick.subjectId} close={() => setExit(false)} />
    <LockedDialog
      label="To unlock this, a brick needs to have been assigned to you"
      isOpen={noAassignmentsOpen}
      close={() => setNoAssignments(false)} />
    <CookiePolicyDialog isOpen={cookieOpen} isReOpened={cookieReOpen} close={() => {
      acceptCookies();
      setCookiePopup(false);
    }} />
    <ShareDialogs
        shareOpen={share}
        brick={brick}
        user={props.user}
        close={() => setShare(false)}
      />
  </div>;
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapState)(PhonePlayShareFooter);

