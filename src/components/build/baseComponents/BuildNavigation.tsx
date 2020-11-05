import React, { Component } from "react";

import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";

import SaveDialog from "./dialogs/SaveDialog";
import PlayButton from "./PlayButton";
import { Brick, BrickStatus } from "model/brick";

import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import ReturnToAuthorButton from "./ReturnToAuthorButton";
import SendToPublisherButton from "./SendToPublisherButton";
import ReturnToEditorButton from "./ReturnToEditorButton";
import BuildPublishButton from "./PublishButton";


interface NavigationProps {
  // play button
  tutorialStep: TutorialStep;
  isTutorialSkipped: boolean;
  isValid: boolean;
  moveToReview(): void;

  // other buttons
  isPublisher: boolean;
  isEditor: boolean;
  isAdmin: boolean;
  history: any;
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
    const {brick} = this.props;
    let disabled = this.state.brickStatus !== BrickStatus.Build;
    return <ReturnToAuthorButton disabled={disabled} history={this.props.history} brickId={brick.id} />;
  }

  renderReturnToEditorButton() {
    const {brick} = this.props;
    let disabled = this.state.brickStatus !== BrickStatus.Review;

    if (this.props.isPublisher) {
      return <ReturnToEditorButton disabled={disabled} brick={brick} history={this.props.history} />;
    }
    return '';
  }

  renderSendToPublisherButton() {
    const {brick} = this.props;
    let disabled = this.state.brickStatus !== BrickStatus.Build;

    return (
      <SendToPublisherButton
        disabled={disabled}
        brickId={brick.id}
        onFinish={() => this.setState({brickStatus: BrickStatus.Review})}
      />
    );
  }

  renderPublisherButtons() {
    const {brick} = this.props;
    let publishDisabled = this.state.brickStatus === BrickStatus.Publish;

    if (this.props.isPublisher) {
      return (
        <BuildPublishButton
          disabled={publishDisabled}
          brick={brick}
          history={this.props.history}
          onFinish={() => this.setState({brickStatus: BrickStatus.Publish})}
        />
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <HomeButton onClick={() => this.setState({saveDialogOpen: true})} />
        <PlayButton
          tutorialStep={this.props.tutorialStep}
          isTutorialSkipped={this.props.isTutorialSkipped}
          isValid={this.props.isValid}
          onClick={this.props.moveToReview}
        />
        <SaveDialog
          open={this.state.saveDialogOpen}
          close={() => this.setState({saveDialogOpen: false})}
          save={this.props.exitAndSave}
        />
        <div className="build-navigation-buttons">
          {(this.props.isEditor || this.props.isAdmin) && this.renderReturnToAuthorButton()}
          {this.props.isPublisher && this.renderReturnToEditorButton()}
          {(this.props.isEditor || this.props.isAdmin) && this.renderSendToPublisherButton()}
          {this.props.isPublisher && this.renderPublisherButtons()}
        </div>
      </div>
    );
  }
};

export default BuildNavigation;
