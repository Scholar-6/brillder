import React, { Component } from "react";

import './ShortBrickDescription.scss';
import { AcademicLevel, AcademicLevelLabels, Brick } from "model/brick";

import { User } from "model/user";
import BrickCircle from "./BrickCircle";
import BrickTitle from "./BrickTitle";
import { fileUrl } from "components/services/uploadFile";

interface Props {
  brick: Brick;
  index?: number;
  circleIcon?: string;
  iconColor?: string;
  user?: User;
  handleDeleteOpen?(id: number): void;

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


class PhoneTopBrick16x9 extends Component<Props> {
  render() {
    const { color, brick, isMobile, isExpanded, index } = this.props;
    let className = "phone-top-brick-16x9";

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

    return (
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
        <div className="p-blue-background" />
        <img alt="" className="p-cover-image" src={fileUrl(brick.coverImage)} />
        <div className="bottom-description-color" />
        <div className="bottom-description">
          <BrickTitle title={brick.title} />
        </div>
      </div>
    );
  }
}

export default PhoneTopBrick16x9;
