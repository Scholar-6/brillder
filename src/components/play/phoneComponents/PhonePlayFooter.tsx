import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { connect } from 'react-redux';

import { PlayMode } from '../model';
import map from 'components/map';
import { Brick } from 'model/brick';
import { User } from 'model/user';
import actions from "redux/actions/brickActions";
import { checkTeacherOrAdmin } from 'components/services/brickService';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';
import ShareDialog from '../finalStep/dialogs/ShareDialog';
import LinkDialog from '../finalStep/dialogs/LinkDialog';
import LinkCopiedDialog from '../finalStep/dialogs/LinkCopiedDialog';
import InviteDialog from '../finalStep/dialogs/InviteDialog';
import InvitationSuccessDialog from '../finalStep/dialogs/InvitationSuccessDialog';
import ExitButton from "components/play/finalStep/ExitButton";

interface InviteResult {
  isOpen: boolean;
  accessGranted: boolean;
  name: string;
}

interface FooterProps {
  brick: Brick;
  history: any;
  user: User;
  moveToPostPlay(): void;
  mode: PlayMode;
  setMode(mode: PlayMode): void;
  fetchBrick(brickId: number): void;
}

const PhonePlayFooter: React.FC<FooterProps> = (props) => {
  const { brick } = props;
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

  const [menuOpen, setMenu] = React.useState(false);
  const { history } = props;

  const isIntro = () => {
    return history.location.pathname.slice(-6) === '/intro';
  }

  const isSynthesis = () => {
    return history.location.pathname.slice(-10) === '/synthesis';
  }

  const isFinalStep = () => {
    return history.location.pathname.slice(-10) === '/finalStep';
  }

  let canSee = false;
  try {
    canSee = checkTeacherOrAdmin(props.user);
  } catch { }

  const renderPopups = () => {
    let isAuthor = false;
    try {
      isAuthor = brick.author.id === props.user.id;
    } catch { }

    const link = `/play/brick/${brick.id}/intro`;

    return <div>
      {canSee && <div>
        <AssignPersonOrClassDialog
          isOpen={assign}
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

  const renderFinalStep = () => {
    return (
      <div>
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <button
          type="button"
          className="play-preview svgOnHover roller-red"
          onClick={() => {
            history.push(map.ViewAllPage)
            return props.moveToPostPlay;
          }}
          >
          <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
        </button>
      </div>
    );
  }

  const renderEveryOtherStep = () => {
    return (
      <div>
        <span>{/* Requires 6 SpriteIcons to keep spacing correct  */}</span>
        <SpriteIcon name="" />
        <SpriteIcon name="corner-up-left" onClick={() => history.push(map.ViewAllPage + `?subjectId=${brick.subject?.id}`)} />
        {(isIntro()) ? <SpriteIcon name="" /> : <SpriteIcon name="file-text" onClick={() => history.push(map.playIntro(brick.id))} />}
        <SpriteIcon name="" />
        <SpriteIcon name="" />
        <SpriteIcon name="more" className="rotate-90" onClick={() => setMenu(!menuOpen)} />
      </div>
    );
  }

  return <div className="phone-play-footer"> 
    <div>
      {(isFinalStep()) ? renderFinalStep() : renderEveryOtherStep() }
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
          Share Brick
      </MenuItem>
        {canSee &&
        <MenuItem onClick={() => {
          setAssign(true);
          setMenu(false);
        }}>
          Assign Brick
      </MenuItem>}
      </Menu>
      {renderPopups()}
    </div>
  </div>;
}


const mapDispatch = (dispatch: any) => ({
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id)),
});

export default connect(null, mapDispatch)(PhonePlayFooter);
