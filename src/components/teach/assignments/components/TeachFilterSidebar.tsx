import React, { Component } from "react";
import { FormControlLabel, Grid, MenuItem, Radio, Select } from "@material-ui/core";

import "./TeachFilterSidebar.scss";
import { ClassroomStatus, TeachClassroom } from "model/classroom";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import EmptyFilter from "./EmptyFilter";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import CreateClassDialog from "./CreateClassDialog";
import { User } from "model/user";
import SortButton from "./SortButton";
import { Subject } from "model/brick";
import { GetSortSidebarClassroom } from "localStorage/assigningClass";
import { checkAdminOrInstitution, checkRealInstitution } from "components/services/brickService";

export enum ClassroomChoice {
  MyClasses = 1,
  Domain,
  AllClasses,
}

export interface ClassroomSelect {
  value: string;
  domain: string;
  type: ClassroomChoice;
}

interface FilterSidebarProps {
  isLoaded: boolean;
  user: User;
  history: any;
  subjects: Subject[];
  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;
  setActiveClassroom(id: number | null): void;
  moveToPremium(): void;
  loadClass(classId: number): void;
  sortClassrooms(sort: SortClassroom): void;

  isSearching: boolean;
  viewAll(): void;

  // admin
  page: number;
  totalCount: number;
  selectedChoice: ClassroomChoice;
  moveToPage(page: number): void;
  classGroupSelected(choice: ClassroomChoice, domain: string): void;
}

interface FilterSidebarState {
  sortByName: boolean | null;
  createClassOpen: boolean;
  sort: SortClassroom;
  isMyClasses: boolean;
  selectedChoice: ClassroomSelect | null;
  classroomChoices: ClassroomSelect[];
  isAdminOrInstitution: boolean;
}

export enum SortClassroom {
  Empty,
  Name,
  Date,
  Assignment,
  DateInverse
}

export enum SortAssignment {
  Empty,
  Name,
  Date,
  Assignment,
  DateInverse,
  Custom
}

class TeachFilterSidebar extends Component<
  FilterSidebarProps,
  FilterSidebarState
