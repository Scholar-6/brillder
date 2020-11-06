import React, { Component } from "react";

import './ExpandedBrickDescription.scss';
import { Brick } from "model/brick";

import { canDelete } from "components/services/brickService";

import SpriteIcon from "./SpriteIcon";
import SearchText from "./SearchText";
import AuthorSearchRow from "./AuthorRow";
import MathInHtml from "components/play/baseComponents/MathInHtml";


interface ExpandedDescriptionProps {
  userId: number;
  isAdmin: boolean;
  brick: Brick;

  color: string;
  circleIcon?: string;
  iconColor?: string;

  searchString: string;

  move(brickId: number): void;
  onDelete(brickId: number): void;
}

class ExpandedBrickDescription extends Component<ExpandedDescriptionProps> {
  getEditors(brick: Brick, searchString: string) {
    let text = "";
    const { editors } = brick;
    if (editors) {
      let i = 0;
      let res = [];
      for (let editor of editors) {
        if (i > 0) {
          res.push(<span key={1}>,</span>)
        }
        res.push(<SearchText key={2} searchString={searchString} text={editor.firstName + ' ' + editor.lastName} />);
        i++;
      }
      return res;
    }
    return text;
  }

  getSubjectRow(brick: Brick) {
    const subject = brick.subject ? brick.subject.name : "SUBJECT Code";
    return `${subject} | Number of Plays: ${brick.attemptsCount}`;
  }

  renderDeleteButton(brick: Brick) {
    // check if user can delete the brick
    if (!canDelete(this.props.userId, this.props.isAdmin, brick)) { return; }
    return (
      <div>
        <button className="btn btn-transparent svgOnHover bin-button" onClick={() => this.props.onDelete(brick.id)}>
          <SpriteIcon name="trash-outline" className="w100 h100 active" />
        </button>
      </div>
    );
  }

  render() {
    const { color, brick, searchString } = this.props;

    return (
      <div className="expanded-brick-info">
        <div className="hover-text">
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
          <div className="hovered-open-question link-info">
            <MathInHtml value={brick.openQuestion} />
          </div>
          <div className="link-info">{this.getSubjectRow(brick)}</div>
          <div className="link-info">Editor(s): &nbsp; {this.getEditors(brick, searchString)}</div>
        </div>
        <div className="hover-icons-row">
          {this.renderDeleteButton(brick)}
          <div>
            <button className="btn btn-transparent svgOnHover play-button" onClick={() => this.props.move(brick.id)}>
              <SpriteIcon name="play-filled" className="w100 h100 active" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ExpandedBrickDescription;
