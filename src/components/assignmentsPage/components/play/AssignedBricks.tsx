import React, { Component } from "react";

import { User } from "model/user";
import { AssignmentBrickData } from '../../model';
import { prepareVisibleAssignment } from '../../service';
import { AssignmentBrick } from "model/assignment";

import BrickBlock16x9 from "components/viewAllPage/components/BrickBlock16x9";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";

import "./AssignedBricks.scss";
import { Subject } from "model/brick";
import { Classroom } from "model/classroom";

interface AssignedBricksProps {
  user: User;
  activeClassroomId: number;
  subjects: Subject[];
  classrooms: Classroom[];
  assignments: AssignmentBrick[];
  history: any;
}

class AssignedBricks extends Component<AssignedBricksProps> {
  renderBrick(item: AssignmentBrickData, i: number) {
    let circleIcon = '';
    const color = this.props.subjects.find(s => s.id === item.brick.subjectId)?.color;
    if (item.isInvitation) {
      circleIcon = "users";
    }
    return <BrickBlock16x9
      key={i}
      brick={item.brick}
      index={item.index}
      row={item.row}
      user={this.props.user}
      shown={true}
      isAssignment={true}
      completedDate={item.completedDate}
      assignmentStatus={item.status}
      isPlay={true}
      assignmentId={item.assignmentId}
      history={this.props.history}
      color={color}
      isCompleted={false}
      bestScore={item.bestScore}
      teacher={item.teacher}
      circleIcon={circleIcon}
      deadline={item.deadline}
      searchString=""
    />
  }

  renderEmptyPage() {
    return (
      <div className="tab-content-centered">
        <div>
          <div className="icon-container big-search-icon-container" onClick={() => this.props.history.push(map.MainPage)}>
            <SpriteIcon
              name="search-large-blue"
              className="big-search-icon"
            />
          </div>
          <div className="bold">There are no assignments for this class yet.<br />Click the icon to explore Brillder.</div>
        </div>
      </div>
    )
  }

  renderTeacher(classroom: Classroom) {
    if (classroom.teacher) {
      const {teacher} = classroom;
      return `by ${teacher.firstName} ${teacher.lastName}` 
    }
    return '';
  }

  render() {
    let classrooms:Classroom[] = [];
    if (this.props.activeClassroomId > 0) {
      let classroom = this.props.classrooms.find(c => c.id === this.props.activeClassroomId);
      if (classroom) {
        classrooms.push(classroom);
      }
    } else {
      classrooms = this.props.classrooms.filter(c => c.assignments.length > 0);
    }
    return (
      <div className="bricks-list-container">
        {classrooms.map((classroom, i) => {
          return (
            <div>
              <div className="classroom-name-v5">
                <span className="bold">{classroom.name}</span> by <span className="bold">{this.renderTeacher(classroom)}</span>
              </div>
              <div className="bricks-list" key={i}>
                {
                  this.props.assignments.map((item, i) => this.renderBrick(prepareVisibleAssignment(item), i))
                }
              </div>
            </div>
          );
        })}
        {this.props.assignments.length == 0 && this.renderEmptyPage()}
      </div>
    );
  }
}

export default AssignedBricks;
