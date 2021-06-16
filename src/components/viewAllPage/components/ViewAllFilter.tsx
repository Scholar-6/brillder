
import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { User } from "model/user";

import SubjectsListV3 from "components/baseComponents/subjectsList/SubjectsListV3";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import AddSubjectDialog from "components/baseComponents/dialogs/AddSubjectDialog";
import { AcademicLevelLabels } from "model/brick";

export enum SortBy {
  None,
  Date,
  Popularity,
}

interface FilterProps {
  sortBy: SortBy;
  subjects: any[];
  userSubjects: any[];
  isClearFilter: any;
  isCore: boolean;
  user: User;

  isAllSubjects: boolean;
  setAllSubjects(value: boolean): void;

  isViewAll: boolean;
  selectAllSubjects(isViewAll: boolean): void;

  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearSubjects(): void;
  filterBySubject(id: number): void;
  filterByLevel(level: number): void;
}

interface FilterState {
  isSubjectPopupOpen: boolean;
  canScroll: boolean;
  scrollArea: React.RefObject<any>;
  filterExpanded: boolean;
  filterHeight: any;
}

class ViewAllFilterComponent extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      isSubjectPopupOpen: false,
      canScroll: false,
      scrollArea: React.createRef(),
      filterHeight: "auto",
      filterExpanded: true,
    }
  }

  componentDidUpdate() {
    this.checkScroll();
  }

  componentDidMount() {
    this.checkScroll();
  }

  hideFilter() {
    this.setState({ ...this.state, filterExpanded: false, filterHeight: "0" });
  }

  checkScroll() {
    const { canScroll } = this.state;
    const { current } = this.state.scrollArea;
    if (current) {
      if (current.scrollHeight > current.clientHeight) {
        if (!canScroll) {
          this.setState({ canScroll: true });
        }
      } else {
        if (canScroll) {
          this.setState({ canScroll: false });
        }
      }
    }
  }

  scrollUp() {
    try {
      const { current } = this.state.scrollArea;
      if (current) {
        current.scrollBy(0, -window.screen.height / 30);
      }
    } catch { }
  }

  scrollDown() {
    try {
      const { current } = this.state.scrollArea;
      if (current) {
        current.scrollBy(0, window.screen.height / 30);
      }
    } catch { }
  }

  expandFilter() {
    this.setState({
      ...this.state,
      filterExpanded: true,
      filterHeight: "auto",
    });
  }

  renderFilterLabelBox() {
    return (
      <div className="filter-header">
        <span>Filter</span>
      </div>
    );
  }

  renderSubjectLabelBox() {
    return (
      <div className="filter-header">
        <span>Subjects</span>
      </div>
    );
  }

  renderSubjectsToggle() {
    const { isAllSubjects } = this.props;
    if (!this.props.user) {
      return "";
    }
    return (
      <div className="subjects-toggle">
        <div
          className={`${!isAllSubjects ? 'toggle-button my-subjects active' : 'toggle-button my-subjects not-active'}`}
          onClick={() => {
            if (isAllSubjects) {
              this.props.setAllSubjects(false);
            }
          }}
        >
          <div className="icon-container">
            <SpriteIcon name="user" />
          </div>
          <div className="text-container">
            My Subjects
          </div>
        </div>
        <div
          className={`${this.props.isAllSubjects ? 'toggle-button all-subjects active' : 'toggle-button all-subjects not-active'}`}
          onClick={() => {
            if (!isAllSubjects) {
              this.props.setAllSubjects(true);
            }
          }}
        >
          All Subjects
        </div>
      </div>
    );
  }

  render() {
    let { subjects, isAllSubjects } = this.props;
    if (!isAllSubjects) {
      subjects = [];
      for (let subject of this.props.userSubjects) {
        for (let s of this.props.subjects) {
          if (s.id === subject.id) {
            subjects.push(s);
          }
        }
      }
      subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
    }
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        <div className="flex-height-box">
          <div className="sort-box">
            <div className="filter-container sort-by-box view-all-sort-box" style={{ height: '6.5vw' }}>
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
            {this.renderFilterLabelBox()}
            <div className="sort-box level-filter-box">
              <FormControlLabel
                value={SortBy.Popularity}
                style={{ marginRight: 0, width: "50%" }}
                control={<Radio className="sortBy" />}
                label={`Level ${AcademicLevelLabels[1]}`}
              />
              <FormControlLabel
                value={SortBy.Popularity}
                style={{ marginRight: 0, width: "50%" }}
                control={<Radio className="sortBy" />}
                label={`Level ${AcademicLevelLabels[2]}`}
              />
              <FormControlLabel
                value={SortBy.Popularity}
                style={{ marginRight: 0, width: "50%" }}
                control={<Radio className="sortBy" />}
                label={`Level ${AcademicLevelLabels[3]}`}
              />
              <FormControlLabel
                value={SortBy.Popularity}
                style={{ marginRight: 0, width: "50%" }}
                control={<Radio className="sortBy" />}
                label={`Level ${AcademicLevelLabels[4]}`}
              />
            </div>
            {this.renderSubjectLabelBox()}
            {this.renderSubjectsToggle()}
            <div className="scroll-buttons">
              <FormControlLabel
                className="radio-container"
                checked={this.props.isViewAll}
                control={<Radio onClick={() => this.props.selectAllSubjects(!this.props.isViewAll)} />}
                label="All" />
              <SpriteIcon name="arrow-up" className={`${!this.state.canScroll ? 'disabled' : ''}`} onClick={this.scrollUp.bind(this)} />
              <SpriteIcon name="arrow-down" className={`${!this.state.canScroll ? 'disabled' : ''}`} onClick={this.scrollDown.bind(this)} />
              {this.props.isClearFilter &&
                <button
                  className="btn-transparent filter-icon arrow-cancel"
                  onClick={() => this.props.selectAllSubjects(!this.props.isViewAll)}
                ></button>}
            </div>
          </div>
          <div className="sort-box subject-scrollable" ref={this.state.scrollArea}>
            <SubjectsListV3
              isPublic={this.props.isCore}
              subjects={subjects}
              isAllSubjects={isAllSubjects}
              isAll={this.props.isViewAll}
              isSelected={this.props.isClearFilter}
              filterHeight={this.state.filterHeight}
              openSubjectPopup={() => this.setState({ isSubjectPopupOpen: true })}
              filterBySubject={this.props.filterBySubject}
            />
          </div>
        </div>
        <div className="sidebar-footer" />
        <AddSubjectDialog
          isOpen={this.state.isSubjectPopupOpen}
          success={subject => { }}
          close={() => this.setState({ isSubjectPopupOpen: false })}
        />
      </Grid>
    );
  }
}

export default ViewAllFilterComponent;
