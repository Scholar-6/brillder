import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import sprite from "assets/img/icons-sprite.svg";
import { PlayMode } from './model';
import CommingSoonDialog from 'components/baseComponents/dialogs/CommingSoon';

interface SidebarProps {
  sidebarRolledUp: boolean;
  toggleSidebar(): void;

  // play
  mode?: PlayMode;
  setMode?(mode: PlayMode): void;

  //play-preview
  isPreview?: boolean;
  moveToBuild?(): void;
}

interface SidebarState {
  isCoomingSoonOpen: boolean;
}

class PlayLeftSidebarComponent extends Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      isCoomingSoonOpen: false
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
          <use href={sprite + "#maximize-2"} />
        </svg>
      );
    }
    return (
      <svg className="svg minimize-icon" onClick={() => this.props.toggleSidebar()}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#minimize-2"} />
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
    let className = "sidebar-button";
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
      <div>
        {this.renderHightlightButton()}
        {this.renderAnotateButton()}
      </div>
    );
  }

  render() {
    let className = "sort-and-filter-container play-sidebar";
    if (this.props.sidebarRolledUp) {
      className += " rolled-up";
    }

    return (
      <Grid container item className={className}>
        <div style={{ width: "100%" }}>{this.renderToggleButton()}</div>
        {this.renderButtons()}
        <CommingSoonDialog isOpen={this.state.isCoomingSoonOpen} close={() => this.toggleCommingSoon()} />
      </Grid>
    );
  }
};

export default PlayLeftSidebarComponent;
