import React, { Component } from "react";

import './ShortBrickDescription.scss';
import { AcademicLevel, AcademicLevelLabels, Brick } from "model/brick";

import SpriteIcon from "./SpriteIcon";
import SearchText from "./SearchText";
import AuthorSearchRow from "./AuthorRow";
import { User, UserType } from "model/user";
import BrickCircle from "./BrickCircle";
import { canDelete } from "components/services/brickService";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/KeywordsPlay";

interface ShortDescriptionProps {
  brick: Brick;
  index?: number;
  circleIcon?: string;
  iconColor?: string;
  user?: User;
  handleDeleteOpen?(id: number): void;

  searchString: string;

  circleClass?: string;

  // mobile
  isMobile?: boolean;
  isExpanded?: boolean;

  // only for play tab in back to work
  color?: string;

  // only for some pages
  isInvited?: boolean;

  onClick?(): void;
  move?(): void;
}


class ShortBrickDescription extends Component<ShortDescriptionProps> {
  renderIcon() {
    const { circleIcon, iconColor } = this.props;
    let svgClass = 'svg active ';
    if (iconColor) {
      svgClass += iconColor;
    } else {
      svgClass += 'text-white';
    }
    if (circleIcon) {
      return (
        <div className="round-button-icon">
          <SpriteIcon name={circleIcon} className={svgClass} />
        </div>
      );
    }
    return "";
  }

  // mobile only
  renderPlayButton() {
    return (
      <div className="play-button-link svgOnHover" onClick={() => this.props.move ? this.props.move() : {}}>
        <SpriteIcon name="play-thin" className="w100 h100 svg-default text-gray" />
        <SpriteIcon name="play-thick" className="w100 h100 colored text-gray" />
      </div>
    )
  }

  renderShortBrickInfo(searchString: string, brick: Brick) {
    return (
      <div className="short-brick-info">
        <div className="link-description">
          <SearchText searchString={searchString} text={brick.title} />
        </div>
        <div className="link-info">
          <KeyWordsPreview keywords={brick.keywords} />
        </div>
        <div className="link-info">
          <AuthorSearchRow searchString={searchString} brick={brick} />
        </div>
      </div>
    );
  }

  renderDeleteButton(brick: Brick) {
    const { user } = this.props;
    let isAdmin = false;
    if (user) {
      isAdmin = user.roles.some(role => role.roleId === UserType.Admin);
    }
    if (user) {
      // check if user can delete the brick
      if (!canDelete(user.id, isAdmin, brick)) { return; }
      return (
        <div className="hover-delete-icon">
          <button
            className="btn btn-transparent svgOnHover bin-button"
            onClick={e => {
              e.stopPropagation();
              if (this.props.handleDeleteOpen) {
                this.props.handleDeleteOpen(brick.id);
              }
            }}
          >
            <SpriteIcon name="trash-outline" className="w100 h100 active" />
          </button>
        </div>
      );
    }
    return <div />
  }

  render() {
    const { color, brick, isMobile, isExpanded, searchString, index } = this.props;
    let className = "short-description";

    if (isMobile && isExpanded) {
      className += " mobile-expanded";
    }
    if (index !== undefined && index >= 0) {
      className += " mobile-short-" + index;
    }

    let label = '';
    if (brick.academicLevel >= AcademicLevel.First) {
      label = AcademicLevelLabels[brick.academicLevel];
    }

    if (isMobile) {
      return (
        <div>
          <div className={className} onClick={() => this.props.onClick ? this.props.onClick() : {}}>
            {color
              && (
                <BrickCircle
                  color={color}
                  circleIcon={this.props.circleIcon}
                  circleClass={this.props.circleClass}
                  iconColor={this.props.iconColor}
                  canHover={true}
                  label={label}
                  onClick={() => this.props.move ? this.props.move() : {}}
                />
              )
            }
            {this.renderShortBrickInfo(searchString, brick)}
            {isExpanded ? this.renderPlayButton() : ""}
          </div>
        </div>
      );
    }

    return (
      <div className={className} onClick={() => this.props.move ? this.props.move() : {}}>
        {this.renderDeleteButton(this.props.brick)}
        {color && (
          <div className="brick-circle-container">
            <BrickCircle
              color={color}
              label={label}
              circleIcon={this.props.circleIcon}
              circleClass={this.props.circleClass}
              iconColor={this.props.iconColor}
              canHover={true}
              onClick={() => this.props.move ? this.props.move() : {}}
            />
          </div>
        )}
        <div className="centered-brick-description">
          {this.renderShortBrickInfo(searchString, brick)}
        </div>
        {isExpanded ? this.renderPlayButton() : ""}
      </div>
    );
  }
}

export default ShortBrickDescription;
