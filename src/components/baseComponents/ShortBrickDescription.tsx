import React, { Component } from "react";

import './ShortBrickDescription.scss';
import { Brick } from "model/brick";

import SpriteIcon from "./SpriteIcon";
import sprite from 'assets/img/icons-sprite.svg';
import SearchText from "./SearchText";
import AuthorSearchRow from "./AuthorRow";

interface ShortDescriptionProps {
  brick: Brick;
  index?: number;
  circleIcon?: string;
  iconColor?: string;

  searchString: string;

  circleClass?: string;

  // mobile
  isMobile?: boolean;
  isExpanded?: boolean;

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
          <svg className="svg w100 h100 active stroke-2">
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
          <SpriteIcon name={circleIcon} className={svgClass} />
        </div>
      );
    }
    return "";
  }

  renderCircle(color: string) {
    let className = "left-brick-circle";

    if (this.props.circleClass) {
      className += ' ' + this.props.circleClass;
    }

    if (color === "color3") {
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

  // mobile only
  renderPlayButton() {
    return (
      <div className="play-button-link svgOnHover" onClick={() => this.props.move ? this.props.move() : {}}>
        <SpriteIcon name="play-thin" className="w100 h100 svg-default text-gray" />
        <SpriteIcon name="play-thick" className="w100 h100 colored text-gray" />
      </div>
    )
  }

  render() {
    const { color, brick, isMobile, isExpanded, searchString, index } = this.props;
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
            <SearchText searchString={searchString} text={brick.title} />
          </div>
          <div className="link-info">
            <SearchText searchString={searchString} text={brick.subTopic} />
            |
            <SearchText searchString={searchString} text={brick.alternativeTopics} />
          </div>
          <div className="link-info">
            <AuthorSearchRow searchString={searchString} brick={brick} />
          </div>
        </div>
        {isExpanded ? this.renderPlayButton() : ""}
      </div>
    );
  }
}

export default ShortBrickDescription;
