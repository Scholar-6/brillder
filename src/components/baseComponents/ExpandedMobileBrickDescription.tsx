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
            <svg className="svg w80 h80 svg-default">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#play-thin"} className="text-white" />
            </svg>
            <svg className="svg w80 h80 colored">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#play-thick"} className="text-white" />
            </svg>
          </div>
        </div>
        <div className="brick-description">
          <div className="link-description">
            <span>{brick.title}</span>
          </div>
          <div className="link-info">
            <div>{brick.subTopic} | {brick.alternativeTopics}</div>
            <div>{getAuthorRow(brick)}</div>
            <div>{brick.openQuestion}</div>
            <div>{this.getSubjectRow(brick)}</div>
            <div>Editor: Name Surname</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExpandedBrickDescription;
