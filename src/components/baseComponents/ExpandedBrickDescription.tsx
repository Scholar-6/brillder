import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ExpandedBrickDescription.scss';


interface ExpandedDescriptionProps {
  isAdmin: boolean;
  brick: Brick;
  color: string;
  move(brickId: number): void;
  onDelete(brickId: number): void;
}

class ExpandedBrickDescription extends Component<ExpandedDescriptionProps> {
  getSubjectRow(brick: Brick) {
    return `${brick.subject ? brick.subject.name : "SUBJECT Code"} | No. ${
      brick.attemptsCount
      } of Plays`;
  }

  render() {
    const { color, isAdmin, brick } = this.props;

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
          <div className="link-info">Editor: Name Surname</div>
        </div>
        <div className="hover-icons-row">
          <div>
            <div className="round-button" style={{ background: `${color}` }}></div>
          </div>
          <div>
            {isAdmin ? (
              <img
                alt="bin"
                onClick={() => this.props.onDelete(brick.id)}
                className="bin-button"
                src="/images/brick-list/bin.png"
              />
            ) : (
                ""
              )}
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
