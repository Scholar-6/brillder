
import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { User } from "model/user";

import SubjectsList from "components/baseComponents/subjectsList/SubjectsList";
import UnauthorizedSidebar from "./components/UnauthrizedSidebar";

export enum SortBy {
  None,
  Date,
  Popularity,
}

interface FilterProps {
  sortBy: SortBy;
  subjects: any[];
  isClearFilter: any;
  user: User;

  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearSubjects(): void;
  filterBySubject(index: number): void;
}

interface FilterState {
  filterExpanded: boolean;
  filterHeight: any;
}

class ViewAllFilterComponent extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      filterHeight: "auto",
      filterExpanded: true
    }
  }
  hideFilter() {
    this.setState({ ...this.state, filterExpanded: false, filterHeight: "0" });
  }
  expandFilter() {
    this.setState({
      ...this.state,
      filterExpanded: true,
      filterHeight: "auto",
    });
  }
  render() {
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        {this.props.user ?
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
                    value={SortBy.Popularity}
                    style={{ marginRight: 0, width: "50%" }}
                    control={<Radio className="sortBy" />}
                    label="Popularity"
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
          <div className="filter-header">
            <span>Filter</span>
            <button
              className={
                "btn-transparent filter-icon " +
                (this.state.filterExpanded
                  ? this.props.isClearFilter
                    ? "arrow-cancel"
                    : "arrow-down"
                  : "arrow-up")
              }
              onClick={() => {
                this.state.filterExpanded
                  ? this.props.isClearFilter
                    ? this.props.clearSubjects()
                    : this.hideFilter()
                  : this.expandFilter();
              }}
            ></button>
          </div>
          <SubjectsList
            subjects={this.props.subjects}
            filterHeight={this.state.filterHeight}
            filterBySubject={this.props.filterBySubject}
          />
        </div>
        : <UnauthorizedSidebar />
        }
      </Grid>
    );
  }
}

export default ViewAllFilterComponent;
