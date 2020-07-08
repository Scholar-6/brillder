import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ExpandedMobileBrickDescription.scss';
import sprite from "../../assets/img/icons-sprite.svg";


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
        <div className="brick-icons">
          <div className="round-button svgOnHover" style={{ background: `${color}` }} onClick={() => this.props.move(brick.id)}>
            <svg className="svg svg-default">
              <use href={sprite + "#play-thin"} />
            </svg>
            <svg className="svg svg-default">
              <use href={sprite + "#play-thick"} />
            </svg>
          </div>
        </div>
        <div className="brick-description">
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
      </div>
    );
  }
}

export default ExpandedBrickDescription;
