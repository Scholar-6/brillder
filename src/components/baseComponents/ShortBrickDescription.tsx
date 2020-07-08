import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ShortBrickDescription.scss';


interface ShortDescriptionProps {
  brick: Brick;
  color?: string;
  isMobile?: boolean;
  isExpanded?: boolean;
}

class ShortBrickDescription extends Component<ShortDescriptionProps> {
  renderRoler() {
    return (
      <div className="left-brick-roller">
        <div className="roller-button" />
      </div>
    );
  }

  renderCircle(color: string) {
    return (
      <div className="left-brick-circle">
        <div className="round-button" style={{ background: `${color}` }} />
      </div>
    );
  }

  renderPlayButton() {
    return (
      <div className="play-button-link">Play</div>
    )
  }

  render() {
    const { color, brick, isMobile, isExpanded } = this.props;
    let className = "short-description";

    if (isMobile && isExpanded) {
      className += " mobile-expanded";
    }
    return (
      <div className={className}>
        {color ? this.renderCircle(color) : this.renderRoler()}
        <div className="short-brick-info">
          <div className="link-description"><span>{brick.title}</span></div>
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
