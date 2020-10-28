import React from "react";
import { Chip, Avatar, Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";

import map from 'components/map';
import actions from 'redux/actions/requestFailed';
import brickActions from 'redux/actions/brickActions';
import "./FinalStep.scss";
import { User } from "model/user";
import { Brick, BrickStatus, Editor } from "model/brick";
import { PlayStatus } from "components/play/model";
import { checkAdmin, checkPublisher } from "components/services/brickService";
import { publishBrick, returnToAuthor, returnToEditor } from "services/axios/brick";

import Clock from "components/play/baseComponents/Clock";
import ShareDialog from 'components/play/finalStep/dialogs/ShareDialog';
import InviteEditorDialog from './InviteEditorDialog';
import LinkDialog from 'components/play/finalStep/dialogs/LinkDialog';
import LinkCopiedDialog from 'components/play/finalStep/dialogs/LinkCopiedDialog';
import ExitButton from "components/play/finalStep/ExitButton";
import ShareColumn from "components/play/finalStep/ShareColumn";
import InviteColumn from "components/play/finalStep/InviteColumn";
import PublishColumn from './PublishColumn';
import InvitationSuccessDialog from "components/play/finalStep/dialogs/InvitationSuccessDialog";
import PublishSuccessDialog from "components/baseComponents/dialogs/PublishSuccessDialog";
import CustomColumn from "./CustomColumn";
import { ReduxCombinedState } from "redux/reducers";
import SendPublisherSuccessDialog from "./SendPublisherSuccess";
import { Redirect } from "react-router-dom";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ReturnEditorsSuccessDialog from "components/play/finalStep/dialogs/ReturnEditorsSuccessDialog";

enum PublishStatus {
  None,
  Popup,
  Published,
}

interface FinalStepProps {
  user: User;
  status: PlayStatus;
  brick: Brick;
  history: any;
  location: any;

  sendedToPublisher: boolean;
  publisherConfirmed: boolean;

  returnToEditors(brick: Brick): Promise<void>;
  fetchBrick(brickId: number): void;
  sendToPublisherConfirmed(): void;
  sendToPublisher(brickId: number): void;
  requestFailed(e: string): void;
  assignEditor(brick: Brick, editorIds: number[]): void;
}

const FinalStep: React.FC<FinalStepProps> = ({
  user, brick, history, publisherConfirmed, sendedToPublisher, requestFailed, ...props
}) => {
  const [returnEditorsOpen, setEditorsReturn] = React.useState(false);
  const [shareOpen, setShare] = React.useState(false);
  const [inviteOpen, setInvite] = React.useState(false);
  const [linkOpen, setLink] = React.useState(false);
  const [linkCopiedOpen, setCopiedLink] = React.useState(false);
  const [publishSuccess, setPublishSuccess] = React.useState(PublishStatus.None);
  const [inviteSuccess, setInviteSuccess] = React.useState({
    isOpen: false,
    name: ''
  });

  let isAuthor = false;
  try {
    isAuthor = brick.author.id === user.id;
  } catch {}

  const isAdmin = checkAdmin(user.roles);
  const isPublisher = checkPublisher(user, brick);
  let isCurrentEditor = (brick.editors?.findIndex(e => e.id === user.id) ?? -1) >= 0;
  const link = `/play/brick/${brick.id}/intro`;

  if (!isAuthor && !isCurrentEditor && !isPublisher && !isAdmin) {
    return <Redirect to={map.BackToWorkBuildTab} />;
  }

  const publish = async (brickId: number) => {
    let success = await publishBrick(brickId);
    if (success) {
      setPublishSuccess(PublishStatus.Popup);
    } else {
      requestFailed("Can`t publish brick");
    }
  }

  const removeEditor = async (editor: Editor) => {
    if(brick.editors) {
      const newEditors = brick.editors.filter(e => e.id !== editor.id);
      await props.assignEditor(brick, newEditors.map(e => e.id));
      props.fetchBrick(brick.id);
    }
  }

  const renderInviteColumn = (size: 5 | 3) => {
    return (
      <InviteColumn
        size={size}
        firstLabel="an internal user"
        secondLabel="to edit this brick"
        onClick={()=> setInvite(true)}
      />
    );
  }

  const renderReturnToEditorsColumn = (size: 5 | 3) => {
    return (
      <CustomColumn
        icon="repeat"
        title="Return to editors"
        label="for futher changes"
        size={size}
        onClick={async () => {
          await props.returnToEditors(brick);
          props.fetchBrick(brick.id);
          setEditorsReturn(true);
        }}
      />
    );
  }

  const renderReturnToAuthorColumn = (size: 5 | 3) => {
    return (
      <CustomColumn
        icon="repeat"
        title="Return to author"
        label="for futher changes"
        size={size}
        onClick={async () => {
          await returnToAuthor(brick.id);
          history.push(map.BackToWorkBuildTab);
        }}
      />
    );
  }

  const renderReturnToEditorColumn = (size: 5 | 3) => {
    return (
      <CustomColumn
        icon="repeat" title="Return to editor" label="for futher changes"
        size={size}
        onClick={async () => {
          await returnToEditor(brick.id);
          props.fetchBrick(brick.id);
          history.push(map.BackToWorkBuildTab);
        }}
      />
    )
  }

  const renderSendToPublisherColumn = (size: 5 | 3) => {
    return (
      <CustomColumn
        icon="send" title="Send to publisher" label="for final review"
        size={size}
        onClick={async () => {
          await props.sendToPublisher(brick.id);
          history.push(`${map.BackToWorkBuildTab}?isCore=${brick.isCore}`);
        }}
      />
    );
  }

  const renderPersonalColumns = () => {
    return (
      <Grid className="share-row" container direction="row" justify="center">
        <ShareColumn size={3} onClick={() => setShare(true)} />
        <PublishColumn onClick={() => publish(brick.id)} />
      </Grid>
    );
  }

  const renderAdminColumns = () => {
    return (
      <Grid className="share-row" container direction="row" justify="center">
        {renderInviteColumn(3)}
        {brick.status !== BrickStatus.Publish && <PublishColumn onClick={() => publish(brick.id)} />}
      </Grid>
    );
  }

  const renderActionColumns = () => {
    const canPublish = isPublisher && brick.status !== BrickStatus.Publish && publishSuccess !== PublishStatus.Published;

    if (!brick.isCore) {
      return renderPersonalColumns();
    }

    if (isAdmin) {
      return renderAdminColumns();
    }

    if (isAuthor && brick.status === BrickStatus.Draft) {
      if (brick.editors && brick.editors.length > 0) {
        return (
          <Grid className="share-row" container direction="row" justify="center">
            {renderInviteColumn(3)}
            {renderReturnToEditorsColumn(3)}
          </Grid>
        );
      } else {
        return (
          <Grid className="share-row" container direction="row" justify="center">
            {renderInviteColumn(3)}
          </Grid>
        );
      }
    }

    if (canPublish) {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          {isAdmin && renderInviteColumn(3)}
          {canPublish && renderReturnToEditorColumn(3)}
          {canPublish && <PublishColumn onClick={() => publish(brick.id)} />}
        </Grid>
      );
    }

    if (isCurrentEditor && brick.status === BrickStatus.Build) {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          { renderReturnToAuthorColumn(3) }
          { renderSendToPublisherColumn(3) }
        </Grid>
      );
    }

    return (
      <Grid className="share-row" container direction="row" justify="center">
        {renderInviteColumn(3)}
        { canPublish && renderReturnToEditorColumn(3) }
      </Grid>
    );
  }

  const renderEditorsRow = () => {
    return (
      <p>
        {brick.editors && brick.editors.length > 0
        ? (
          <div>
            {brick.editors.map((e, i, editors) =>
              <Chip
                avatar={<Avatar src={`${process.env.REACT_APP_BACKEND_HOST}/files/${e.profileImage}`} />}
                label={`${e.firstName} ${e.lastName}`}
                onDelete={brick.editors?.length === 1 ? undefined : () => removeEditor(e)}
              />
            )}
            {brick.editors.length === 1
              ? <span> is editing this brick</span>
              : <span> are editing this brick</span>
            }
          </div>
        )
        : 'Invite an editor to begin the publication process'
      }
    </p>
  );
}

