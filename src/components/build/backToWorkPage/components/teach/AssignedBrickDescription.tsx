import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './AssignedBrickDescription.scss';
import sprite from "assets/img/icons-sprite.svg";
import AssignedCircle from './AssignedCircle';

interface AssignedDescriptionProps {
  brick: Brick;
  index?: number;
  isMobile?: boolean;
  isExpanded?: boolean;
  onClick?(): void;
  move?(): void;
}

class AssignedBrickDescription extends Component<AssignedDescriptionProps> {
  renderCircle() {
    let color = this.props.brick.subject?.color;
    if (!color) {
      color = "#B0B0AD";
    }
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
    let { brick, isMobile, isExpanded, index } = this.props;
    let className = "assigned-brick-description";

    if (isMobile && isExpanded) {
      className += " mobile-expanded";
    }
    if (index !== undefined && index >= 0) {
      className += " mobile-short-" + index;
    }

    return (
      <div className={className} onClick={() => this.props.onClick ? this.props.onClick() : {}}>
        <div className="total-view-count">
          8
          <svg className="svg active">
            <use href={sprite + "#eye-on"} className="text-theme-dark-blue" />
          </svg>
        </div>
        {this.renderCircle()}
        <div style={{ display: 'flex' }}>
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
          <div className="teach-brick-actions-container">
            <div className="stats-button-container">
              <svg className="svg active" style={{ height: '2.1vw', width: '2.1vw' }}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#bar-chart-2"} />
              </svg>
            </div>
            <div className="stats-text">Stats</div>
            <div className="archive-button-container">
              <svg className="svg active" style={{ height: '2.1vw', width: '2.1vw' }}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#archive"} className="text-gray" />
              </svg>
            </div>
          </div>
        </div>
        {isExpanded ? this.renderPlayButton() : ""}
      </div>
    );
  }
}

export default AssignedBrickDescription;
