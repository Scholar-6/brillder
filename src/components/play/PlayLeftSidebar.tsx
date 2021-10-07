import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from 'react-redux';

import actions from "redux/actions/brickActions";
import { ReduxCombinedState } from 'redux/reducers';
import { PlayMode } from './model';
import CommingSoonDialog from 'components/baseComponents/dialogs/CommingSoon';
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import { checkAdmin, checkTeacherOrAdmin } from "components/services/brickService";
import { User } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import UnauthorizedText from "./UnauthorizedText";
import { Brick } from "model/brick";
import AdaptBrickDialog from "components/baseComponents/dialogs/AdaptBrickDialog";
import AssignSuccessDialog from "components/baseComponents/dialogs/AssignSuccessDialog";
import axios from "axios";
import HighlightTextButton from "./baseComponents/sidebarButtons/HighlightTextButton";
import ShareButton from "./baseComponents/sidebarButtons/ShareButton";
import AssignButton from "./baseComponents/sidebarButtons/AssignButton";
import AdaptButton from "./baseComponents/sidebarButtons/AdaptButton";
import AssignFailedDialog from "components/baseComponents/dialogs/AssignFailedDialog";
import routes, { PlayPreInvestigationLastPrefix } from "./routes";
import ShareDialogs from "./finalStep/dialogs/ShareDialogs";
import GenerateCoverButton from "./baseComponents/sidebarButtons/GenerateCoverButton";
import { isInstitutionPreference } from "components/services/preferenceService";
import CompetitionButton from "./baseComponents/sidebarButtons/CompetitionButton";
import CompetitionDialog from "components/baseComponents/dialogs/CompetitionDialog";

interface SidebarProps {
  history: any;
  sidebarRolledUp: boolean;
  toggleSidebar(): void;

  // play
  brick: Brick;
  empty?: boolean;
  mode?: PlayMode;
  setMode?(mode: PlayMode): void;

  //play-preview
  isPreview?: boolean;
  moveToBuild?(): void;

  //redux
  user: User;
  fetchBrick(brickId: number): Promise<Brick | null>;
}

interface SidebarState {
  isAdaptBrickOpen: boolean;
  isCompetitionOpen: boolean;
  isCoomingSoonOpen: boolean;
  isAssigningOpen: boolean;
  isAssignedSuccessOpen: boolean;
  isAssignedFailedOpen: boolean;
  isSharingOpen: boolean;
  isAdapting: boolean;
  selectedItems: any[];
  failedItems: any[];
}

