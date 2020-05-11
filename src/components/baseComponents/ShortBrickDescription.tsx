import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";


interface ShortDescriptionProps {
  brick: Brick;
  color?: string;
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

  render() {
    const { color, brick } = this.props;
    return (
      <div>
        {color ? this.renderCircle(color) : this.renderRoler()}
        <div className="short-brick-info">
          <div className="link-description"><span>{brick.title}</span></div>
          <div className="link-info">
            {brick.subTopic} | {brick.alternativeTopics}
          </div>
          <div className="link-info">{getAuthorRow(brick)}</div>
        </div>
      </div>
    );
  }
}

export default ShortBrickDescription;
