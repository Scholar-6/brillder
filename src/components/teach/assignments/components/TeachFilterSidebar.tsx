import React, { Component } from "react";
import { Grid } from "@material-ui/core";
// @ts-ignore
import { Steps } from 'intro.js-react';

import "./TeachFilterSidebar.scss";
import { ClassroomStatus, TeachClassroom, TeachStudent } from "model/classroom";
import { TeachFilters } from "../../model";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import EmptyFilter from "../filter/EmptyFilter";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import CreateClassDialog from "components/teach/manageClassrooms/components/CreateClassDialog";
import StudentInviteSuccessDialog from "components/play/finalStep/dialogs/StudentInviteSuccessDialog";
import { resendInvitation } from "services/axios/classroom";
import { getClassAssignedCount } from "../service/service";
import { User } from "model/user";
import SortButton from "./SortButton";
import { Subject } from "model/brick";

enum TeachFilterFields {
  Assigned = "assigned",
  Completed = "completed",
}

interface FilterSidebarProps {
  isLoaded: boolean;
  isNewTeacher: boolean;
  user: User;
  history: any;
  classrooms: TeachClassroom[];
  activeStudent: TeachStudent | null;
  activeClassroom: TeachClassroom | null;
  isArchive: boolean;
  setActiveStudent(s: TeachStudent): void;
  setActiveClassroom(id: number | null): void;
  filterChanged(filters: TeachFilters): void;
  hideIntro(): void;
  moveToPremium(): void;
  createClass(name: string, users: User[]): void;
}

interface FilterSidebarState {
  filters: TeachFilters;
  ascending: boolean | null;
  sortByName: boolean | null;
  isInviteOpen: boolean;
  createClassOpen: boolean;
  sort: SortClassroom;
  subjects: Subject[];
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
      subjects: []
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

  toggleClassroom(e: any, activeClassroom: TeachClassroom) {
    e.stopPropagation();
    e.preventDefault();
    let active = !activeClassroom.active;
    if (active === true) {
      this.props.setActiveClassroom(activeClassroom.id);
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

  renderClassoomSubject(c: TeachClassroom) {
    if (c.subject) {
      return (
        <RadioButton
          checked={false}
          color={c.subject.color}
          name={c.subject.name}
        />
      );
    }
    return (
      <RadioButton
        checked={false}
        color="#4C608A"
        name=""
      />
    );
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
            {this.renderClassoomSubject(c)}
            <span className="filter-class-name">{c.name}</span>
          </div>
        </div>
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
            Subscribe <SpriteIcon name="hero-sparkle" />
          </div>
        </div>
      </div>
    );
  }
  renderPremiumBoxCondition() {
    if (this.props.user.isFromInstitution || this.props.user.library) {
      return '';
    }
    return this.renderPremiumBox();
  }

  renderClassesBox() {
    let finalClasses = [];
    let finalArchivedClasses = [];
    let classrooms = this.props.classrooms.filter(c => c.status == ClassroomStatus.Active);
    let archivedClassrooms = this.props.classrooms.filter(c => c.status == ClassroomStatus.Archived);

    for (const cls of classrooms) {
      const finalClass = Object.assign({}, cls) as any;
      finalClass.assigned = getClassAssignedCount(cls);
      finalClasses.push(finalClass);
    }
    const { sort } = this.state;
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

    for (const cls of archivedClassrooms) {
      const finalClass = Object.assign({}, cls) as any;
      finalClass.assigned = getClassAssignedCount(cls);
      finalArchivedClasses.push(finalClass);
    }

    if (sort === SortClassroom.Date) {
      finalArchivedClasses = finalArchivedClasses.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
    } else if (sort === SortClassroom.Assignment) {
      finalArchivedClasses = finalArchivedClasses.sort((a, b) => b.assignmentsCount - a.assignmentsCount);
    } else if (sort === SortClassroom.Name) {
      finalArchivedClasses = finalArchivedClasses.sort((a, b) => {
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
        <div className="sort-box">
          <div
            className={
              "index-box m-view-all flex-center " +
              (!this.props.activeClassroom ? "active" : "")
            }
          >
            <div className="label-34rerf">
              Archived ({finalArchivedClasses.length})
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
            {finalArchivedClasses.map(this.renderClassroom.bind(this))}
          </div>
        </div>
        {(this.props.user.subscriptionState === 0 || !this.props.user.subscriptionState) && this.renderPremiumBoxCondition()}
      </div>
    );
  }

  renderContent() {
    if (!this.props.isLoaded) {
      return <div></div>;
    }
    if (this.props.isLoaded && this.props.classrooms.length === 0) {
      return <EmptyFilter createClassToggle={() => this.setState({ createClassOpen: true })} />;
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
        container item xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        {this.renderContent()}
        <div className="sidebar-footer" />
        {this.state.createClassOpen &&
        <CreateClassDialog
          isOpen={this.state.createClassOpen}
          subjects={this.state.subjects}
          history={this.props.history}
          submit={(name, users) => {
            this.props.createClass(name, users);
            this.setState({ createClassOpen: false });
          }}
          close={() => {
            this.setState({ createClassOpen: false });
          }}
        />}
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
