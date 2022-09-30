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
import SortButton from "./SortButton";

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
  ascending: boolean | null;
  sortByName: boolean | null;
  isInviteOpen: boolean;
  createClassOpen: boolean;
  sort: SortClassroom;
}

export enum SortClassroom {
  Name,
  Date,
  Assignment
}

class TeachFilterSidebar extends Component<
  FilterSidebarProps,
  FilterSidebarState
> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      ascending: true,
      sortByName: null,
      isInviteOpen: false,

      sort: SortClassroom.Date,

      filters: {
        assigned: false,
        completed: false,
      },
      createClassOpen: false,
    };
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

  renderStudentList(c: TeachClassroom) {
    if (c.active) {
      const sts = c.students.sort((a, b) => {
        if (a.lastName && b.lastName) {
          const al = a.lastName.toUpperCase();
          const bl = b.lastName.toUpperCase();
          if (al < bl) { return -1; }
          if (al > bl) { return 1; }
        }
        return 0;
      });

      return <div>
        {sts.map(this.renderStudent.bind(this))}
      </div>
    }
    return <div />
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
        </div>
        {this.renderStudentList(c)}
        {c.active && c.studentsInvitations && c.studentsInvitations.map(this.renderInvitation.bind(this))}
      </div>
    );
  }

  renderPremiumBox() {
    let className = 'pay-info ';
    let noFreeTries = false;
    if (this.props.user && this.props.user.freeAssignmentsLeft < 1) {
      className += " no-free-tries";
      noFreeTries = true;
    }
    return (
      <div className={className}>
        <div>
          <div className="premium-label">
            {noFreeTries ? 'No Free Assignments Left!' : <span>{this.props.user && this.props.user.freeAssignmentsLeft} Free Assignment{this.props.user.freeAssignmentsLeft > 1 ? 's' : ''} Left</span>}
          </div>
          <div className="premium-btn" onClick={this.props.moveToPremium}>
            Go Premium <SpriteIcon name="hero-sparkle" />
          </div>
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
    const {sort} = this.state;
    if (sort === SortClassroom.Date) {
      finalClasses = finalClasses.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
    } else if (sort === SortClassroom.Assignment) {
      finalClasses = finalClasses.sort((a, b) => b.assignmentsCount - a.assignmentsCount);
    } else if (sort === SortClassroom.Name) {
      finalClasses = finalClasses.sort((a, b) => {
        const al = a.name.toUpperCase();
        const bl = b.name.toUpperCase();
        if (al < bl) { return -1; }
        if (al > bl) { return 1; }
        return 0;
      });
    }

    return (
      <div className="sort-box teach-sort-box flex-height-box">
        <div className="sort-box">
          <div className="classrooms-header">
            <div className="label-ew23 bold">
              My Classes
            </div>
            <div className="create-class-button assign flex-relative" onClick={() => this.setState({ createClassOpen: true })}>
              <SpriteIcon name="plus-circle" /> Create Class
            </div>
          </div>
          <div
            className={
              "index-box m-view-all flex-center " +
              (!this.props.activeClassroom ? "active" : "")
            }
            onClick={this.removeClassrooms.bind(this)}
          >
            <div className="label-34rerf">
              Current ({finalClasses.length})
            </div>
            <SortButton sort={this.state.sort} sortByName={() => {
              this.setState({ sort: SortClassroom.Name });
            }} sortByDate={() => {
              this.setState({ sort: SortClassroom.Date });
            }} sortByAssignmets={() => {
              this.setState({ sort: SortClassroom.Assignment });
            }} />
          </div>
        </div>
        <div className="sort-box subject-scrollable">
          <div className="filter-container indexes-box classrooms-filter">
            {finalClasses.map(this.renderClassroom.bind(this))}
          </div>
        </div>
        {(this.props.user.subscriptionState === 0 || !this.props.user.subscriptionState) && this.renderPremiumBox()}
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
              intro: `<p>Invited learners will remain amber until they accept to join your class</p>`,
            }, {
              element: '.classes-box',
              intro: `<p>Invited learners will remain amber until they accept to join your class</p>`,
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
