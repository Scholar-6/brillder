import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { AssignmentBrick } from "model/assignment";
import { Subject } from "model/brick";
import { SortBy } from "../service/model";

import { TeachClassroom } from "model/classroom";
import CustomFilterBox from "./CustomFilterBox";
import ClassroomList from "./ClassroomList";
import SubjectsListLibrary from "components/baseComponents/subjectsList/SubjectsListLibrary";

interface FilterProps {
  sortBy: SortBy;
  subjects: Subject[];
  isClearFilter: boolean;
  isClassClearFilter: boolean;
  assignments: AssignmentBrick[];
  classrooms: TeachClassroom[];

  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearSubjects(): void;
  filterBySubject(index: number): void;
  filterByClassroom(id: number): void;
}

interface FilterState {
  classFilterHeight: string;
  filterHeight: string;
  activeClassId: number;
}

class LibraryFilter extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      classFilterHeight: "auto",
      filterHeight: "auto",
      activeClassId: -1
    }
  }

  filterByClassroom(id: number) {
    if (this.state.activeClassId !== id) {
      this.setState({activeClassId: id});
      this.props.filterByClassroom(id);
    } else {
      this.setState({activeClassId: -1});
      this.props.filterByClassroom(-1);
    }
  }

  render() {    
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">Sort By</div>
          <RadioGroup
            className="sort-group"
            aria-label="SortBy"
            name="SortBy"
            value={this.props.sortBy}
            onChange={this.props.handleSortChange}
          >
            <Grid container direction="row">
              <Grid item xs={6}>
                <FormControlLabel
                  value={SortBy.Score}
                  style={{ marginRight: 0, width: "50%" }}
                  control={<Radio className="sortBy" />}
                  label="My Score"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  value={SortBy.Date}
                  style={{ marginRight: 0 }}
                  control={<Radio className="sortBy" />}
                  label="Date Added"
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </div>
        <CustomFilterBox
          label="Filter by Class"
          isClearFilter={this.props.isClassClearFilter}
          setHeight={classFilterHeight => this.setState({classFilterHeight})}
          clear={() => {}}
        />
        <ClassroomList
          activeId={this.state.activeClassId}
          filterHeight={this.state.classFilterHeight}
          classrooms={this.props.classrooms}
          filterByClassroom={this.filterByClassroom.bind(this)}
        />
        <CustomFilterBox
          label="Filter by Subject"
          isClearFilter={this.props.isClearFilter}
          setHeight={filterHeight => this.setState({filterHeight})}
          clear={this.props.clearSubjects}
        />
        <SubjectsListLibrary
          subjects={this.props.subjects}
          filterHeight={this.state.filterHeight}
          filterBySubject={this.props.filterBySubject}
        />
      </div>
    );
  }
}

export default LibraryFilter;
