import React, { Component } from "react";
import { Box, Grid, Grow } from "@material-ui/core";
import { Swiper, SwiperSlide } from 'swiper/react';

import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";
import { User } from "model/user";
import { getAssignmentIcon } from "components/services/brickService";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import { setAssignmentId } from "localStorage/playAssignmentId";
import routes from "components/play/routes";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";

interface Props {
  history: any;
  assignments: AssignmentBrick[];
  classrooms: any[];
  shown: boolean;
  user: User;

  handleClick(i: number): void;
}

class MobileLearn extends Component<Props> {
  getColor(item: AssignmentBrick) {
    if (item.status === AssignmentBrickStatus.ToBeCompleted) {
      return 'color1';
    } else if (item.status === AssignmentBrickStatus.SubmitedToTeacher) {
      return 'color2';
    } else if (item.status === AssignmentBrickStatus.CheckedByTeacher) {
      return 'color3';
    }
    return '';
  }

  moveToPlay(a: AssignmentBrick) {
    setAssignmentId(a.id);
    this.props.history.push(routes.phonePrep(a.brick.id));
  }

  renderExpandedBrick(a: AssignmentBrick) {
    let color = this.getColor(a);

    return (
      <ExpandedMobileBrick
        brick={a.brick}
        circleClass={color}
        color={color}
        move={() => this.moveToPlay(a)}
        hide={() => { }}
      />
    );
  }

  renderMobileBricks() {
    const assignments = this.props.assignments.sort((a, b) => new Date(a.brick.updated).getTime() - new Date(b.brick.updated).getTime());
    let bricksList = [];
    for (let i = 0; i < assignments.length; i++) {
      const brick = assignments[i].brick;
      if (brick) {
        const color = this.getColor(assignments[i]);
        const circleIcon = getAssignmentIcon(brick);
        bricksList.push(
          <PhoneTopBrick16x9
            circleIcon={circleIcon}
            brick={brick}
            index={i}
            color={color}
          />
        );
      }
    }

    return (
      <Swiper slidesPerView={1}>
        {bricksList.map((b, i) =>
          <SwiperSlide key={i} onClick={() => this.props.handleClick(i)}>
            {i === 0 && <div className="week-brick">Latest assignmnet</div>}
            {b}
          </SwiperSlide>
        )}
      </Swiper>
    );
  }

  renderBrick = (a: AssignmentBrick, key: number) => {
    const color = this.getColor(a);
    const circleIcon = getAssignmentIcon(a.brick);
    let className = 'sorted-brick absolute-container';

    if (a.brick.expanded) {
      className += " brick-hover";
    }

    return (
      <Grow
        in={this.props.shown}
        style={{ transformOrigin: "0 0 0" }}
        timeout={key * 150}
      >
        <div key={key} className="main-brick-container">
          <Box className="brick-container">
            <div className={className} onClick={() => this.props.handleClick(key)}>
              <ShortBrickDescription
                brick={a.brick}
                color={color}
                circleClass={color}
                isMobile={true}
                circleIcon={circleIcon}
                isExpanded={a.brick.expanded}
                searchString=""
                move={() => this.moveToPlay(a)}
              />
            </div>
          </Box>
        </div>
      </Grow>
    );
  };

  renderSortedBricks = (assignments: AssignmentBrick[]) => {
    let bricksList = [];
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i]) {
        bricksList.push(this.renderBrick(assignments[i], i));
      }
    }
    return bricksList;
  };

  renderClassroom(classroom: any, i: number) {
    return (
      <div key={i}>
        <div className="gg-subject-name">
          {classroom.name}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="main-listing dashboard-page mobile-category learn-mobile-tab student-mobile-assignments-page">
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          history={this.props.history}
        />
        <div className="mobile-scroll-bricks phone-top-bricks16x9">
          {this.renderMobileBricks()}
        </div>
        <div className="brick-row-title">
          <button className="btn btn-transparent svgOnHover" style={{ width: '100vw' }}>
            <span style={{ textTransform: 'uppercase' }}>Assignments</span>
          </button>
        </div>
        <div className="va-bricks-container">
          {this.props.classrooms.map(this.renderClassroom.bind(this))}
        </div>
      </div>
    );
  }
}

export default MobileLearn;
