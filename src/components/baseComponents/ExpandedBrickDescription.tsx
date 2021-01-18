import React, { Component } from "react";

import './ExpandedBrickDescription.scss';
import { Brick } from "model/brick";

import { canDelete } from "components/services/brickService";

import SpriteIcon from "./SpriteIcon";
import SearchText from "./SearchText";
import AuthorSearchRow from "./AuthorRow";
import MathInHtml from "components/play/baseComponents/MathInHtml";
import BrickCircle from "./BrickCircle";


interface ExpandedDescriptionProps {
  userId: number;
  isAdmin: boolean;
  brick: Brick;

  color: string;
  circleIcon?: string;
  circleClass?: string;
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
      let key = 0;
      let i = 0;
      let res = [];
      for (let editor of editors) {
        if (i > 0) {
          res.push(<span key={key}>,</span>)
          key++;
        }
        res.push(<SearchText key={key} searchString={searchString} text={editor.firstName + ' ' + editor.lastName} />);
        i++;
        key++;
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
      <div className="hover-delete-icon">
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
        </div>
        <div className="hover-icons">
          {this.renderDeleteButton(brick)}
          <button className="btn btn-transparent svgOnHover play-button" onClick={() => this.props.move(brick.id)}>
            <SpriteIcon name="play-filled" className="w100 h100 active" />
          </button>
        </div>
      </div>
    );
  }
}

export default ExpandedBrickDescription;
