import React, { Component } from "react";

import { User } from "model/user";
import { ThreeAssignmentColumns, AssignmentBrickData } from '../../model';
import { prepareVisibleThreeColumnAssignments } from '../../threeColumnService';

import BrickBlock from '../BrickBlock';
import { AssignmentBrickStatus } from "model/assignment";

interface AssignedBricksProps {
  user: User;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  threeColumns: ThreeAssignmentColumns;
  history: any;
  handleDeleteOpen(brickId: number): void;
  onThreeColumnsMouseHover(brickId: number, status: AssignmentBrickStatus): void;
  onThreeColumnsMouseLeave(brickId: number, status: AssignmentBrickStatus): void;
}

class AssignedBricks extends Component<AssignedBricksProps> {
  renderBrick(item: AssignmentBrickData) {
    let color = '';
    if (item.status === AssignmentBrickStatus.ToBeCompleted) {
      color = 'color1';
    } else if (item.status === AssignmentBrickStatus.SubmitedToTeacher) {
      color = 'color2';
    } else if (item.status === AssignmentBrickStatus.CheckedByTeacher) {
      color = 'color3';
    }

    return <BrickBlock
      brick={item.brick}
      index={item.key}
      row={item.row}
      key={item.key}
      user={this.props.user}
      shown={this.props.shown}
      color={color}
      isAssignment={true}
      assignmentId={item.assignmentId}
      history={this.props.history}
      handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
      handleMouseHover={() => this.props.onThreeColumnsMouseHover(item.key, item.status)}
      handleMouseLeave={() => this.props.onThreeColumnsMouseLeave(item.key, item.status)}
    />
  }

  renderGroupedBricks = (data: AssignmentBrickData[]) => {
    return data.map(item => this.renderBrick(item));
  }

  renderAssignedGroupedBricks() {
    const data = prepareVisibleThreeColumnAssignments(this.props.pageSize, this.props.sortedIndex, this.props.threeColumns);
    return this.renderGroupedBricks(data);
  }

  render() {
    return (
      <div className="bricks-list-container">
        <div className="bricks-list">
          {this.renderAssignedGroupedBricks()}
        </div>
      </div>
    );
  }
}

export default AssignedBricks;
