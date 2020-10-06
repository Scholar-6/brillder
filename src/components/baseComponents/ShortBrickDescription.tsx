import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ShortBrickDescription.scss';
import SpriteIcon from "./SpriteIcon";

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
          <SpriteIcon name="award" className="w100 h100 active text-theme-green stroke-2" />
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
          <SpriteIcon name={circleIcon} className={svgClass} />
        </div>
      );
    }
    return "";
  }

  renderCircle(color: string) {
    let className="left-brick-circle";
    if (color === "color3") {
      className += ' skip-top-left-border';
    } else if (color === "color2") {
      className += ' skip-top-right-border';
    }
    return (
      <div className={className}>
        <div className="round-button" style={{ background: `${color}` }}>
          {this.renderIcon()}
        </div>
      </div>
    );
  }

  renderPlayButton() {
    return (
      <div className="play-button-link svgOnHover" onClick={() => this.props.move ? this.props.move() : {}}>
        <SpriteIcon name="play-thin" className="w100 h100 svg-default text-gray" />
        <SpriteIcon name="play-thick" className="w100 h100 colored text-gray" />
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
