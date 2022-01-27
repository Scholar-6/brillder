import React, { Component } from "react";
import { Grid } from "@material-ui/core";
// @ts-ignore
import { Steps } from 'intro.js-react';

import "./TeachFilterSidebar.scss";
import { TeachClassroom, TeachStudent } from "model/classroom";
import { TeachFilters } from "../../model";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import EmptyFilter from "../filter/EmptyFilter";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import CreateClassDialog from "components/teach/manageClassrooms/components/CreateClassDialog";
import { Subject } from "model/brick";
import StudentInviteSuccessDialog from "components/play/finalStep/dialogs/StudentInviteSuccessDialog";
import { resendInvitation } from "services/axios/classroom";
import { getClassAssignedCount } from "../service/service";
import { User } from "model/user";

enum TeachFilterFields {
  Assigned = "assigned",
  Completed = "completed",
}

interface FilterSidebarProps {
  isLoaded: boolean;
  isNewTeacher: boolean;
  user: User;
  classrooms: TeachClassroom[];
  activeStudent: TeachStudent | null;
  activeClassroom: TeachClassroom | null;
  setActiveStudent(s: TeachStudent): void;
  setActiveClassroom(id: number | null): void;
  filterChanged(filters: TeachFilters): void;
  hideIntro(): void;
  moveToPremium(): void;
  createClass(name: string, subject: Subject): void;
  isArchive: boolean;
}

interface FilterSidebarState {
  filters: TeachFilters;
  ascending: boolean;
  isInviteOpen: boolean;
  createClassOpen: boolean;
}

class TeachFilterSidebar extends Component<
  FilterSidebarProps,
  FilterSidebarState
> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      ascending: false,
      isInviteOpen: false,
      filters: {
        assigned: false,
        completed: false,
      },
      createClassOpen: false,
    };
  }

  clearStatus() {
    const { filters } = this.state;
    filters.assigned = false;
    filters.completed = false;
    this.props.filterChanged(filters);
  }

  async resendInvitation(s: any) {
    if (this.props.activeClassroom) {
      await resendInvitation(this.props.activeClassroom as any, s.email);
      this.setState({ isInviteOpen: true });
    }
  }

  toggleFilter(filter: TeachFilterFields) {
    const { filters } = this.state;
    filters[filter] = !filters[filter];
    this.props.filterChanged(filters);
  }

  removeClassrooms() {
    this.props.setActiveClassroom(null);
  }

  toggleClassroom(e: any, activeClassroom: TeachClassroom) {
    e.stopPropagation();
    e.preventDefault();
    let active = !activeClassroom.active;
    if (active === true) {
      this.props.setActiveClassroom(activeClassroom.id);
    } else {
      this.props.setActiveClassroom(null);
    }
  }

  renderStudent(s: TeachStudent, key: number) {
    let className = "student-row";

    if (this.props.activeStudent) {
      if (s.id === this.props.activeStudent.id) {
        className += " active";
      }
    }

    return (
      <div
        className={className}
        key={key}
        onClick={() => this.props.setActiveStudent(s)}
      >
        <span className="student-name">
          {s.firstName} {s.lastName}
        </span>
      </div>
    );
  }

  renderInvitation(s: any, key: number) {
    return (
      <div className="student-row invitation" key={key}>
        <span className="student-name">
          <span>{s.email}</span>
          <button className="btn resend-label" onClick={
            () => this.resendInvitation(s)
          }>Resend<SpriteIcon name="send-custom" /></button>
        </span>
      </div>
    );
  }

  renderAssignedCount(c: TeachClassroom) {
    const count = getClassAssignedCount(c);
    if (count <= 0) {
      return <div />;
    }
    return (
      <div className="classrooms-box">
        {count}
        <div />
      </div>
    );
  }

  renderStudents(c: TeachClassroom) {
    return (
      <div className="right-index">
        {(c.students ? c.students.length : 0) + (c.studentsInvitations ? c.studentsInvitations.length : 0)}
        <SpriteIcon name="users-custom" className="active" />
        {this.renderAssignedCount(c)}
      </div>
    )
  }

  renderClassroom(c: TeachClassroom, i: number) {
    return (
      <div key={i} className="classes-box">
        <div
          className={"index-box " + (c.active ? "active" : "")}
          onClick={(e) => this.toggleClassroom(e, c)}
          title={c.name}
        >
          <div className={"classroom-name " + (c.active ? "icon-animated" : "")}>
            {c.subject.color &&
              <RadioButton
                checked={c.active}
                color={c.subject.color}
                name={c.subject.name}
              />}
            <span className="filter-class-name">{c.name}</span>
            {c.active && (c.students.length > 0 || (c.studentsInvitations && c.studentsInvitations.length > 0)) && (
              <div className="classroom-icon svgOnHover">
                <SpriteIcon name="arrow-right" className="active" />
              </div>
            )}
          </div>
          {this.renderStudents(c)}
        </div>
        {c.active && c.students && c.students.map(this.renderStudent.bind(this))}
        {c.active && c.studentsInvitations && c.studentsInvitations.map(this.renderInvitation.bind(this))}
      </div>
    );
  }

  renderPremiumBox() {
    let className = 'index-box pay-info ';
    let noFreeTries = false;
    if (this.props.user && this.props.user.freeAssignmentsLeft < 1) {
      className += " no-free-tries";
      noFreeTries = true;
    }
    return (
      <div className={className}>
        <div className="premium-label">
          {noFreeTries ? 'No Free Assignments Left!' : <span>{this.props.user && this.props.user.freeAssignmentsLeft} Free Assignment{this.props.user.freeAssignmentsLeft > 1 ? 's' : ''} Left</span>}
        </div>
        <div className="premium-btn" onClick={this.props.moveToPremium}>
          Go Premium <SpriteIcon name="hero-sparkle" />
        </div>
      </div>
    );
  }

  renderClassesBox() {
    let finalClasses = [];
    for (const cls of this.props.classrooms) {
      let finalClass = Object.assign({}, cls) as any;
      finalClass.assigned = getClassAssignedCount(cls);
      finalClasses.push(finalClass);
    }
    if (this.state.ascending) {
      finalClasses = finalClasses.sort((a, b) => a.assigned - b.assigned);
    } else {
      finalClasses = finalClasses.sort((a, b) => b.assigned - a.assigned);
    }
    let totalBricks = 0;
    let totalCount = 0;
    let assignmentsCount = 0;
    for (let classroom of this.props.classrooms) {
      totalCount += classroom.students.length;
      totalBricks += 1;
      if (classroom.assignments && classroom.assignments.length > 0) {
        assignmentsCount += classroom.assignments.length;
      }
    }
    let label = '1 ASSIGNMENT';
    if (assignmentsCount > 1) {
      label = `${assignmentsCount} ASSIGNMENTS`;
    }
    return (
      <div className="sort-box teach-sort-box flex-height-box">
        <div className="sort-box">
          <div className="filter-container sort-by-box">
            <div style={{ display: "flex" }}>
              <div className="class-header" style={{ width: "100%" }}>
                {label}
              </div>
            </div>
          </div>
          <div
            className="create-class-button assign"
            onClick={() => this.setState({ createClassOpen: true })}
          >
            In {finalClasses.length} Classes
            <div className="flex-relative">
              <SpriteIcon name="plus-circle" />
              <div className="custom-tooltip">Create Class</div>
            </div>
          </div>
          {(this.props.user.subscriptionState === 0 || !this.props.user.subscriptionState) && this.renderPremiumBox()}
          <div
            className={
              "index-box m-view-all " +
              (!this.props.activeClassroom ? "active" : "")
            }
            onClick={this.removeClassrooms.bind(this)}
          >
            View All Classes
            <div className="right-index">
              {totalCount}
              <SpriteIcon name="users-custom" className="active" />
              <div className="classrooms-box">
                {totalBricks}
                <div />
              </div>
            </div>
            <div className="m-absolute-sort">
              <SpriteIcon
                name={
                  this.state.ascending
                    ? "hero-sort-ascending"
                    : "hero-sort-descending"
                }
                onClick={() =>
                  this.setState({ ascending: !this.state.ascending })
                }
              />
              <div className="css-custom-tooltip">
                {this.state.ascending ? 'Sort by most assignments' : 'Sort by fewest assignments'}
              </div>
            </div>
          </div>
        </div>
        <div className="sort-box subject-scrollable">
          <div className="filter-container indexes-box classrooms-filter">
            {finalClasses.map(this.renderClassroom.bind(this))}
          </div>
        </div>
      </div>
    );
  }

  renderContent() {
    if (!this.props.isLoaded) {
      return <div></div>;
    }
    if (this.props.isLoaded && this.props.classrooms.length === 0) {
      return <EmptyFilter />;
    }
    return this.renderClassesBox();
  }

  onIntroExit() {
    this.props.hideIntro();
  }

  onIntroChanged(e: any) {
    if (e !== 0) {
      this.props.hideIntro();
    }
  }

  render() {
    return (
      <Grid
        container
        item
        xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        {this.renderContent()}
        <div className="sidebar-footer" />
        <CreateClassDialog
          isOpen={this.state.createClassOpen}
          submit={(name, subject) => {
            this.props.createClass(name, subject);
            this.setState({ createClassOpen: false });
          }}
          close={() => {
            this.setState({ createClassOpen: false });
          }}
        />
        {this.props.isNewTeacher &&
          <Steps
            enabled={this.props.isNewTeacher}
            steps={[{
              element: '.classes-box',
              intro: `<p>Invited students will remain amber until they accept to join your class</p>`,
            }, {
              element: '.classes-box',
              intro: `<p>Invited students will remain amber until they accept to join your class</p>`,
            }]}
            initialStep={0}
            onChange={this.onIntroChanged.bind(this)}
            onExit={this.onIntroExit.bind(this)}
            onComplete={() => { }}
          />}
        <StudentInviteSuccessDialog
          numStudentsInvited={this.state.isInviteOpen ? 1 : 0}
          close={() => this.setState({ isInviteOpen: false })}
        />
      </Grid>
    );
  }
}

export default TeachFilterSidebar;
