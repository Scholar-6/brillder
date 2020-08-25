import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from 'react-redux';

import { ReduxCombinedState } from 'redux/reducers';
import sprite from "assets/img/icons-sprite.svg";
import { PlayMode } from './model';
import CommingSoonDialog from 'components/baseComponents/dialogs/CommingSoon';
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import { checkTeacherOrAdmin } from "components/services/brickService";
import { User } from "model/user";


interface SidebarProps {
  sidebarRolledUp: boolean;
  toggleSidebar(): void;
  user: User;

  // play
  empty?: boolean;
  mode?: PlayMode;
  setMode?(mode: PlayMode): void;

  //play-preview
  isPreview?: boolean;
  moveToBuild?(): void;
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
        this.props.setMode(PlayMode.UnHighlighting);
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
        <svg className="svg minimize-icon" onClick={() => this.props.toggleSidebar()}>
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#minimize-2"} />
        </svg>
      );
    }
    return (
      <svg className="svg minimize-icon" onClick={() => this.props.toggleSidebar()}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#maximize-2"} />
      </svg>
    );
  }


  renderHightlightText() {
    if (!this.props.sidebarRolledUp) {
      if (this.props.mode === PlayMode.UnHighlighting) {
        return <span>Unhighlight Text</span>;
      }
      return <span>Highlight Text</span>;
    }
    return "";
  }

  renderHightlightButton() {
    let className = "highlight-button sidebar-button";
    let icon = "#highlighter"
    const { mode } = this.props;
    if (mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) {
      className += " active";
    }
    if (mode === PlayMode.UnHighlighting) {
      icon = "#delete-2";
    }
    return (
      <MenuItem className={className} onClick={() => this.setHighlightMode()}>
        {this.renderHightlightText()}
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + icon} className="text-white" />
        </svg>
      </MenuItem>
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
      <MenuItem className="sidebar-button annotate-button" onClick={() => this.setAnotateMode()}>
        {!this.props.sidebarRolledUp ? <span>Annotate Text</span> : ""}
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#pen-tool"} />
        </svg>
      </MenuItem>
    );
  };

  renderAssignButton() {
    let canSee = checkTeacherOrAdmin(this.props.user.roles);
    if (!canSee) { return ""; }
    const openAssignDialog = () => {
      this.setState({ isAssigningOpen: true });
    }

    if (!this.props.sidebarRolledUp) {
      return (
        <div className="assign-button-container">
          <button onClick={openAssignDialog} className="assign-class-button">Assign Brick</button>
        </div>
      );
    }
    return (
      <div className="assign-button-container">
        <button onClick={openAssignDialog} className="assign-class-button sidebar-button btn-small">
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#file-plus"} />
          </svg>
        </button>
      </div>
    );
  }

  renderButtons() {
    if (this.props.isPreview) {
      if (this.props.sidebarRolledUp) {
        return (
          <div className="back-hover-area" onClick={() => this.moveToBuild()}>
            <div className="create-icon create-icon-small svgOnHover">
              <svg className="svg w100 h100 active">
                <use href={sprite + "#trowel"} />
              </svg>
            </div>
          </div>
        );
      } else {
        return (
          <div className="back-hover-area" onClick={() => this.moveToBuild()}>
            <div className="create-icon svgOnHover">
              <svg className="svg w100 h100 active">
                <use href={sprite + "#trowel"} />
              </svg>
            </div>
            <h3>BACK<br />TO<br />BUILD</h3>
          </div>
        );
      }
    }
    return (
      <div style={{ width: '100%' }}>
        {this.renderHightlightButton()}
        {this.renderAnotateButton()}
        {this.renderAssignButton()}
      </div>
    );
  }

  renderDialogs() {
    if (this.props.isPreview) { return ""; }
    let canSee = checkTeacherOrAdmin(this.props.user.roles);
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
        <div style={{ width: "100%" }}>{this.renderToggleButton()}</div>
        {this.renderButtons()}
        {this.renderDialogs()}
      </Grid>
    );
  }
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user
});

export default connect(mapState)(PlayLeftSidebarComponent);
