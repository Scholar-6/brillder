import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ExpandedMobileBrickDescription.scss';
import SpriteIcon from "./SpriteIcon";
import MathInHtml from "components/play/baseComponents/MathInHtml";


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
            <SpriteIcon name="play-thin" className="w80 h80 svg-default text-white" />
            <SpriteIcon name="play-thick" className="w80 h80 colored text-white" />
          </div>
        </div>
        <div className="brick-description">
          <div className="link-description">
            <span>{brick.title}</span>
          </div>
          <div className="link-info">
            <div>{brick.subTopic} | {brick.alternativeTopics}</div>
            <div>{getAuthorRow(brick)}</div>
            <div><MathInHtml value={brick.openQuestion} /></div>
            <div>{this.getSubjectRow(brick)}</div>
            <div>Editor: Name Surname</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExpandedBrickDescription;
