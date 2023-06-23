import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from 'react-redux';
import axios from "axios";

import actions from "redux/actions/brickActions";
import playActions from "redux/actions/play";
import { ReduxCombinedState } from 'redux/reducers';
import { PlayMode } from './model';
import { User } from "model/user";
import { Brick } from "model/brick";
import routes, { PlayPreInvestigationLastPrefix } from "./routes";
import { isInstitutionPreference } from "components/services/preferenceService";
import { checkAdmin, checkTeacherOrAdmin } from "components/services/brickService";
import { getCompetitionByUser } from "services/axios/competitions";
import { Competition } from "model/competition";
import { checkCompetitionActive } from "services/competition";

import CommingSoonDialog from 'components/baseComponents/dialogs/CommingSoon';
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import UnauthorizedText from "./UnauthorizedText";
import AdaptBrickDialog from "components/baseComponents/dialogs/AdaptBrickDialog";
import AssignSuccessDialog from "components/baseComponents/dialogs/AssignSuccessDialog";
import HighlightTextButton from "./baseComponents/sidebarButtons/HighlightTextButton";
import ShareButton from "./baseComponents/sidebarButtons/ShareButton";
import AssignButton from "./baseComponents/sidebarButtons/AssignButton";
import AdaptButton from "./baseComponents/sidebarButtons/AdaptButton";
import AssignFailedDialog from "components/baseComponents/dialogs/AssignFailedDialog";
import ShareDialogs from "./finalStep/dialogs/ShareDialogs";
import GenerateCoverButton from "./baseComponents/sidebarButtons/GenerateCoverButton";
import CompetitionButton from "./baseComponents/sidebarButtons/CompetitionButton";
import CompetitionDialog from "components/baseComponents/dialogs/CompetitionDialog";
import HighScore from "./baseComponents/HighScore";
import AdminBrickStatisticButton from "./baseComponents/AdminBrickStatisticButton";
import QuickAssignButton from "./baseComponents/sidebarButtons/QuickAssignButton";

interface SidebarProps {
  history: any;
  sidebarRolledUp: boolean;
  toggleSidebar(): void;

  liveBrills?: number;
  reviewBrills?: number;

  bestScore: number;

  // play
  brick: Brick;
  empty?: boolean;
  mode?: PlayMode;
  setMode?(mode: PlayMode): void;

  //play-preview
  isPreview?: boolean;
  competition: any;
  showPremium?(): void;
  moveToBuild?(): void;
  competitionCreated(c: Competition): void;

  //redux
  user: User;
  competitionId?: number;
  fetchBrick(brickId: number): Promise<Brick | null>;

  assignPopup: boolean;
  setAssignPopup(isOpen: boolean): void;
}

