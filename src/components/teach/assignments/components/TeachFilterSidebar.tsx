import React, { Component } from "react";
import { FormControlLabel, Grid, Radio } from "@material-ui/core";

import "./TeachFilterSidebar.scss";
import { ClassroomStatus, TeachClassroom } from "model/classroom";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import EmptyFilter from "./EmptyFilter";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import CreateClassDialog from "./CreateClassDialog";
import { User } from "model/user";
import SortButton from "./SortButton";
import { Subject } from "model/brick";


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
}

interface FilterSidebarState {
  sortByName: boolean | null;
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
      sortByName: null,
      sort: SortClassroom.Date,
      createClassOpen: false,
    };
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
            <span className="filter-class-name" dangerouslySetInnerHTML={{ __html: c.name}}></span>
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
