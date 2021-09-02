import React from 'react';
import { connect } from 'react-redux';

import { isAuthenticated } from 'model/brick';
import { Brick } from 'model/brick';
import { User } from 'model/user';
import { getCookies, acceptCookies } from 'localStorage/cookies';
import { ReduxCombinedState } from 'redux/reducers';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import CookiePolicyDialog from 'components/baseComponents/policyDialog/CookiePolicyDialog';
import ExitPlayDialog from '../baseComponents/dialogs/ExitPlayDialog';
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';

import { checkTeacherOrAdmin } from 'components/services/brickService';
import ShareDialogs from '../finalStep/dialogs/ShareDialogs';
import GenerateCoverButton from '../baseComponents/sidebarButtons/GenerateCoverButton';

interface FooterProps {
  brick: Brick;
  history: any;
  next(): void;

  isCover?: boolean;

  isAuthenticated: isAuthenticated;
  user: User;
}

const PhonePlayShareFooter: React.FC<FooterProps> = (props) => {
  let isInitCookieOpen = false;

  if (props.isAuthenticated !== isAuthenticated.True && !getCookies()) {
    isInitCookieOpen = true;
  }

  const { brick, history } = props;
  const [exitPlay, setExit] = React.useState(false);
  const [cookieOpen, setCookiePopup] = React.useState(isInitCookieOpen);

  const [share, setShare] = React.useState(false);

  const [assign, setAssign] = React.useState(false);
  const [assignItems, setAssignItems] = React.useState([] as any[]);
  const [assignFailedItems, setAssignFailedItems] = React.useState([] as any[]);
  const [assignSuccess, setAssignSuccess] = React.useState(false);
  const [assignFailed, setAssignFailed] = React.useState(false);

  let canSee = false;
  try {
    canSee = checkTeacherOrAdmin(props.user);
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
        user={props.user}
        close={() => setShare(false)}
      />
    </div>
  }


  const renderFooter = () => {
    return (
      <div>
        <span>{/* Requires 6 SpriteIcons to keep spacing correct  */}</span>
        <SpriteIcon name="logo" className="text-theme-orange" onClick={() => setExit(true)} />
        <SpriteIcon name="feather-share" className="gt-smaller" onClick={() => setShare(true)} />
        {canSee
          ? <SpriteIcon name="file-plus" className="gt-smaller" onClick={() => setAssign(true)} />
          : <SpriteIcon name="" />
        }
        {props.isCover ? canSee ? <GenerateCoverButton brick={brick} isSvg={true} /> : <svg /> : <SpriteIcon name="arrow-right" onClick={props.next} />}
      </div>
    );
  }

  return <div className="phone-play-footer phone-share-footer">
    {renderFooter()}
    <CookiePolicyDialog isOpen={cookieOpen} isReOpened={false} close={() => {
      acceptCookies();
      setCookiePopup(false);
    }} />
    {renderPopups()}
    <ExitPlayDialog isOpen={exitPlay} history={history} subjectId={brick.subject?.id || brick.subjectId} close={() => setExit(false)} />
  </div>;
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapState)(PhonePlayShareFooter);

