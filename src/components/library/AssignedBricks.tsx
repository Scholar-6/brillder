import React, { Component } from "react";

import { User } from "model/user";
import { AssignmentBrickData } from '../backToWorkPage/model';
import { prepareVisibleAssignments } from '../backToWorkPage/service';
import { AssignmentBrick } from "model/assignment";

import BrickBlock from "components/baseComponents/BrickBlock";
import { Subject } from "model/brick";

interface AssignedBricksProps {
  user: User;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  subjects: Subject[];
  assignments: AssignmentBrick[];
  history: any;

  handleDeleteOpen(brickId: number): void;
  onMouseHover(key: number): void;
  onMouseLeave(key: number): void;
}

class AssignedBricks extends Component<AssignedBricksProps> {
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

  renderBrick(item: AssignmentBrickData) {
    const color = this.getColor(item);
    let circleIcon = 'book-open';
    return <BrickBlock
      brick={item.brick}
      index={item.index}
      row={item.row}
      user={this.props.user}
      key={item.index}
      shown={this.props.shown}
      history={this.props.history}
      color={color}
      circleIcon={circleIcon}
      searchString=""
      handleDeleteOpen={this.props.handleDeleteOpen}
      handleMouseHover={() => this.props.onMouseHover(item.key)}
      handleMouseLeave={() => this.props.onMouseLeave(item.key)}
    />
  }

  renderSortedBricks() {
    const data = prepareVisibleAssignments(this.props.sortedIndex, this.props.pageSize, this.props.assignments);
    return data.map(item => this.renderBrick(item));
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

export default AssignedBricks;
