import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ShortBrickDescription.scss';
import sprite from "assets/img/icons-sprite.svg";

interface ShortDescriptionProps {
  brick: Brick;
  index?: number;
  isMobile?: boolean;
  isExpanded?: boolean;
  circleIcon?: string;
  iconColor?: string;

  // only for play tab in back to work
  color?: string;

  // only for some pages
  isInvited?: boolean;

  onClick?(): void;
  move?(): void;
}

class ShortBrickDescription extends Component<ShortDescriptionProps> {
  renderRoler() {
    return (
      <div className="left-brick-roller">
        <div className="btn btn-transparent roller-button svgOnHover">
          <svg className="svg w80 h80 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#award"} className="text-theme-green" />
          </svg>
        </div>
      </div>
    );
  }

  renderIcon() {
    const { circleIcon, iconColor } = this.props;
    let svgClass = 'svg active ';
    if (iconColor) {
      svgClass += iconColor;
    } else {
      svgClass += 'text-white';
    }
    if (circleIcon) {
      return (
        <div className="round-button-icon">
          <svg className={svgClass}>
            {/*eslint-disable-next-line*/}
            <use href={`${sprite}#${circleIcon}`} />
          </svg>
        </div>
      );
    }
    return "";
  }

  renderCircle(color: string) {
    return (
      <div className="left-brick-circle">
        <div className="round-button" style={{ background: `${color}` }}>
          {this.renderIcon()}
        </div>
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
    const { color, brick, isMobile, isExpanded, index } = this.props;
    let className = "short-description";

    if (isMobile && isExpanded) {
      className += " mobile-expanded";
    }
    if (index !== undefined && index >= 0) {
      className += " mobile-short-" + index;
    }

    return (
      <div className={className} onClick={() => this.props.onClick ? this.props.onClick() : {}}>
        {color ? this.renderCircle(color) : this.renderRoler()}
        <div className="short-brick-info">
          <div className="link-description">
            <span>{brick.title}</span>
          </div>
          <div className="link-info">
            {brick.subTopic} | {brick.alternativeTopics}
          </div>
          <div className="link-info">{getAuthorRow(brick)}</div>
        </div>
        {isExpanded ? this.renderPlayButton() : ""}
      </div>
    );
  }
}

export default ShortBrickDescription;
