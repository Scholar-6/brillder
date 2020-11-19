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
import { Brick, BrickStatus } from "model/brick";


interface SidebarProps {
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
  createBrick(b: Brick): Promise<Brick | null>; 
}

interface SidebarState {
  isCoomingSoonOpen: boolean;
  isAssigningOpen: boolean;
}

class PlayLeftSidebarComponent extends Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      isCoomingSoonOpen: false,
      isAssigningOpen: false,
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

  renderHightlightText() {
    if (!this.props.sidebarRolledUp) {
      if (this.props.mode === PlayMode.UnHighlighting) {
        return <span>Unhighlight Text</span>;
      }
      return <span>Highlight Text</span>;
    } else {
      return <span></span>;
    }
  }

  renderHightlightButton() {
    let className = "highlight-button svgOnHover";
    let icon = "highlighter"
    const { mode } = this.props;
    if (mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) {
      className += " active";
    }
    if (mode === PlayMode.UnHighlighting) {
      icon = "#trash";
    }
    return (
      <div className={className} onClick={() => this.setHighlightMode()}>
        {this.renderHightlightText()}
        <SpriteIcon name={icon} className="active" />
      </div>
    );
  };

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

  renderAnotateButton() {
    return (
      <div className="annotate-button svgOnHover" onClick={() => this.setAnotateMode()}>
        {!this.props.sidebarRolledUp ? <span>Annotate Text</span> : <span></span>}
        <SpriteIcon name="pen-tool" className="active" />
      </div>
    );
  };

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
    let brick = Object.assign({}, this.props.brick);
    brick.id = null as any;
    brick.status = BrickStatus.Draft;
    delete brick.editors;
    delete brick.publisher;
    await this.props.createBrick(brick);
  }

  renderAdaptButton() {
    if (!this.props.user) { return ""; }
    let canSee = checkTeacherOrAdmin(this.props.user.roles);
    if (!canSee) { return ""; }

    if (!this.props.sidebarRolledUp) {
      return (
        <button onClick={this.createBrickCopy.bind(this)} className="assign-class-button svgOnHover blue">
          <span>Adapt Brick</span>
        </button>
      );
    }
    return (
      <button onClick={this.createBrickCopy.bind(this)} className="assign-class-button svgOnHover blue">
        <SpriteIcon name="copy" className="active" />
      </button>
    );
  }

  renderButtons() {
    if (this.props.isPreview) {
      if (this.props.sidebarRolledUp) {
        return (
          <div className="back-hover-area" onClick={() => this.moveToBuild()}>
            <div className="create-icon create-icon-small svgOnHover">
              <SpriteIcon name="trowel" className="w100 h100 active" />
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
        {this.renderHightlightButton()}
        {this.renderAnotateButton()}
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

    return (
      <div>
        <CommingSoonDialog isOpen={this.state.isCoomingSoonOpen} close={() => this.toggleCommingSoon()} />
        {canSee ?
          <AssignPersonOrClassDialog
            isOpen={this.state.isAssigningOpen}
            close={() => { this.setState({ isAssigningOpen: false }) }}
          /> : ""}
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
  createBrick: (brick: any) => dispatch(actions.createBrick(brick)),
});

export default connect(mapState, mapDispatch)(PlayLeftSidebarComponent);
