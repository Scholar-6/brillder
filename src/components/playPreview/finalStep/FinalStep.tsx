import React, { useState } from "react";
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

import ExitButton from "components/play/finalStep/ExitButton";
import ShareColumn from "components/play/finalStep/ShareColumn";
import InviteColumn from "components/play/finalStep/InviteColumn";
import PublishColumn from './PublishColumn';
import PublishSuccessDialog from "components/baseComponents/dialogs/PublishSuccessDialog";
import CustomColumn from "./CustomColumn";
import { ReduxCombinedState } from "redux/reducers";
import SendPublisherSuccessDialog from "./SendPublisherSuccess";
import { Redirect } from "react-router-dom";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ReturnEditorsSuccessDialog from "components/play/finalStep/dialogs/ReturnEditorsSuccessDialog";
import ReturnAuthorSuccessDialog from "components/play/finalStep/dialogs/ReturnAuthorSuccessDialog";
import SelfPublishColumn from "./SelfPublishColumn";
import playRoutes from '../../play/routes';
import ShareDialogs from "components/play/finalStep/dialogs/ShareDialogs";
import InviteDialog from "components/play/finalStep/dialogs/InviteDialog";
import InvitationSuccessDialog from "components/play/finalStep/dialogs/InvitationSuccessDialog";

enum PublishStatus {
  None,
  Popup,
  Published,
}

interface InviteResult {
  isOpen: boolean;
  accessGranted: boolean;
  name: string;
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
  sendToPublisher(brickId: number): Promise<boolean>;
  requestFailed(e: string): void;
  assignEditor(brick: Brick, editorIds: number[]): void;
}

