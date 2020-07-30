import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import sprite from "../../../assets/img/icons-sprite.svg";
import { PlayMode } from './model';

interface SidebarProps {
  sidebarRolledUp: boolean;
  mode: PlayMode;
  setMode(mode: PlayMode): void;
  toggleSidebar(): void;
}

class PlayLeftSidebarComponent extends Component<SidebarProps> {
  setHighlightMode() {
    if (this.props.mode === PlayMode.Highlighting) {
      this.props.setMode(PlayMode.UnHighlighting);
    } else {
      this.props.setMode(PlayMode.Highlighting);
    }
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

  renderAnotateButton() {
    return (
      <MenuItem className="sidebar-button" onClick={() => this.props.setMode(PlayMode.Anotating)}>
        {!this.props.sidebarRolledUp ? <span>Annotate Text</span> : ""}
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#pen-tool"} />
        </svg>
      </MenuItem>
    );
  };

  render() {
    let className = "sort-and-filter-container play-sidebar";
    if (this.props.sidebarRolledUp) {
      className += " rolled-up";
    }

    return (
      <Grid container item className={className}>
        <div style={{ width: "100%" }}>{this.renderToggleButton()}</div>
        {this.renderHightlightButton()}
        {this.renderAnotateButton()}
      </Grid>
    );
  }
};

export default PlayLeftSidebarComponent;
