import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from 'react-redux';

import actions from "redux/actions/brickActions";
import { ReduxCombinedState } from 'redux/reducers';
import { PlayMode } from './model';
import CommingSoonDialog from 'components/baseComponents/dialogs/CommingSoon';
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import { checkTeacherOrAdmin } from "components/services/brickService";
import { User } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import UnauthorizedText from "./UnauthorizedText";
import { Brick } from "model/brick";
import AdaptBrickDialog from "components/baseComponents/dialogs/AdaptBrickDialog";
import map from "components/map";
import AssignSuccessDialog from "components/baseComponents/dialogs/AssignSuccessDialog";
import axios from "axios";
import ShareDialog from "./finalStep/dialogs/ShareDialog";
import LinkDialog from "./finalStep/dialogs/LinkDialog";
import LinkCopiedDialog from "./finalStep/dialogs/LinkCopiedDialog";
import InviteDialog from "./finalStep/dialogs/InviteDialog";
import InvitationSuccessDialog from "./finalStep/dialogs/InvitationSuccessDialog";
import HighlightTextButton from "./baseComponents/sidebarButtons/HighlightTextButton";
import ShareButton from "./baseComponents/sidebarButtons/ShareButton";


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

interface InviteResult {
  isOpen: boolean;
  accessGranted: boolean;
  name: string;
}

interface SidebarState {
  isAdaptBrickOpen: boolean;
  isCoomingSoonOpen: boolean;
  isAssigningOpen: boolean;
  isAssignedSuccessOpen: boolean;
  isSharingOpen: boolean;
  isLinkOpen: boolean;
  linkCopiedOpen: boolean;
  inviteOpen: boolean;
  inviteResult: InviteResult;
  selectedItems: any[];
}

