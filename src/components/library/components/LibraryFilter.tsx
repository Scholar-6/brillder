import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { AssignmentBrick } from "model/assignment";
import { SubjectAItem } from "model/brick";
import { SortBy } from "../service/model";

import CustomFilterBox from "./CustomFilterBox";
import SubjectsListLibrary from "components/baseComponents/subjectsList/SubjectsListLibrary";

interface FilterProps {
  sortBy: SortBy;
  subjects: SubjectAItem[];
  isClearFilter: boolean;
  isClassClearFilter: boolean;
  assignments: AssignmentBrick[];

  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearSubjects(): void;
  filterBySubject(index: number): void;
}

interface FilterState {
  classFilterHeight: string;
  filterHeight: string;
}

class LibraryFilter extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      classFilterHeight: "auto",
      filterHeight: "auto",
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
          label="Filter"
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
