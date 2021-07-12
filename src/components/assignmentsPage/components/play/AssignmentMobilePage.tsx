import React, { Component } from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReduxCombinedState } from "redux/reducers";
import { AssignmentBrick } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "services/axios/brick";
import { checkAdmin, checkTeacher } from "components/services/brickService";
import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PhoneExpandedBrick from "components/viewAllPage/components/PhoneExpandedBrick";

enum Tab {
  Assignemnts,
  Completed,
}

interface PlayProps {
  history: any;
  match: any;

  // redux
  user: User;
  requestFailed(value: string): void;
}

interface PlayState {
  activeTab: any;
  expandedClassroom: any;
  expandedAssignment: AssignmentBrick | null;
  finalAssignments: AssignmentBrick[];
  rawAssignments: AssignmentBrick[];
  classrooms: any[];
  isAdmin: boolean;
  isTeach: boolean;
  isLoaded: boolean;
}

class AssignmentMobilePage extends Component<PlayProps, PlayState> {
  constructor(props: PlayProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user);
    const isAdmin = checkAdmin(this.props.user.roles);

    this.state = {
      activeTab: Tab.Assignemnts,
      expandedAssignment: null,
      expandedClassroom: null,
      finalAssignments: [],
      rawAssignments: [],
      classrooms: [],
      isLoaded: false,
      isAdmin, isTeach,
    }

    this.getAssignments();
  }

  getClassrooms(assignments: AssignmentBrick[]) {
    let classrooms: any[] = [];
    for (let assignment of assignments) {
      if (assignment.classroom) {
        const found = classrooms.find(c => c.id === assignment.classroom.id);
        if (!found) {
          classrooms.push(assignment.classroom);
        }
      }
    }
    for (let classroom of classrooms) {
      classroom.assignments = [];
      for (let assignment of assignments) {
        if (assignment.classroom?.id === classroom.id) {
          classroom.assignments.push(assignment);
        }
      }
    }
    return classrooms;
  }

  async getAssignments() {
    const assignments = await getAssignedBricks();
    if (assignments) {
      const classrooms = this.getClassrooms(assignments);
      this.setState({ ...this.state, isLoaded: true, rawAssignments: assignments, finalAssignments: assignments, classrooms });
    } else {
      this.props.requestFailed('Can`t get bricks for current user');
      this.setState({ isLoaded: true })
    }
  }

  handleMobileClick(index: number) {
    let { finalAssignments } = this.state;
    if (finalAssignments[index].brick.expanded === true) {
      finalAssignments[index].brick.expanded = false;
      this.setState({ ...this.state });
      return;
    }
    finalAssignments.forEach(a => a.brick.expanded = false);
    finalAssignments[index].brick.expanded = true;
    this.setState({ ...this.state });
  }

  expandClass(c: any) {
    this.setState({ expandedClassroom: c })
  }

  hideClass() {
    this.setState({ expandedClassroom: null });
  }

  setCompletedTab() {
    if (this.state.activeTab !== Tab.Completed) {
      this.setState({ activeTab: Tab.Completed });
    }
  }

  setAssignmentsTab() {
    if (this.state.activeTab !== Tab.Assignemnts) {
      this.setState({ activeTab: Tab.Assignemnts });
    }
  }

  renderTab(label: string, tab: Tab, className: string) {
    const onClick = () => {
      if (this.state.activeTab !== tab) {
        this.setState({ activeTab: tab });
      }
    }
    return (
      <div
        className={`${className} ${this.state.activeTab === tab ? "active" : ""}`}
        onClick={onClick}
      >
        {label}
      </div>
    );
  }

  renderMobileBricks() {
    const assignments = this.state.finalAssignments.sort((a, b) => new Date(a.brick.updated).getTime() - new Date(b.brick.updated).getTime());

    return (
      <Swiper slidesPerView={1}>
        {assignments.map((a, i) =>
          <SwiperSlide key={i} onClick={() => { }}>
            {i === 0 && <div className="week-brick">Latest assignmnet</div>}
            <PhoneTopBrick16x9
              circleIcon={''}
              brick={a.brick}
              index={i}
              color={a.brick?.subject?.color}
            />
          </SwiperSlide>
        )}
      </Swiper>
    );
  }

  renderAssignments(assignments: any[]) {
    return (
      <div className="bricks-scroll-row">
        <div className="bricks-flex-row" style={{ width: assignments.length * 60 + 2 + "vw" }}>
          {assignments.map((a, i) =>
            <PhoneTopBrick16x9
              circleIcon={''}
              brick={a.brick}
              index={i}
              color={a.brick?.subject?.color}
              onClick={() => {
                if (this.state.expandedAssignment === a) {
                  this.setState({ expandedAssignment: null });
                } else {
                  this.setState({ expandedAssignment: a });
                }
              }}
            />)}
        </div>
      </div>
    );
  }

  renderClassroom(classroom: any, i: number) {
    const { expandedClassroom } = this.state;
    if (expandedClassroom) {
      return (
        <div>
          <div className="gg-subject-name">
            {expandedClassroom.name}
            {expandedClassroom.bricks.length > 0 && (
              <div
                className="va-expand va-hide"
                onClick={this.hideClass.bind(this)}
              >
                <SpriteIcon name="arrow-up" />
              </div>
            )}
          </div>
        </div>
      )
    }
    return (
      <div key={i}>
        <div className="gg-subject-name">
          {classroom.name}
          {classroom.assignments.length > 0 && (
            <div
              className="va-expand"
              onClick={() => this.expandClass(classroom)}
            >
              <SpriteIcon name="arrow-down" />
            </div>
          )}
        </div>
        {this.renderAssignments(classroom.assignments)}
      </div>
    );
  }

  render() {
    const { expandedAssignment } = this.state;
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
        <div className="ss-tabs-container">
          {this.renderTab('Assignments', Tab.Assignemnts, 'ss-tab-1')}
          {this.renderTab('Completed', Tab.Completed, 'ss-tab-2')}
        </div>
        <div className="va-bricks-container">
          {this.state.classrooms.map(this.renderClassroom.bind(this))}
        </div>
        {expandedAssignment && expandedAssignment.brick && (
          <PhoneExpandedBrick
            brick={expandedAssignment.brick}
            history={this.props.history}
            hide={() => this.setState({ expandedAssignment: null })}
          />
        )}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(AssignmentMobilePage);
