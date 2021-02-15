import React, { Component } from "react";

import './ExpandedBrickDescription.scss';
import { AcademicLevel, AcademicLevelLabels, Brick } from "model/brick";

import { canDelete } from "components/services/brickService";

import SpriteIcon from "./SpriteIcon";
import SearchText from "./SearchText";
import AuthorSearchRow from "./AuthorRow";
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
  renderDeleteButton(brick: Brick) {
    // check if user can delete the brick
    if (!canDelete(this.props.userId, this.props.isAdmin, brick)) { return; }
    return (
      <div className="hover-delete-icon">
        <button
          className="btn btn-transparent svgOnHover bin-button"
          onClick={e => {
            e.stopPropagation();
            this.props.onDelete(brick.id);
          }}
        >
          <SpriteIcon name="trash-outline" className="w100 h100 active" />
        </button>
      </div>
    );
  }

  render() {
    const { color, brick, searchString } = this.props;

    let label = '';
    if (!this.props.circleIcon) {
      if (brick.academicLevel > AcademicLevel.First) {
        label = AcademicLevelLabels[brick.academicLevel];
      }
    }

    return (
      <div className="expanded-brick-info" onClick={() => this.props.move(brick.id)}>
        <div className="circle-container">
          <BrickCircle
            color={color}
            label={label}
            circleIcon={this.props.circleIcon}
            circleClass={this.props.circleClass}
            iconColor={this.props.iconColor}
            canHover={false}
            onClick={() => {}}
          />
        </div>
        <div className="hover-text">
          <div className="link-description">
            <SearchText searchString={searchString} text={brick.title} />
          </div>
          <div className="link-info key-words">
            {brick.keywords && brick.keywords.map((k, i) => <div key={i} className="key-word">{k.name}</div>)}
          </div>
          <div className="link-info">
            <AuthorSearchRow searchString={searchString} brick={brick} />
          </div>
        </div>
        {this.renderDeleteButton(brick)}
      </div>
    );
  }
}

export default ExpandedBrickDescription;