const FinalStep: React.FC<FinalStepProps> = ({
  user, brick, history, publisherConfirmed, sendedToPublisher, requestFailed, ...props
}) => {
  const [returnEditorsOpen, setEditorsReturn] = useState(false);
  const [returnAuthorOpen, setAuthorReturn] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(PublishStatus.None);
  const [shareOpen, setShare] = useState(false);
  const [inviteOpen, setInvite] = useState(false);
  const [inviteResult, setInviteResult] = useState({
    isOpen: false,
    accessGranted: false,
    name: ''
  } as InviteResult);

  let isAuthor = false;
  try {
    isAuthor = brick.author.id === user.id;
  } catch { }

  const isAdmin = checkAdmin(user.roles);
  const isPublisher = checkPublisher(user, brick);
  const isCurrentEditor = (brick.editors?.findIndex(e => e.id === user.id) ?? -1) >= 0;

  if (!isAuthor && !isCurrentEditor && !isPublisher && !isAdmin) {
    return <Redirect to={map.backToWorkUserBased(user)} />;
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
    if (brick.editors) {
      const newEditors = brick.editors.filter(e => e.id !== editor.id);
      await props.assignEditor(brick, newEditors.map(e => e.id));
      props.fetchBrick(brick.id);
    }
  }

  const renderInviteColumn = () => {
    return (
      <InviteColumn
        size={3}
        firstLabel="an internal user"
        secondLabel="to edit this brick"
        onClick={() => setInvite(true)}
      />
    );
  }

  const renderReturnToEditorsColumn = () => {
    return (
      <CustomColumn
        icon="repeat"
        title="Return to Editors"
        label="for futher changes"
        size={3}
        onClick={async () => {
          await props.returnToEditors(brick);
          props.fetchBrick(brick.id);
          setEditorsReturn(true);
        }}
      />
    );
  }

  const renderReturnToAuthorColumn = () => {
    return (
      <CustomColumn
        icon="repeat"
        title="Return to Author"
        label="for futher changes"
        size={3}
        onClick={async () => {
          await returnToAuthor(brick.id);
          setAuthorReturn(true);
        }}
      />
    );
  }

  const renderReturnToEditorColumn = () => {
    return (
      <CustomColumn
        icon="repeat" title="Return to Editor" label="for futher changes"
        size={3}
        onClick={async () => {
          await returnToEditor(brick.id);
          await props.fetchBrick(brick.id);
          setEditorsReturn(true);
        }}
      />
    )
  }

  const renderSendToPublisherColumn = () => {
    return (
      <CustomColumn
        icon="send-custom"
        title="Send to publisher"
        label="for final review"
        size={3}
        onClick={async () => {
          await props.sendToPublisher(brick.id);
          history.push(`${map.BackToWorkPage}?isCore=${brick.isCore}`);
        }}
      />
    );
  }

  const renderPersonalColumns = () => {
    return (
      <Grid className="share-row" container direction="row" justify="center">
        <ShareColumn size={3} onClick={() => setShare(true)} />
        <SelfPublishColumn onClick={() => publish(brick.id)} />
      </Grid>
    );
  }

  const renderActionColumns = () => {
    const canPublish = isPublisher && brick.status !== BrickStatus.Publish && publishSuccess !== PublishStatus.Published && brick.status === BrickStatus.Review;

    if (!brick.isCore) {
      return renderPersonalColumns();
    }

    if (isAuthor && brick.status === BrickStatus.Draft) {
      if (brick.editors && brick.editors.length > 0) {
        return (
          <Grid className="share-row" container direction="row" justify="center">
            {renderInviteColumn()}
            {renderReturnToEditorsColumn()}
          </Grid>
        );
      } else {
        return (
          <Grid className="share-row" container direction="row" justify="center">
            {renderInviteColumn()}
          </Grid>
        );
      }
    }

    if (canPublish) {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          {isAdmin && renderInviteColumn()}
          {canPublish && brick.status === BrickStatus.Review && renderReturnToEditorColumn()}
          {canPublish && <PublishColumn onClick={() => publish(brick.id)} />}
        </Grid>
      );
    }

    if ((isCurrentEditor || isAdmin) && brick.status === BrickStatus.Build) {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          {renderReturnToAuthorColumn()}
          {renderSendToPublisherColumn()}
        </Grid>
      );
    }

    return (
      <Grid className="share-row" container direction="row" justify="center">
        {renderInviteColumn()}
        {canPublish && brick.status === BrickStatus.Review && renderReturnToEditorColumn()}
      </Grid>
    );
  }

  const renderEditorsRow = () => {
    return (
      <div className="editors-row">
        {brick.editors && brick.editors.length > 0
          ? (
            <div>
              {brick.editors.map((e, i) =>
                <Chip
                  key={i}
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
      </div>
    );
  }

  return (
    <div className="brick-row-container">
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
                <div className="intro-text-row">
                </div>
                <ExitButton onClick={() =>
                  history.push(`${map.BackToWorkPage}?isCore=${brick.isCore}`)} />
              </div>
            </Grid>
          </Grid>
        </div>
      </Hidden>
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <div className="brick-container mobile-final-step-page final-step-page">
          <div className="introduction-page">
            <div className="introduction-info">
              <div className="intro-text-row"></div>
            </div>
            <ExitButton onClick={() => history.push(map.backToWorkUserBased(user))} />
          </div>
        </div>
      </Hidden>
      <ShareDialogs
        shareOpen={shareOpen}
        brick={brick}
        user={user}
        close={() => setShare(false)}
      />
      <InviteDialog
        canEdit={true} brick={brick} isOpen={inviteOpen} hideAccess={true} isAuthor={isAuthor}
        accessGranted={true}
        submit={name => {
          setInviteResult({ isOpen: true, name, accessGranted: true } as InviteResult);
        }}
        close={() => setInvite(false)}
      />
      <InvitationSuccessDialog
        isAuthor={isAuthor}
        isOpen={inviteResult.isOpen} name={inviteResult.name} accessGranted={inviteResult.accessGranted}
        close={() => setInviteResult({ isOpen: false, name: '', accessGranted: false } as InviteResult)}
      />
      <ReturnAuthorSuccessDialog
        isOpen={returnAuthorOpen}
        author={brick.author}
        close={() => {
          setEditorsReturn(false)
          history.push(map.backToWorkUserBased(user));
        }}
      />
      <ReturnEditorsSuccessDialog
        isOpen={returnEditorsOpen}
        editors={brick.editors}
        close={() => {
          setEditorsReturn(false)
          history.push(map.backToWorkUserBased(user));
        }}
      />
      <PublishSuccessDialog
        isOpen={publishSuccess === PublishStatus.Popup}
        close={() => {
          setPublishSuccess(PublishStatus.Published);
          history.push(playRoutes.playCover(brick.id));
        }}
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