return (
  <div>
      <Hidden only={['xs']}>
        <div className="brick-container final-step-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <div className="intro-header">
                  <div className="left-brick-circle">
                    <div className="round-button">
                      <SpriteIcon name="check-icon-thin" className="active" />
                    </div>
                  </div>
                  {isCurrentEditor ?
                    <div>
                      <h2>All done!</h2>
                    </div>
                    :
                    <div>
                      <h2>Submit for Review?</h2>
                      {renderEditorsRow()}
                    </div>}
                  {renderActionColumns()}
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-header">
                  <Clock brickLength={brick.brickLength} />
                </div>
                <div className="intro-text-row">
                </div>
                <ExitButton onClick={() =>
                  history.push(`${map.BackToWorkBuildTab}?isCore=${brick.isCore}`)} />
              </div>
            </Grid>
          </Grid>
        </div>
      </Hidden>
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <div className="brick-container mobile-final-step-page final-step-page">
          <div className="introduction-info">
            <div className="intro-text-row"></div>
          </div>
          <div className="introduction-page">
          </div>
          <ExitButton onClick={() => history.push(map.BackToWorkPage)} />
        </div>
      </Hidden>
      <LinkDialog
        isOpen={linkOpen} link={document.location.host + link}
        submit={() => setCopiedLink(true)} close={() => setLink(false)}
      />
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={()=> setCopiedLink(false)} />
      <ShareDialog isOpen={shareOpen} link={() => { setShare(false); setLink(true) }} close={() => setShare(false)} />
      <InviteEditorDialog
        canEdit={true} brick={brick} isOpen={inviteOpen}
        title="Who would you like to edit this brick?"
        submit={name => { setInviteSuccess({ isOpen: true, name }); }}
        close={() => setInvite(false)} />
      <InvitationSuccessDialog
        isAuthor={isAuthor}
        isOpen={inviteSuccess.isOpen} name={inviteSuccess.name} accessGranted={true}
        close={() => {
          setInviteSuccess({ isOpen: false, name: '' });
          props.fetchBrick(brick.id);
        }}
      />
      <ReturnEditorsSuccessDialog
        isOpen={returnEditorsOpen}
        editors={brick.editors}
        close={() => setEditorsReturn(false)}
      />
      <PublishSuccessDialog
        isOpen={publishSuccess === PublishStatus.Popup}
        close={() => setPublishSuccess(PublishStatus.Published)}
      />
      <SendPublisherSuccessDialog isOpen={sendedToPublisher && publisherConfirmed === false} close={() => props.sendToPublisherConfirmed()} />
    </div>
  );
};
const mapState = (state: ReduxCombinedState) => ({
  brick: state.brick.brick,
  sendedToPublisher: state.sendPublisher.success,
  publisherConfirmed: state.sendPublisher.confirmed,
});

const mapDispatch = (dispatch: any) => ({
  returnToEditors: (brick: Brick) => dispatch(brickActions.assignEditor(brick)),
  fetchBrick: (brickId: number) => dispatch(brickActions.fetchBrick(brickId)),
  sendToPublisher: (brickId: number) => dispatch(brickActions.sendToPublisher(brickId)),
  sendToPublisherConfirmed: () => dispatch(brickActions.sendToPublisherConfirmed()),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
  assignEditor: (brick: any, editor: any) => dispatch(brickActions.assignEditor(brick, editor))
});

export default connect(mapState, mapDispatch)(FinalStep);
