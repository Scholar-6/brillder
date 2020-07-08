import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ExpandedMobileBrickDescription.scss';


interface ExpandedDescriptionProps {
  brick: Brick;
  color: string;
  move(brickId: number): void;
}

class ExpandedBrickDescription extends Component<ExpandedDescriptionProps> {
  getSubjectRow(brick: Brick) {
    return `${brick.subject ? brick.subject.name : "SUBJECT Code"} | No. ${
      brick.attemptsCount
    } of Plays`;
  }

  render() {
    const { color, brick } = this.props;

    return (
      <div className="expanded-mobile-brick-info">
        <div className="hover-text">
          <div className="link-description">{brick.title}</div>
          <div className="link-info">
            {brick.subTopic} | {brick.alternativeTopics}
          </div>
          <div className="link-info">{getAuthorRow(brick)}</div>
          <div className="hovered-open-question link-info">
            {brick.openQuestion}
          </div>
          <div className="link-info">{this.getSubjectRow(brick)}</div>
          <div className="link-info">Editor: Name Surname</div>
        </div>
        <div className="hover-icons-row">
          <div>
            <div className="round-button" style={{ background: `${color}` }}></div>
          </div>
          <div>
          </div>
          <div>
            <img
              alt="play"
              className="play-button"
              onClick={() => this.props.move(brick.id)}
              src="/images/brick-list/play.png"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ExpandedBrickDescription;
