import React from "react";
import { Grid } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import sprite from "../../../assets/img/icons-sprite.svg";
import {PlayMode} from './model';

interface SidebarProps {
  sidebarRolledUp: boolean;
  mode: PlayMode;
  setMode(mode: PlayMode): void;
  toggleSidebar(): void;
}

const PlayLeftSidebarComponent: React.FC<SidebarProps> = (props) => {
  const {mode, sidebarRolledUp} = props;
  let className = "sort-and-filter-container play-sidebar";
  if (sidebarRolledUp) {
    className += " rolled-up";
  }

  const renderToggleButton = () => {
    if (sidebarRolledUp) {
      return (
        <svg className="svg minimize-icon" onClick={props.toggleSidebar}>
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#maximize-2"} />
        </svg>
      );
    }
    return (
      <svg className="svg minimize-icon" onClick={props.toggleSidebar}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#minimize-2"} />
      </svg>
    );
  };

  const setHighlightMode = () => {
    if (mode === PlayMode.Highlighting) {
      props.setMode(PlayMode.UnHighlighting);
    } else {
      props.setMode(PlayMode.Highlighting);
    }
  }

  const renderHightlightText = () => {
    if (!sidebarRolledUp) {
      if (mode === PlayMode.UnHighlighting) {
        return <span>Unhighlight Text</span>;
      }
      return <span>Highlight Text</span>;
    }
    return "";
  }

  const renderHightlightButton = () => {
    let className = "sidebar-button";
    let icon = "#highlighter"
    if (mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) {
      className += " active";
    }
    if (mode === PlayMode.UnHighlighting) {
      icon = "#delete-2";
    }
    return (
      <MenuItem className={className} onClick={setHighlightMode}>
        {renderHightlightText()}
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + icon} className="text-white" />
        </svg>
      </MenuItem>
    );
  };

  const renderAnotateButton = () => {
    return (
      <MenuItem className="sidebar-button" onClick={() => props.setMode(PlayMode.Anotating)}>
        {!sidebarRolledUp ? <span>Annotate Text</span> : ""}
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#pen-tool"} />
        </svg>
      </MenuItem>
    );
  };

  return (
    <Grid container item className={className}>
      <div style={{ width: "100%" }}>{renderToggleButton()}</div>
      {renderHightlightButton()}
      {renderAnotateButton()}
    </Grid>
  );
};

export default PlayLeftSidebarComponent;