class PlayLeftSidebarComponent extends Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      isAdapting: false,
      isCompetitionOpen: false,
      isAdaptBrickOpen: false,
      isCoomingSoonOpen: false,
      isAssigningOpen: false,
      isAssignedSuccessOpen: false,
      isAssignedFailedOpen: false,
      isSharingOpen: false,
      selectedItems: [],
      failedItems: []
    }
  }

  setHighlightMode() {
    if (this.props.setMode) {
      if (this.props.mode === PlayMode.Normal) {
        this.props.setMode(PlayMode.Highlighting);
      } else {
        this.props.setMode(PlayMode.Normal);
      }
    }
  }

  toggleCommingSoon() {
    this.setState({ isCoomingSoonOpen: !this.state.isCoomingSoonOpen });
  }

  renderToggleButton() {
    if (this.props.sidebarRolledUp) {
      if (this.isCover()) {
        return (
          <div className="maximize-icon svgOnHover" onClick={() => this.props.toggleSidebar()}>
            <SpriteIcon name="maximize" className="active" />
          </div>
        );
      }
      return <div />
    }
    return (
      <div className="maximize-icon svgOnHover" onClick={() => this.props.toggleSidebar()}>
        <SpriteIcon name="minimize" className="active" />
      </div>
    );
  }

  setAnotateMode() {
    if (this.props.setMode) {
      this.props.setMode(PlayMode.Anotating);
    }
    this.toggleCommingSoon();
  }

  moveToBuild() {
    if (this.props.moveToBuild) {
      this.props.moveToBuild();
    }
  }

  share() {
    this.setState({ isSharingOpen: true });
  }

  openAssignDialog() {
    this.setState({ isAssigningOpen: true });
  }

  async createBrickCopy() {
    // prevent multiple clicking
    if (this.state.isAdapting) {
      return;
    }
    this.setState({ isAdapting: true });
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/adapt/${this.props.brick.id}`,
      {},
      { withCredentials: true }
    );
    const copyBrick = response.data as Brick;

    await this.props.fetchBrick(copyBrick.id);
    if (copyBrick) {
      this.props.history.push(`/build/brick/${copyBrick.id}/plan?bookHovered=true&copied=true`);
    } else {
      console.log('can`t copy');
    }
    this.setState({ isAdapting: false })
  }

  async createCompetition() {
    // creation competition
  }

  onAdaptDialog() {
    this.setState({ isAdaptBrickOpen: true });
  }

  onCompetition() {
    this.setState({ isCompetitionOpen: true });
  }

  isLive() {
    return this.props.history.location.pathname.slice(-5) === '/live';
  }

  isCover() {
    return this.props.history.location.pathname.slice(-6) === '/cover';
  }

  isPreInvesigation() {
    return this.props.history.location.pathname.search(PlayPreInvestigationLastPrefix) >= 0;
  }

  isProvisional() {
    return this.props.history.location.pathname.slice(-17) === '/provisionalScore';
  }

  isSynthesis() {
    return this.props.history.location.pathname.slice(-10) === '/synthesis';
  }

  isPrep() {
    return this.props.history.location.pathname.slice(-routes.PlayNewPrepLastPrefix.length) === routes.PlayNewPrepLastPrefix;
  }

  isEnding() {
    return this.props.history.location.pathname.slice(-7) === '/ending';
  }

  renderButtons() {
    if (this.props.isPreview) {
      if (this.props.sidebarRolledUp) {
        return (
          <div className="back-hover-area small" onClick={() => this.moveToBuild()}>
            <div className="create-icon create-icon-small svgOnHover">
              <SpriteIcon name="trowel" className="w100 h100 active" />
            </div>
            <div className="create-icon-label">
              B<br/>A<br/>C<br/>K<br/><br/>T<br/>O<br/><br/>B<br/>U<br/>I<br/>L<br/>D
            </div>
          </div>
        );
      } else {
        return (
          <div className="back-hover-area" onClick={() => this.moveToBuild()}>
            <div className="create-icon svgOnHover">
              <SpriteIcon name="trowel" className="w100 h100 active" />
            </div>
            <h3>BACK<br />TO<br />BUILD</h3>
          </div>
        );
      }
    }
    if (!this.props.user) {
      if (!this.props.sidebarRolledUp) {
        return <UnauthorizedText />;
      } else {
        return <div></div>;
      }
    }

    const { sidebarRolledUp } = this.props;
    const haveBriefCircles = this.props.history.location.pathname.slice(-routes.PlayBriefLastPrefix.length) === routes.PlayBriefLastPrefix;

    return (
      <div className="sidebar-button">
        {(this.isPrep() || this.isSynthesis()) && <HighlightTextButton
          mode={this.props.mode}
          sidebarRolledUp={sidebarRolledUp}
          haveCircle={haveBriefCircles}
          setHighlightMode={this.setHighlightMode.bind(this)}
        />}
        <ShareButton haveCircle={haveBriefCircles} sidebarRolledUp={sidebarRolledUp} share={this.share.bind(this)} />
        <AssignButton
          sidebarRolledUp={sidebarRolledUp}
          user={this.props.user}
          haveCircle={haveBriefCircles}
          history={this.props.history}
          openAssignDialog={this.openAssignDialog.bind(this)}
        />
        <AdaptButton
          user={this.props.user}
          haveCircle={haveBriefCircles}
          sidebarRolledUp={sidebarRolledUp}
          onClick={this.onAdaptDialog.bind(this)}
        />
        {(isInstitutionPreference(this.props.user) || checkAdmin(this.props.user.roles)) &&
          <GenerateCoverButton
            sidebarRolledUp={sidebarRolledUp}
            brick={this.props.brick}
          />
        }
        {(isInstitutionPreference(this.props.user) || checkAdmin(this.props.user.roles)) && <CompetitionButton sidebarRolledUp={sidebarRolledUp} onClick={this.onCompetition.bind(this)} />}
      </div>
    );
  }

  renderDialogs() {
    if (this.props.isPreview) { return ""; }

    const { brick, user } = this.props;

    let canSee = false;
    try {
      canSee = checkTeacherOrAdmin(user);
    } catch { }


    return (
      <div>
        <CommingSoonDialog isOpen={this.state.isCoomingSoonOpen} close={() => this.toggleCommingSoon()} />
        <AdaptBrickDialog
          isOpen={this.state.isAdaptBrickOpen}
          close={() => this.setState({ isAdaptBrickOpen: false })}
          submit={this.createBrickCopy.bind(this)}
        />
        <CompetitionDialog
          isOpen={this.state.isCompetitionOpen}
          close={() => this.setState({ isCompetitionOpen: false })}
          submit={() => {
            this.setState({ isCompetitionOpen: false });
            this.createCompetition();
          }}
        />
        {canSee &&
          <AssignPersonOrClassDialog
            isOpen={this.state.isAssigningOpen}
            history={this.props.history}
            success={(items: any[], failedItems: any[]) => {
              if (items.length > 0) {
                this.setState({ isAssigningOpen: false, selectedItems: items, failedItems, isAssignedSuccessOpen: true });
              } else if (failedItems.length > 0) {
                this.setState({ failedItems, isAssignedFailedOpen: true });
              }
            }}
            close={() => this.setState({ isAssigningOpen: false })}
          />}
        <AssignSuccessDialog
          isOpen={this.state.isAssignedSuccessOpen}
          brickTitle={brick.title}
          selectedItems={this.state.selectedItems}
          close={() => {
            if (this.state.failedItems.length > 0) {
              this.setState({ isAssignedSuccessOpen: false, isAssignedFailedOpen: true });
            } else {
              this.setState({ isAssignedSuccessOpen: false });
            }
          }}
        />
        <AssignFailedDialog
          isOpen={this.state.isAssignedFailedOpen}
          brickTitle={brick.title}
          selectedItems={this.state.failedItems}
          close={() => this.setState({ isAssignedFailedOpen: false, failedItems: [] })}
        />
        <ShareDialogs
          shareOpen={this.state.isSharingOpen}
          brick={brick}
          user={user}
          close={() => this.setState({ isSharingOpen: false })}
        />
      </div>
    );
  }

  render() {
    let className = "sort-and-filter-container play-sidebar";
    if (this.props.sidebarRolledUp) {
      className += " rolled-up";
    }

    if (this.props.empty) {
      return <Grid container item className={className}></Grid>
    }

    return (
      <Grid container item className={className}>
        <div className="collapsable-sidebar">
          <div className="sidebar-button f-align-end">
            {this.renderToggleButton()}
          </div>
          {this.renderButtons()}
          {this.renderDialogs()}
        </div>
      </Grid>
    );
  }
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
});

export default connect(mapState, mapDispatch)(PlayLeftSidebarComponent);
