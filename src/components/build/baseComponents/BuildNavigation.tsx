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
  history: any;
  brick: Brick;
  exitAndSave(): void;
}

interface NavigationState {
  saveDialogOpen: boolean;
}

class BuildNavigation extends Component<NavigationProps, NavigationState> {
  constructor(props: NavigationProps) {
    super(props);

    this.state = {
      saveDialogOpen: false
    }
  }

  renderPublisherButtons() {
    const {brick} = this.props;
    if (brick.status === BrickStatus.Review && this.props.isPublisher) {
      return (
        <div>
          <ReturnToEditorButton brick={brick} history={this.props.history} />
          <BuildPublishButton brick={brick} history={this.props.history} />
        </div>
      );
    }
    return '';
  }

  renderEditorButtons() {
    const {brick} = this.props;
    if (brick.status === BrickStatus.Build) {
      return (
        <div>
          <ReturnToAuthorButton history={this.props.history} brickId={brick.id} />
          <SendToPublisherButton history={this.props.history} brickId={brick.id} />
        </div>
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
          {this.props.isPublisher && this.renderPublisherButtons()}
          {this.props.isEditor && this.renderEditorButtons()}
        </div>
      </div>
    );
  }
};

export default BuildNavigation;