> {
  constructor(props: FilterSidebarProps) {
    super(props);

    const sort = GetSortSidebarClassroom();

    if (sort) {
      this.props.sortClassrooms(sort);
    }

    let selectedChoice: ClassroomSelect | null = null;
    let classroomChoices: ClassroomSelect[] = [];

    let isAdminOrInstitution = checkAdminOrInstitution(this.props.user.roles);
    if (isAdminOrInstitution) {
      classroomChoices.push({
        value: 'My Classes',
        type: ClassroomChoice.MyClasses
      } as ClassroomSelect);

      let isInstitution = checkRealInstitution(this.props.user.roles);

      let domains:string[] = [];
      if (isInstitution) {
        domains = this.props.user.instituitonDomains ? this.props.user.instituitonDomains : [];
        if (domains) {
          for (let domain of domains) {
            classroomChoices.push({
              value: domain,
              domain: domain,
              type: ClassroomChoice.Domain
            } as ClassroomSelect);
          }
        }
      }

      // instution with one domain don`t need all classes in dropdown
      if (domains && domains.length === 1) {

      } else {
        classroomChoices.push({
          value: 'All Classes',
          type: ClassroomChoice.AllClasses
        } as ClassroomSelect);
      }

      let choice = classroomChoices.find(c => c.type == props.selectedChoice);
      if (!choice) {
        choice = classroomChoices[0];
      }
      selectedChoice = choice;
    }

    this.state = {
      isAdminOrInstitution,
      selectedChoice,
      classroomChoices,
      sortByName: null,
      isMyClasses: false,
      sort: sort ? sort : SortClassroom.Date,
      createClassOpen: false,
    };
  }

  toggleClassroom(e: any, activeClassroom: TeachClassroom) {
    e.stopPropagation();
    e.preventDefault();
    let active = !activeClassroom.active;
    console.log(activeClassroom)
    if (active === true) {
      this.props.setActiveClassroom(activeClassroom.id);
    }
  }

  unselectClassroom(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.props.viewAll();
  }

  renderClassoomSubject(c: TeachClassroom) {
    let subject = this.props.subjects.find(s => s.id === c.subjectId);
    if (subject) {
      return (
        <RadioButton
          checked={false}
          color={subject.color}
          name={subject.name}
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
            <span className="filter-class-name" dangerouslySetInnerHTML={{ __html: c.name }}></span>
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

  renderPagination() {
    if (this.props.isSearching) {
      return '';
    }
    let lastPage = (this.props.page + 1) * 100;
    let endLimit = this.props.totalCount > (this.props.page + 1) * 100;
    
    return (
      <div className="sort-box">
        <div className="index-box m-view-all flex-center pagination">
          {this.props.page >= 1 &&
            <span onClick={() => {
              if (this.props.page >= 1) {
                this.props.moveToPage(this.props.page - 1);
              }
            }}>&lt;</span>
          } {1 + (this.props.page * 100)}-{lastPage < this.props.totalCount ? lastPage : this.props.totalCount} | {this.props.totalCount} {endLimit &&
            <span onClick={() => {
              if (endLimit) {
                this.props.moveToPage(this.props.page + 1);
              }
            }}>&gt;</span>}
        </div>
      </div>
    );
  }

  renderClassesBox() {
    const classrooms = this.props.classrooms.filter(c => c.status == ClassroomStatus.Active);

    if (this.state.isAdminOrInstitution) {
      return (
        <div className="sort-box teach-sort-box flex-height-box">
          <div className="sort-box">
            <div className="top-row-v5">
              <div className="text bold font-20">CLASSES</div>
              <div className="btn btn-orange font-16" onClick={() => this.setState({ createClassOpen: true })}>
                Create Class
              </div>
            </div>
          </div>
          <div className="sort-box">
            <div className={"index-box m-view-all flex-center " + (!this.props.activeClassroom ? "active" : "")}>
              <div>Show:</div>
              <Select
                className="selected-class-group"
                value={this.state.selectedChoice}
                MenuProps={{ classes: { paper: 'select-time-list' } }}
                onChange={e => {
                  const selectedChoice = e.target.value as ClassroomSelect;
                  this.setState({ selectedChoice });
                  this.props.classGroupSelected(selectedChoice.type, selectedChoice.domain);
                }}
              >
                {this.state.classroomChoices.map((c, i) => <MenuItem value={c as any} key={i}>{c.value}</MenuItem>)}
              </Select>
              <SortButton sortBy={this.state.sort} sort={(sort: SortClassroom) => {
                this.setState({ sort });
                this.props.sortClassrooms(sort);
              }} />
            </div>
          </div>
          <div className="sort-box subject-scrollable">
            <div className="filter-container indexes-box classrooms-filter">
              {classrooms.map(this.renderClassroom.bind(this))}
            </div>
          </div>
          {this.renderPagination()}
        </div>
      );
    }

    return (
      <div className="sort-box teach-sort-box flex-height-box">
        <div className="sort-box">
          <div className="top-row-v5">
            <div className="text bold font-20">CLASSES</div>
            <div className="btn btn-orange font-16" onClick={() => this.setState({ createClassOpen: true })}>
              Create Class
            </div>
          </div>
        </div>
        <div className="sort-box">
          <div
            className={
              "index-box m-view-all flex-center " +
              (!this.props.activeClassroom ? "active" : "")
            }
          >
            <div className="label-34rerf font-14" onClick={e => this.unselectClassroom(e)}>
              <FormControlLabel
                value={!this.props.activeClassroom}
                style={{ marginRight: 0 }}
                control={
                  <Radio
                    className="sortBy"
                    checked={!this.props.activeClassroom}
                  />
                }
                label={`All Classes (${classrooms.length})`}
              />
            </div>
            <SortButton sortBy={this.state.sort} sort={(sort: SortClassroom) => {
              this.setState({ sort });
              this.props.sortClassrooms(sort);
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

    if (this.props.isLoaded && this.props.classrooms.length === 0 && !this.state.isAdminOrInstitution) {
      return <EmptyFilter createClassToggle={() => this.setState({ createClassOpen: true })} />;
    }

    return this.renderClassesBox();
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
      </Grid>
    );
  }
}

export default TeachFilterSidebar;
