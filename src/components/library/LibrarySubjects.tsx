import React, { Component } from "react";

import { User } from "model/user";
import { AssignmentBrickData } from '../assignmentsPage/model';
import { prepareVisibleAssignments } from '../assignmentsPage/service';
import { Subject } from "model/brick";

import { Box } from "@material-ui/core";
import AuthorSearchRow from "components/baseComponents/AuthorRow";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import { SubjectAssignments } from "./model";

interface AssignedBricksProps {
  user: User;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  subjects: Subject[];
  subjectAssignments: SubjectAssignments[];
  history: any;
}

class LibrarySubjects extends Component<AssignedBricksProps> {
  getColor(item: AssignmentBrickData) {
    try {
      let subject = this.props.subjects.find(s => s.id === item.brick.subjectId);
      if (subject) {
        return subject.color;
      }
    } catch {
      console.log('can`t get color');
    }
    return '';
  }

  renderBrick(item: SubjectAssignments, key: number) {
    return (
      <div className="libary-container" key={key}>
        {key} wefwef
      </div>
    );
  }

  renderSortedBricks() {
    const data = this.props.subjectAssignments;
    return data.map(this.renderBrick.bind(this));
  }

  renderAssignedBricks() {
    return this.renderSortedBricks();
  }

  render() {
    return (
      <div className="bricks-list-container">
        <div className="bricks-list">
          {this.renderAssignedBricks()}
        </div>
      </div>
    );
  }
}

export default LibrarySubjects;
