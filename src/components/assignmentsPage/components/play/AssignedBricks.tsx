import React, { Component } from "react";

import map from "components/map";
import "./AssignedBricks.scss";
import { Subject } from "model/brick";
import { Classroom } from "model/classroom";
import { getDateStringV2 } from "components/services/brickService";
import { User } from "model/user";
import { AssignmentBrickData } from '../../model';
import { prepareVisibleAssignment } from '../../service';
import { AssignmentBrick } from "model/assignment";

import BrickBlock16x9 from "components/viewAllPage/components/BrickBlock16x9";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface AssignedBricksProps {
  user: User;
  activeClassroomId: number;
  subjects: Subject[];
  classrooms: Classroom[];
  assignments: AssignmentBrick[];
  history: any;
  activateClassroom(classroomId: number): void;
}

class AssignedBricks extends Component<AssignedBricksProps> {
  renderBrick(item: AssignmentBrickData, i: number) {
    let circleIcon = '';
    const color = this.props.subjects.find(s => s.id === item.brick.subjectId)?.color;
    if (item.isInvitation) {
      circleIcon = "users";
    }

    let isCompleted = false;
    if (item.bestScore > 0) {
      isCompleted = true;
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
      isCompleted={isCompleted}
      bestScore={item.bestScore}
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
      return `${teacher.firstName} ${teacher.lastName}` 
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
      classrooms = this.props.classrooms.filter(c => c.assignmentsBrick.length > 0);
    }
    return (
      <div className="bricks-list-container">
        {classrooms.map((classroom, i) => {
          return (
            <div key={i}>
              <div className="classroom-name-v5" onClick={() => this.props.activateClassroom(classroom.id)}>
                <span className="bold">{classroom.name}</span> by <span className="bold">{this.renderTeacher(classroom)}</span> 
                <span className="absolute-right-v5">Date Created: {getDateStringV2(classroom.created.toString(), '/')}</span>
              </div>
              <div className="bricks-list">
                {
                  classroom.assignmentsBrick.map((item, i) => this.renderBrick(prepareVisibleAssignment(item), i))
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
