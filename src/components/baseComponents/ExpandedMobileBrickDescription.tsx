import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import './ExpandedMobileBrickDescription.scss';
import SpriteIcon from "./SpriteIcon";
import MathInHtml from "components/play/baseComponents/MathInHtml";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/components/KeywordsPlay";
import BrickTitle from "./BrickTitle";


interface ExpandedDescriptionProps {
  brick: Brick;
  color: string;
  circleClass?: string;
  move(brickId: number): void;
  hide?(): void;
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
        {this.props.hide &&
          <div className="expand-button" onClick={this.props.hide}>
            <SpriteIcon name="corner-up-left" />
          </div>
        }
        <div className={"brick-icons " + this.props.circleClass}>
          <div className="round-button svgOnHover" style={{ background: `${color}` }} onClick={() => this.props.move(brick.id)}>
            <SpriteIcon name="play-thin" className="w80 h80 svg-default text-white" />
            <SpriteIcon name="play-thick" className="w80 h80 colored text-white" />
          </div>
        </div>
        <div className="brick-description">
          <div>
          <div className="link-description">
            <BrickTitle title={brick.title} />
          </div>
          <div className="link-info">
            <KeyWordsPreview keywords={brick.keywords} />
            <div>{getAuthorRow(brick)}</div>
            <div className="expand-open-question"><MathInHtml value={brick.openQuestion} /></div>
            <div>{this.getSubjectRow(brick)}</div>
            <div>Editor: Name Surname</div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExpandedBrickDescription;
