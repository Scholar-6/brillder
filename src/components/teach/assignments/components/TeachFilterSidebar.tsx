import React, { Component } from "react";
import { FormControlLabel, Grid, Radio } from "@material-ui/core";

import "./TeachFilterSidebar.scss";
import { ClassroomStatus, TeachClassroom, TeachStudent } from "model/classroom";
import { TeachFilters } from "../../model";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import EmptyFilter from "../filter/EmptyFilter";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import CreateClassDialog from "components/teach/manageClassrooms/components/CreateClassDialog";
import StudentInviteSuccessDialog from "components/play/finalStep/dialogs/StudentInviteSuccessDialog";
import { resendInvitation } from "services/axios/classroom";
import { User } from "model/user";
import SortButton from "./SortButton";
import { Subject } from "model/brick";

enum TeachFilterFields {
  Assigned = "assigned",
  Completed = "completed",
}

interface FilterSidebarProps {
  isLoaded: boolean;
  user: User;
  history: any;
  subjects: Subject[];
  classrooms: TeachClassroom[];
  activeStudent: TeachStudent | null;
  activeClassroom: TeachClassroom | null;
  setActiveStudent(s: TeachStudent): void;
  setActiveClassroom(id: number | null): void;
  filterChanged(filters: TeachFilters): void;
  moveToPremium(): void;
  loadClass(classId: number): void;
  sortClassrooms(sort: SortClassroom): void;
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

  toggleClassroom(e: any, activeClassroom: TeachClassroom) {
    e.stopPropagation();
    e.preventDefault();
    let active = !activeClassroom.active;
    if (active === true) {
      this.props.setActiveClassroom(activeClassroom.id);
    }
  }

  unselectClassroom(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.props.setActiveClassroom(-1);
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
    const classrooms = this.props.classrooms.filter(c => c.status == ClassroomStatus.Active);
    
    return (
      <div className="sort-box teach-sort-box flex-height-box">
        <div className="sort-box">
          <div className="top-row-v5">
            <div className="text bold">CLASSES</div>
            <div className="btn btn-orange" onClick={() => this.setState({ createClassOpen: true })}>
              Create Class
            </div>
          </div>
          <div
            className={
              "index-box m-view-all flex-center " +
              (!this.props.activeClassroom ? "active" : "")
            }
          >
            <div className="label-34rerf">
              <FormControlLabel
                value={!this.props.activeClassroom}
                style={{ marginRight: 0}}
                onClick={e => this.unselectClassroom(e)}
                control={
                  <Radio
                    className="sortBy"
                    checked={!this.props.activeClassroom}
                  />
                }
                label={`All Classes (${classrooms.length})`}
              />
            </div>
            <SortButton sort={this.state.sort} sortByName={() => {
              this.props.sortClassrooms(SortClassroom.Name);
              this.setState({ sort: SortClassroom.Name });
            }} sortByDate={() => {
              this.props.sortClassrooms(SortClassroom.Date);
              this.setState({ sort: SortClassroom.Date });
            }} sortByAssignmets={() => {
              this.props.sortClassrooms(SortClassroom.Assignment);
              this.setState({ sort: SortClassroom.Assignment });
            }} />
          </div>
        </div>
        <div className="sort-box subject-scrollable">
          <div className="filter-container indexes-box classrooms-filter">
            {classrooms.map(this.renderClassroom.bind(this))}
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

  render() {
    console.log('s55', this.props.subjects)
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
            subjects={this.props.subjects}
            history={this.props.history}
            submit={classroomId => {
              this.props.loadClass(classroomId);
              this.setState({ createClassOpen: false });
            }}
            close={() => {
              this.setState({ createClassOpen: false });
            }}
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
