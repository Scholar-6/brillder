import React, { Component } from "react";

import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";

import SaveDialog from "./dialogs/SaveDialog";
import PlayButton from "./PlayButton";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import ReturnToAuthorButton from "./ReturnToAuthorButton";
import SendToPublisherButton from "./SendToPublisherButton";


interface NavigationProps {
  // play button
  tutorialStep: TutorialStep;
  isTutorialSkipped: boolean;
  isValid: boolean;
  moveToReview(): void;

  // other buttons
  isEditor: boolean;
  history: any;
  brickId: number;
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
        {this.props.isEditor &&
          <div>
            <ReturnToAuthorButton history={this.props.history} brickId={this.props.brickId} />
            <SendToPublisherButton history={this.props.history} brickId={this.props.brickId} />
          </div>
        }
      </div>
    );
  }
};

export default BuildNavigation;
