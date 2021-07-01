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

import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';
import ShareDialog from '../finalStep/dialogs/ShareDialog';
import LinkDialog from '../finalStep/dialogs/LinkDialog';
import LinkCopiedDialog from '../finalStep/dialogs/LinkCopiedDialog';
import InviteDialog from '../finalStep/dialogs/InviteDialog';
import InvitationSuccessDialog from '../finalStep/dialogs/InvitationSuccessDialog';

import { checkTeacherOrAdmin } from 'components/services/brickService';

interface InviteResult {
  isOpen: boolean;
  accessGranted: boolean;
  name: string;
}

interface FooterProps {
  brick: Brick;
  history: any;
  next(): void;

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
  const [linkOpen, setLink] = React.useState(false);
  const [linkSuccess, setLinkSuccess] = React.useState(false);
  const [invite, setInvite] = React.useState(false);
  const [inviteResult, setInviteResult] = React.useState({
    isOpen: false,
    accessGranted: false,
    name: ''
  } as InviteResult);

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
    let isAuthor = false;
    try {
      isAuthor = brick.author.id === props.user.id;
    } catch { }

    const link = routes.playCover(brick.id);

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
      <ShareDialog
        isOpen={share}
        link={() => {
          setShare(false);
          setLink(true);
        }}
        invite={() => {
          setShare(false);
          setInvite(true);
        }}
        close={() => setShare(false)}
      />
      <LinkDialog
        isOpen={linkOpen}
        link={document.location.host + link}
        submit={() => {
          setLink(false);
          setLinkSuccess(true);
        }}
        close={() => setLink(false)}
      />
      <LinkCopiedDialog
        isOpen={linkSuccess}
        close={() => setLinkSuccess(false)}
      />
      <InviteDialog
        canEdit={true} brick={brick} isOpen={invite} hideAccess={true} isAuthor={isAuthor}
        submit={name => {
          setInviteResult({ isOpen: true, name, accessGranted: false });
        }}
        close={() => setInvite(false)}
      />
      <InvitationSuccessDialog
        isAuthor={isAuthor}
        isOpen={inviteResult.isOpen} name={inviteResult.name} accessGranted={inviteResult.accessGranted}
        close={() => setInviteResult({ isOpen: false, name: '', accessGranted: false })}
      />
    </div>
  }


  const renderFooter = () => {
    return (
      <div>
        <span>{/* Requires 6 SpriteIcons to keep spacing correct  */}</span>
        <SpriteIcon name="logo" className="text-theme-orange" onClick={() => setExit(true)} />
        <SpriteIcon name="feather-share" onClick={() => setShare(true)} />
        {canSee
          ? <SpriteIcon name="file-plus" onClick={() => setAssign(true)} />
          : <SpriteIcon name="" />
        }
        <svg />
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

