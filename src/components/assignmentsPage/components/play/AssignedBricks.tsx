import React, { Component } from "react";

import { User } from "model/user";
import { AssignmentBrickData } from '../../model';
import { prepareVisibleAssignments } from '../../service';
import { AssignmentBrick } from "model/assignment";

import BrickBlock16x9 from "components/viewAllPage/components/BrickBlock16x9";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";

import "./AssignedBricks.scss";
import { Subject } from "model/brick";

interface AssignedBricksProps {
  user: User;
  shown: boolean;
  subjects: Subject[];
  pageSize: number;
  sortedIndex: number;
  assignments: AssignmentBrick[];
  history: any;
}

class AssignedBricks extends Component<AssignedBricksProps> {
  renderBrick(item: AssignmentBrickData) {
    let circleIcon = '';
    const color = this.props.subjects.find(s => s.id === item.brick.subjectId)?.color;
    if (item.isInvitation) {
      circleIcon="users";
    }
    return <BrickBlock16x9
      brick={item.brick}
      index={item.index}
      row={item.row}
      user={this.props.user}
      key={item.index}
      shown={this.props.shown}
      isAssignment={true}
      assignmentStatus={item.status}
      assignmentId={item.assignmentId}
      history={this.props.history}
      color={color}
      circleIcon={circleIcon}
      deadline={item.deadline}
      searchString=""
      handleDeleteOpen={() => {}}
    />
  }

  renderSortedBricks() {
    const data = prepareVisibleAssignments(this.props.sortedIndex, this.props.pageSize, this.props.assignments);
    return data.map(item => this.renderBrick(item));
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

  render() {
    return (
      <div className="bricks-list-container">
        {this.props.assignments.length > 0 ?
          <div className="bricks-list">
            { this.renderSortedBricks() }
          </div>
          : this.renderEmptyPage()
        }
      </div>
    );
  }
}

export default AssignedBricks;
