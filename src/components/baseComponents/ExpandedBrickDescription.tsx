import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ExpandedBrickDescription.scss';
import SpriteIcon from "./SpriteIcon";
import brick from "components/services/axios/brick";


interface ExpandedDescriptionProps {
  userId: number;
  isAdmin: boolean;
  brick: Brick;
  color: string;
  circleIcon?: string;
  iconColor?: string;
  
  move(brickId: number): void;
  onDelete(brickId: number): void;
}

class ExpandedBrickDescription extends Component<ExpandedDescriptionProps> {
  getEditors(brick: Brick) {
    let text = "";
    const {editors} = brick;
    if (editors) {
      let i = 0;
      for (let editor of editors) {
        if (i > 0) { text += ', '; }
        text += editor.firstName + ' ' + editor.lastName;
        i++;
      }
    }
    return text;
  }

  getSubjectRow(brick: Brick) {
    const subject = brick.subject ? brick.subject.name : "SUBJECT Code";
    return `${subject} | Number of Plays: ${brick.attemptsCount}`;
  }

  renderDeleteButton(brick: Brick) {
    if (!this.props.isAdmin) { return; }
    return (
      <div>
        <button className="btn btn-transparent svgOnHover bin-button" onClick={() => this.props.onDelete(brick.id)}>
          <SpriteIcon name="trash-outline" className="w100 h100 active" />
        </button>
      </div>
    );
  }

  renderIcon() {
    const {circleIcon, iconColor} = this.props;
    let svgClass = 'svg active ';
    if (iconColor) {
      svgClass += iconColor;
    } else {
      svgClass += 'text-white';
    }
    if (circleIcon) {
      return (
        <div className="round-button-icon">
          <SpriteIcon name={circleIcon} className={svgClass} />
        </div>
      );
    }
    return "";
  }

  render() {
    const { color, brick } = this.props;

    return (
      <div className="expanded-brick-info">
        <div className="hover-text">
          <div className="link-description">
            <span>{brick.title}</span>
          </div>
          <div className="link-info">
            {brick.subTopic} | {brick.alternativeTopics}
          </div>
          <div className="link-info">{getAuthorRow(brick)}</div>
          <div className="hovered-open-question link-info">
            {brick.openQuestion}
          </div>
          <div className="link-info">{this.getSubjectRow(brick)}</div>
          <div className="link-info">Editor(s): {this.getEditors(brick)}</div>
        </div>
        <div className="hover-icons-row">
          <div>
            <div className="round-button" style={{ background: `${color}` }}>
              {this.renderIcon()}
            </div>
          </div>
          {this.renderDeleteButton(brick)}
          <div>
            <button className="btn btn-transparent svgOnHover play-button" onClick={() => this.props.move(brick.id)}>
              <SpriteIcon name="play-filled" className="w100 h100 active" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ExpandedBrickDescription;