interface SidebarState {
  isAdaptBrickOpen: boolean;
  competition: any | null;
  isCompetitionOpen: boolean;
  isCoomingSoonOpen: boolean;
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
      competition: null,
      isCompetitionOpen: false,
      isAdaptBrickOpen: false,
      isCoomingSoonOpen: false,
      isAssignedSuccessOpen: false,
      isAssignedFailedOpen: false,
      isSharingOpen: false,
      selectedItems: [],
      failedItems: []
    }

    if (this.props.user) {
      this.getCompetition();
    }
  }

  async getCompetition() {
    const c = await getCompetitionByUser(this.props.user.id, this.props.brick.id);
    if (c) {
      const isActive = checkCompetitionActive(c);
      if (isActive) {
        this.props.competitionCreated(c);
      }
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
    this.props.setAssignPopup(true);
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

  async createCompetition(startDate: any, endDate: any) {
    // creation competition
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/competition`,
      { startDate, endDate, brickId: this.props.brick.id },
      { withCredentials: true }
    );
    if (response.status === 200) {
      await this.getCompetition();
    }
    return;
  }

  onAdaptDialog() {
    this.setState({ isAdaptBrickOpen: true });
  }

  onCompetition() {
    this.setState({ isCompetitionOpen: true });
  }

  async onDownload() {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_HOST}/competitionPDF/${this.state.competition.id}`,
      { withCredentials: true, responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.pdf');
    document.body.appendChild(link);
    link.click();
  }

  isLive() {
    return this.props.history.location.pathname.slice(-5) === '/live';
  }

  isCover() {
    try {
      const coverPart = this.props.history.location.pathname.split('/')[4];
      if (coverPart === 'cover') {
        return true;
      }
    } catch {
      console.log('something wrong with path');
      return false;
    }
    return false;
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
    this.isCover();
    if (this.props.isPreview) {
      if (this.props.sidebarRolledUp) {
        return (
          <div className="back-hover-area small" onClick={() => this.moveToBuild()}>
            <div className="create-icon create-icon-small svgOnHover">
              <SpriteIcon name="trowel" className="w100 h100 active" />
            </div>
            <div className="create-icon-label">
              B<br />A<br />C<br />K<br /><br />T<br />O<br /><br />B<br />U<br />I<br />L<br />D
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

    const renderAdaptButton = () => {
      if (this.props.competitionId && this.props.competitionId > 0) {
        return <div />;
      }
      return (
        <AdaptButton
          user={this.props.user}
          haveCircle={haveBriefCircles}
          sidebarRolledUp={sidebarRolledUp}
          onClick={this.onAdaptDialog.bind(this)}
        />
      );
    }

    const isAdmin = checkAdmin(this.props.user.roles);

    return (
      <div className="sidebar-button">
        {(this.isPrep() || this.isSynthesis()) && <HighlightTextButton
          mode={this.props.mode}
          sidebarRolledUp={sidebarRolledUp}
          haveCircle={haveBriefCircles}
          setHighlightMode={this.setHighlightMode.bind(this)}
        />}
        {/* 
        <QuickAssignButton
          sidebarRolledUp={sidebarRolledUp}
          user={this.props.user}
          brick={this.props.brick}
          haveCircle={haveBriefCircles}
          history={this.props.history}
          showPremium={() => this.props.showPremium && this.props.showPremium()}
        />*/}
        <AssignButton
          sidebarRolledUp={sidebarRolledUp}
          user={this.props.user}
          haveCircle={haveBriefCircles}
          history={this.props.history}
          openAssignDialog={this.openAssignDialog.bind(this)}
        />
        {renderAdaptButton()}
        <ShareButton haveCircle={haveBriefCircles} sidebarRolledUp={sidebarRolledUp} share={this.share.bind(this)} />
        {checkTeacherOrAdmin(this.props.user) &&
          <GenerateCoverButton
            sidebarRolledUp={sidebarRolledUp}
            brick={this.props.brick}
          />
        }
        {(isInstitutionPreference(this.props.user) || isAdmin) &&
          <CompetitionButton competitionPresent={this.state.competition !== null} sidebarRolledUp={sidebarRolledUp} onDownload={this.onDownload.bind(this)} onClick={this.onCompetition.bind(this)} />}
        {isAdmin && <AdminBrickStatisticButton brick={this.props.brick} history={this.props.history} />}
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
          submit={(start: any, end: any) => {
            this.setState({ isCompetitionOpen: false });
            this.createCompetition(start, end);
          }}
        />
        {canSee &&
          <AssignPersonOrClassDialog
            isOpen={this.props.assignPopup}
            user={this.props.user}
            history={this.props.history}
            success={(items: any[], failedItems: any[]) => {
              if (items.length > 0) {
                this.props.setAssignPopup(false);
                this.setState({ selectedItems: items, failedItems, isAssignedSuccessOpen: true });
              } else if (failedItems.length > 0) {
                this.setState({ failedItems, isAssignedFailedOpen: true });
              }
            }}
            showPremium={() => this.props.showPremium && this.props.showPremium()}
            close={() => this.props.setAssignPopup(false)}
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
          {!this.props.sidebarRolledUp &&
            <div className="brick-info">
              <div className="hover-area">
                Brick N<sub className="smaller">o.</sub> {this.props.brick.id}
                <div className="hover-content">
                  <div>A brick is a learning unit that should take either 20, 40, or 60 minutes to complete.</div>
                  <br />
                  <div>Bricks follow a cognitively optimised sequence:</div>
                  <div className="container">
                    <div className="white-circle">1</div>
                    <div className="l-text">
                      Preparation: <span className="regular">stimulus content gets you in the zone.</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">2</div>
                    <div className="l-text">
                      Investigation: <span className="regular">challenging interactive questions make you think.</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">3</div>
                    <div className="l-text">
                      <span className="regular">A preliminary score</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">4</div>
                    <div className="l-text">
                      Synthesis: <span className="regular">explanation.</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">5</div>
                    <div className="l-text">
                      Review: <span className="regular">hints help you correct your answers.</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">6</div>
                    <div className="l-text">
                      <span className="regular">A final score</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          <div className="sidebar-button f-align-end">
            {this.renderToggleButton()}
          </div>
          <HighScore
            bestScore={this.props.bestScore}
            sidebarRolledUp={this.props.sidebarRolledUp} />
          {this.renderButtons()}
          {this.renderDialogs()}
        </div>
      </Grid >
    );
  }
};

const mapState = (state: ReduxCombinedState) => ({
  assignPopup: state.play.assignPopup,
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  setAssignPopup: (isOpen: boolean) => dispatch(playActions.setAssignPopup(isOpen)),
  fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
});

export default connect(mapState, mapDispatch)(PlayLeftSidebarComponent);
