import React, { Component } from "react";

import './ShortBrickDescription.scss';
import { AcademicLevel, AcademicLevelLabels, Brick } from "model/brick";

import { User } from "model/user";
import BrickCircle from "./BrickCircle";
import BrickTitle from "./BrickTitle";
import { fileUrl } from "components/services/uploadFile";
import { getDate, getMonth, getYear } from "components/services/brickService";

interface Props {
  brick: Brick;
  index?: number;
  circleIcon?: string;
  iconColor?: string;
  user?: User;
  handleDeleteOpen?(id: number): void;

  circleClass?: string;

  // only for play tab in back to work
  color?: string;

  // only for some pages
  isInvited?: boolean;

  deadline?: string;

  onClick?(): void;
  move?(): void;
}


class PhoneTopBrick16x9 extends Component<Props> {
  renderDeadline() {
    const { deadline } = this.props;
    if (!deadline) {
      return '';
    }
    const date = new Date(deadline);
    let now = Date.now();
    let passesDeadline = false;
    if (date.getTime() < now) {
      passesDeadline = true;
    }
    return (<div className="fwe1-16x9-deadline">
      <div>
        <div className={passesDeadline ? 'orange' : 'yellow'}>{getDate(date)}.{getMonth(date)}.{getYear(date)}</div>
      </div>
    </div>
    );
  }
  render() {
    const { color, brick, deadline } = this.props;
    let className = "phone-top-brick-16x9";

    let label = '';
    if (brick.academicLevel >= AcademicLevel.First) {
      label = AcademicLevelLabels[brick.academicLevel];
    }

    return (
      <div className={className} onClick={() => this.props.onClick ? this.props.onClick() : {}}>
        {this.renderDeadline()}
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
