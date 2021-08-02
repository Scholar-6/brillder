import React, { Component } from "react";

import map from "components/map";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import { Brick, BrickStatus } from "model/brick";

import SaveDialog from "./dialogs/SaveDialog";
import PlayButton from "./PlayButton";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import ReturnToAuthorButton from "./ReturnToAuthorButton";
import SendToPublisherButton from "./SendToPublisherButton";
import ReturnToEditorButton from "./ReturnToEditorButton";
import BuildPublishButton from "./PublishButton";
import { User } from "model/user";
import routes from "components/play/routes";
import CopyBrickButton from "./CopyBrickButton";
import { Question } from "model/question";


interface NavigationProps {
  // play button
  tutorialStep: TutorialStep;
  isTutorialSkipped: boolean;
  questions: Question[];
  isValid: boolean;
  moveToPreview(): void;

  // other buttons
  isPublisher: boolean;
  isEditor: boolean;
  isAdmin: boolean;
  isAuthor: boolean;
  history: any;
  user: User;
  brick: Brick;
  exitAndSave(): void;
}

interface NavigationState {
  brickStatus: BrickStatus;
  saveDialogOpen: boolean;
}

class BuildNavigation extends Component<NavigationProps, NavigationState> {
  constructor(props: NavigationProps) {
    super(props);

    this.state = {
      brickStatus: props.brick.status,
      saveDialogOpen: false
    }
  }

  renderReturnToAuthorButton() {
    const { brick } = this.props;
    const { brickStatus } = this.state;
    let disabled = brickStatus === BrickStatus.Draft;
    return <ReturnToAuthorButton
      disabled={disabled} history={this.props.history} brick={brick}
      user={this.props.user}
    />;
  }

  renderReturnToEditorButton() {
    const { brick } = this.props;
    const { brickStatus } = this.state;
    let disabled = brickStatus === BrickStatus.Build || brickStatus === BrickStatus.Publish;
    if (!this.props.isValid) {
      disabled = true;
    }

    if (this.props.isAdmin) {
      return <ReturnToEditorButton disabled={disabled} brick={brick} history={this.props.history} />;
    }

    // publisher
    if (this.props.isPublisher) {
      if (!disabled && brick.status === BrickStatus.Draft) {
        disabled = true;
      }
      return <ReturnToEditorButton disabled={disabled} brick={brick} history={this.props.history} />;
    }

    // author
    if (this.props.isAuthor && (brick.editors?.length ?? 0) > 0) {
      return <ReturnToEditorButton disabled={disabled} brick={brick} history={this.props.history} />;
    }

    return '';
  }

  renderSendToPublisherButton() {
    const { brick } = this.props;
    let disabled = this.state.brickStatus === BrickStatus.Review || !this.props.isValid;

    return (
      <SendToPublisherButton
        disabled={disabled}
        brick={brick}
        onFinish={() => {
          this.setState({ brickStatus: BrickStatus.Review });
          this.props.history.push(map.backToWorkUserBased(this.props.user));
        }}
      />
    );
  }

  renderPublisherButtons() {
    const { brickStatus } = this.state;
    let publishDisabled = brickStatus === BrickStatus.Publish;
    if (!this.props.isValid) {
      publishDisabled = true;
    }

    if (this.props.isPublisher || this.props.isAdmin) {
      if (!publishDisabled) {
        publishDisabled = brickStatus === BrickStatus.Draft || brickStatus === BrickStatus.Build;
      }

      return (
        <BuildPublishButton
          disabled={publishDisabled}
          brick={this.props.brick}
          history={this.props.history}
          onFinish={() => {
            this.setState({ brickStatus: BrickStatus.Publish });
            this.props.history.push(routes.playCover(this.props.brick.id));
          }}
        />
      );
    }
    return '';
  }

  renderSelfPublishButton() {
    return (
      <BuildPublishButton
        disabled={!this.props.isValid}
        brick={this.props.brick}
        history={this.props.history}
        onFinish={() => {
          this.setState({ brickStatus: BrickStatus.Publish });
          this.props.history.push(routes.playCover(this.props.brick.id));
        }}
      />
    );
  }

  renderCopyDraft() {
    return (
      <BuildPublishButton
        disabled={!this.props.isValid}
        brick={this.props.brick}
        history={this.props.history}
        onFinish={() => {
          this.setState({ brickStatus: BrickStatus.Publish });
          this.props.history.push(routes.playCover(this.props.brick.id));
        }}
      />
    );
  }

  render() {
    return (
      <div>
        <HomeButton history={this.props.history} onClick={() => this.setState({ saveDialogOpen: true })} />
        <PlayButton
          tutorialStep={this.props.tutorialStep}
          isTutorialSkipped={this.props.isTutorialSkipped}
          isValid={this.props.isValid}
          onClick={this.props.moveToPreview}
        />
        <SaveDialog
          open={this.state.saveDialogOpen}
          close={() => this.setState({ saveDialogOpen: false })}
          save={this.props.exitAndSave}
        />
        {this.props.brick.isCore ?
          <div className="build-navigation-buttons">
            {(this.props.isEditor || this.props.isAdmin) && this.renderReturnToAuthorButton()}
            {(this.props.isPublisher || this.props.isAuthor) && this.renderReturnToEditorButton()}
            {(this.props.isEditor || this.props.isAdmin || this.props.isPublisher) && this.renderSendToPublisherButton()}
            {this.props.isPublisher && this.renderPublisherButtons()}
          </div>
          : <div className="build-navigation-buttons">
            {this.renderSelfPublishButton()}
            {this.props.brick.status === BrickStatus.Publish && <CopyBrickButton history={this.props.history} brick={this.props.brick} questions={this.props.questions} />}
          </div>}
      </div>
    );
  }
};

export default BuildNavigation;
