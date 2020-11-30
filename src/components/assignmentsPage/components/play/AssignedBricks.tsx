import React, { Component } from "react";

import { User } from "model/user";
import { ThreeAssignmentColumns, AssignmentBrickData, PlayFilters } from '../../model';
import { prepareVisibleAssignments } from '../../service';
import { prepareVisibleThreeColumnAssignments } from '../../threeColumnService';
import { AssignmentBrickStatus, AssignmentBrick } from "model/assignment";

import BrickBlock from "components/baseComponents/BrickBlock";

interface AssignedBricksProps {
  user: User;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  filters: PlayFilters;
  assignments: AssignmentBrick[];
  threeColumns: ThreeAssignmentColumns;
  history: any;

  handleDeleteOpen(brickId: number): void;
  onMouseHover(key: number): void;
  onMouseLeave(key: number): void;
  onThreeColumnsMouseHover(brickId: number, status: AssignmentBrickStatus): void;
  onThreeColumnsMouseLeave(brickId: number, status: AssignmentBrickStatus): void;
}

class AssignedBricks extends Component<AssignedBricksProps> {
  getColor(item: AssignmentBrickData) {
    if (item.status === AssignmentBrickStatus.ToBeCompleted) {
      return 'color1';
    } else if (item.status === AssignmentBrickStatus.SubmitedToTeacher) {
      return 'color2';
    } else if (item.status === AssignmentBrickStatus.CheckedByTeacher) {
      return 'color3';
    }
    return '';
  }

  renderBrick(item: AssignmentBrickData) {
    const color = this.getColor(item);
    let circleIcon = '';
    if (item.isInvitation) {
      circleIcon="users";
    }
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

  renderGroupedBrick(item: AssignmentBrickData) {
    const color = this.getColor(item);
    let circleIcon = '';
    if (item.isInvitation) {
      circleIcon="users";
    }

    return <BrickBlock
      brick={item.brick}
      index={item.key}
      row={item.row}
      key={item.key}
      user={this.props.user}
      shown={this.props.shown}
      color={color}
      circleIcon={circleIcon}
      isAssignment={true}
      assignmentId={item.assignmentId}
      history={this.props.history}
      searchString=""
      handleDeleteOpen={brickId => this.props.handleDeleteOpen(brickId)}
      handleMouseHover={() => this.props.onThreeColumnsMouseHover(item.key, item.status)}
      handleMouseLeave={() => this.props.onThreeColumnsMouseLeave(item.key, item.status)}
    />
  }

  renderGroupedBricks = (data: AssignmentBrickData[]) => {
    return data.map(item => this.renderGroupedBrick(item));
  }

  renderAssignedGroupedBricks() {
    const data = prepareVisibleThreeColumnAssignments(this.props.pageSize, this.props.sortedIndex, this.props.threeColumns);
    return this.renderGroupedBricks(data);
  }

  renderSortedBricks() {
    const data = prepareVisibleAssignments(this.props.sortedIndex, this.props.pageSize, this.props.assignments);
    return data.map(item => this.renderBrick(item));
  }

  renderAssignedBricks() {
    const {checked, submitted, completed } = this.props.filters;
    if (!checked && !submitted && !completed) {
      return this.renderAssignedGroupedBricks();
    }
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