class PlayLeftSidebarComponent extends Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      isAdaptBrickOpen: false,
      isCoomingSoonOpen: false,
      isAssigningOpen: false,
      isAssignedSuccessOpen: false,
      isSharingOpen: false,
      isLinkOpen: false,
      linkCopiedOpen: false,
      inviteOpen: false,
      inviteResult: {
        isOpen: false,
        accessGranted: false,
        name: ''
      },
      selectedItems: []
    }
  }

  setHighlightMode() {
    if (this.props.setMode) {
      if (this.props.mode === PlayMode.Highlighting) {
        this.props.setMode(PlayMode.Normal);
      } else {
        this.props.setMode(PlayMode.Highlighting);
      }
    }
  }

  toggleCommingSoon() {
    this.setState({ isCoomingSoonOpen: !this.state.isCoomingSoonOpen });
  }

  renderToggleButton() {
    if (this.props.sidebarRolledUp) {
      return (
        <div className="minimize-icon svgOnHover" onClick={() => this.props.toggleSidebar()}>
          <SpriteIcon name="maximize" className="active" />
        </div>
      );
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
    this.setState({isSharingOpen: true});
  }

  renderAssignButton() {
    if (!this.props.user) { return ""; }
    let canSee = checkTeacherOrAdmin(this.props.user.roles);
    if (!canSee) { return ""; }
    const openAssignDialog = () => {
      this.setState({ isAssigningOpen: true });
    }

    if (!this.props.sidebarRolledUp) {
      return (
        <button onClick={openAssignDialog} className="assign-class-button svgOnHover">
          <span>Assign Brick</span>
        </button>
      );
    }
    return (
      <button onClick={openAssignDialog} className="assign-class-button svgOnHover">
        <SpriteIcon name="file-plus" className="active" />
      </button>
    );
  }

  async createBrickCopy() {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/adapt/${this.props.brick.id}`,
      {},
      { withCredentials: true }
    );
    const copyBrick = response.data as Brick;

    await this.props.fetchBrick(copyBrick.id);
    if (copyBrick) {
      this.props.history.push(map.ProposalReview + '?bookHovered=true&copied=true');
    } else {
      console.log('can`t copy');
    }
  }

  renderAdaptButton() {
    if (!this.props.user) { return ""; }
    let canSee = checkTeacherOrAdmin(this.props.user.roles);
    if (!canSee) { return ""; }

    if (!this.props.sidebarRolledUp) {
      return (
        <button onClick={() => this.setState({isAdaptBrickOpen: true})} className="assign-class-button svgOnHover blue">
          <span>Adapt Brick</span>
        </button>
      );
    }
    return (
      <button onClick={() => this.setState({isAdaptBrickOpen: true})} className="assign-class-button svgOnHover blue">
        <SpriteIcon name="copy" className="active" />
      </button>
    );
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
              BACK TO BUILD
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
    return (
      <div className="sidebar-button">
        <HighlightTextButton
          mode={this.props.mode}
          sidebarRolledUp={this.props.sidebarRolledUp}
          setHighlightMode={this.setHighlightMode.bind(this)}
        />
        <ShareButton sidebarRolledUp={this.props.sidebarRolledUp} share={this.share.bind(this)} />
        {this.renderAssignButton()}
        {this.renderAdaptButton()}
      </div>
    );
  }

  renderDialogs() {
    if (this.props.isPreview) { return ""; }

    let canSee = false;
    try {
      canSee = checkTeacherOrAdmin(this.props.user.roles);
    } catch { }

    const {brick} = this.props;
    const {inviteResult} = this.state;

    let isAuthor = false;
    try {
      isAuthor = brick.author.id === this.props.user.id;
    } catch {}

    const link = `/play/brick/${brick.id}/intro`;

    return (
      <div>
        <CommingSoonDialog isOpen={this.state.isCoomingSoonOpen} close={() => this.toggleCommingSoon()} />
        <AdaptBrickDialog
          isOpen={this.state.isAdaptBrickOpen}
          close={() => this.setState({isAdaptBrickOpen: false})}
          submit={this.createBrickCopy.bind(this)}
        />
        {canSee &&
          <AssignPersonOrClassDialog
            isOpen={this.state.isAssigningOpen}
            success={(items: any[]) => {
              this.setState({ isAssigningOpen: false, selectedItems: items, isAssignedSuccessOpen: true
            })}}
            close={() => this.setState({ isAssigningOpen: false })}
          />}
        <AssignSuccessDialog
          isOpen={this.state.isAssignedSuccessOpen}
          brickTitle={this.props.brick.title}
          selectedItems={this.state.selectedItems}
          close={() => this.setState({isAssignedSuccessOpen: false})}
        />
        <ShareDialog
          isOpen={this.state.isSharingOpen}
          link={() => { this.setState({isSharingOpen: false, isLinkOpen: true }) }}
          invite={() => { this.setState({isSharingOpen: false, inviteOpen: true})}}
          close={() => this.setState({isSharingOpen: false})}
        />
        <LinkDialog
          isOpen={this.state.isLinkOpen}
          link={document.location.host + link}
          submit={() => this.setState({isLinkOpen: false, linkCopiedOpen: true})}
          close={() => this.setState({isLinkOpen: false})}
        />
        <LinkCopiedDialog
          isOpen={this.state.linkCopiedOpen}
          close={()=> this.setState({linkCopiedOpen: false})}
        />
        <InviteDialog
          canEdit={true} brick={brick} isOpen={this.state.inviteOpen} hideAccess={true} isAuthor={isAuthor}
          submit={name => this.setState({ inviteResult: { isOpen: true, name, accessGranted: false }})}
          close={() => this.setState({inviteOpen: false})}
        />
        <InvitationSuccessDialog
          isAuthor={isAuthor}
          isOpen={inviteResult.isOpen} name={inviteResult.name} accessGranted={inviteResult.accessGranted}
          close={() => this.setState({inviteResult: { isOpen: false, name: '', accessGranted: false }})}
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
