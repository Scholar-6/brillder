import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './AssignedBrickDescription.scss';
import sprite from "assets/img/icons-sprite.svg";
import AssignedCircle from './AssignedCircle';

interface AssignedDescriptionProps {
  brick: Brick;
  index?: number;
  color?: string;
  isMobile?: boolean;
  isExpanded?: boolean;
  onClick?(): void;
  move?(): void;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps> {
  renderCircle(color: string) {
    return (
      <div className="left-brick-circle">
        <div className="round-button" style={{ background: color }} />
      </div>
    );
  }

  renderPlayButton() {
    return (
      <div className="play-button-link svgOnHover" onClick={() => this.props.move ? this.props.move() : {}}>
        <svg className="svg w100 h100 svg-default">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#play-thin"} className="text-gray" />
        </svg>
        <svg className="svg w100 h100 colored">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#play-thick"} className="text-gray" />
        </svg>
      </div>
    )
  }

  render() {
    let { color, brick, isMobile, isExpanded, index } = this.props;
    let className = "assigned-brick-description";

    if (isMobile && isExpanded) {
      className += " mobile-expanded";
    }
    if (index !== undefined && index >= 0) {
      className += " mobile-short-" + index;
    }


    if (!color) {
      color = "#B0B0AD";
    }

    return (
      <div className={className} onClick={() => this.props.onClick ? this.props.onClick() : {}}>
        <div className="total-view-count">
          8
          <svg className="svg active">
            <use href={sprite + "#eye-on"} className="text-theme-dark-blue" />
          </svg>
        </div>
        {this.renderCircle(color)}
        <div style={{display: 'flex'}}>
          <div className="short-brick-info">
            <div className="link-description">
              <span>{brick.title}</span>
            </div>
            <div className="link-info">
              {brick.subTopic} | {brick.alternativeTopics}
            </div>
            <div className="link-info">{getAuthorRow(brick)}</div>
          </div>
          <AssignedCircle />
          <AssignedCircle />
          <AssignedCircle />
        </div>
        {isExpanded ? this.renderPlayButton() : ""}
      </div>
    );
  }
}

export default AssignedBrickDescription;
