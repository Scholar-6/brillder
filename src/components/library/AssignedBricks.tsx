import React, { Component } from "react";

import { User } from "model/user";
import { AssignmentBrickData } from '../backToWorkPage/model';
import { prepareVisibleAssignments } from '../assignmentsPage/service';
import { AssignmentBrick } from "model/assignment";
import { Subject } from "model/brick";

import { Box } from "@material-ui/core";
import AuthorSearchRow from "components/baseComponents/AuthorRow";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";

interface AssignedBricksProps {
  user: User;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  subjects: Subject[];
  assignments: AssignmentBrick[];
  history: any;
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

  renderIcon(onClick: Function) {
    return (
      <div className="round-button-icon" onClick={() => onClick()}>
        <SpriteIcon name='book-open' className='text-white' />
      </div>
    );
  }

  renderCircle(color: string, onClick: Function) {
    return (
      <div className="left-brick-circle">
        <div className="round-button pointer" style={{ background: `${color}` }}>
          {this.renderIcon(onClick)}
        </div>
      </div>
    );
  }

  renderShortDescription(item: AssignmentBrickData) {
    const color = this.getColor(item);
    const {brick} = item;
    
    const onClick = () => {
      this.props.history.push(map.postPlay(item.brick.id, this.props.user.id));
    }

    return (
      <div className="short-description">
        {this.renderCircle(color, onClick)}
        <div className="short-brick-info">
          <div className="link-description">
            {brick.title}
          </div>
          <div className="link-info">
            {brick.subTopic} | {brick.alternativeTopics}
          </div>
          <div className="link-info">
            <AuthorSearchRow searchString='' brick={brick} />
          </div>
        </div>
      </div>
    );
  }

  renderBrick(item: AssignmentBrickData) {
    return (
      <div className="main-brick-container" key={item.key}>
        <Box className="brick-container">
          <div className="absolute-container">
            {this.renderShortDescription(item)}
          </div>
        </Box>
      </div>
    );
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
