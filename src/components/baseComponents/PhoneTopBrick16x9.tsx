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
  isAssignment?: boolean;

  onClick?(): void;
  onIconClick?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}


class PhoneTopBrick16x9 extends Component<Props> {
  renderDeadline() {
    const { deadline } = this.props;
    if (!this.props.isAssignment) {
      return '';
    }
    let res = 'NO DEADLINE';
    let className = '';
    if (deadline) {
      const date = new Date(deadline);
      const now = Date.now();
      if (date.getTime() < now) {
        className = 'orange';
      } else {
        className = 'yellow';
      }
      res = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;
    } else {
      className = 'smaller-blue';
    }
    return (<div className="fwe1-16x9-deadline">
      <div>
        <div className={className}>{res}</div>
      </div>
    </div>
    );
  }
  render() {
    const { color, brick } = this.props;

    let label = '';
    if (brick.academicLevel >= AcademicLevel.First) {
      label = AcademicLevelLabels[brick.academicLevel];
    }

    let isAssignment = false;
    let assignmentId = -1;

    if (brick.assignments) {
      for (let assignmen of brick.assignments) {
        let assignment = assignmen as any;
        for (let student of assignment.stats.byStudent) {
          if (student.studentId === this.props.user?.id) {
            assignmentId = assignment.id;
            isAssignment = true;
          }
        }
      }
    }

    return (
      <div className="phone-top-brick-16x9" onClick={() => this.props.onClick ? this.props.onClick() : {}}>
        {this.renderDeadline()}
        {color
          && (
            <BrickCircle
              color={color}
              circleIcon={this.props.circleIcon}
              circleClass={this.props.circleClass}
              iconColor={this.props.iconColor}
              isAssignment={isAssignment}
              canHover={true}
              label={label}
              onClick={e => this.props.onIconClick?.(e)}
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
