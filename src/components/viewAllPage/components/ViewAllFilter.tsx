import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { User } from "model/user";

import SubjectsListV3 from "components/baseComponents/subjectsList/SubjectsListV3";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import {
  AcademicLevel,
  AcademicLevelLabels,
  SubjectGroup,
  SubjectGroupNames,
} from "model/brick";
import HoverHelp from "components/baseComponents/hoverHelp/HoverHelp";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import SubjectsListV4 from "components/baseComponents/subjectsList/SubjectsListV4";

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

  subjectGroup?: SubjectGroup | null;

  isAllCategory: boolean;

  isAllSubjects: boolean;
  setAllSubjects(value: boolean): void;
  selectUserSubjects(value: boolean): void;

  openAddSubjectPopup(): void;

  isViewAll: boolean;
  selectAllSubjects(isViewAll: boolean): void;

  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearSubjects(): void;
  filterBySubject(id: number): void;

  levels: AcademicLevel[];
  filterByLevel(level: AcademicLevel[]): void;
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
    };
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

  filterByLevel(level: AcademicLevel) {
    const { levels } = this.props;
    const found = levels.find((l) => l == level);
    if (found) {
      const newLevels = levels.filter((l) => l !== level);
      this.props.filterByLevel(newLevels);
    } else {
      levels.push(level);
      this.props.filterByLevel(levels);
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

  renderCategoryLabelBox() {
    const { subjectGroup } = this.props;
    let name = "Subjects";

    if (subjectGroup) {
      name = SubjectGroupNames[subjectGroup];
    }
    return (
      <div className="filter-header subject-category-name">
        <span>{name}</span>
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
          className={`${!isAllSubjects
              ? "toggle-button my-subjects active"
              : "toggle-button my-subjects not-active"
            }`}
          onClick={() => {
            if (isAllSubjects) {
              this.props.setAllSubjects(false);
            }
          }}
        >
          <div className="icon-container">
            <SpriteIcon name="user" />
          </div>
          <div className="text-container">My Subjects</div>
        </div>
        <div
          className={`${this.props.isAllSubjects
              ? "toggle-button all-subjects active"
              : "toggle-button all-subjects not-active"
            }`}
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

  renderAcademicLevel(loopLevel: AcademicLevel) {
    const found = this.props.levels.find((l) => l == loopLevel);
    return (
      <FormControlLabel
        value={SortBy.Popularity}
        style={{ marginRight: 0, width: "50%" }}
        control={
          <Radio
            className="sortBy"
            checked={!!found}
            onClick={() => this.filterByLevel(loopLevel)}
          />
        }
        label={`Level ${AcademicLevelLabels[loopLevel]}`}
      />
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
            <div
              className="filter-container sort-by-box view-all-sort-box"
              style={{ height: "6.5vw" }}
            >
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
              {this.renderAcademicLevel(AcademicLevel.First)}
              {this.renderAcademicLevel(AcademicLevel.Second)}
              {this.renderAcademicLevel(AcademicLevel.Third)}
              {this.renderAcademicLevel(AcademicLevel.Fourth)}
              <div className="absolute-difficult-help">
                <HoverHelp>
                  <div className="flex-content">
                    <div>
                      Brillder focusses on universal concepts and topics, not
                      specific exam courses.
                    </div>
                    <br />
                    <div>LEVELS:</div>
                    <div className="container">
                      <div className="white-circle">I</div>
                      <div className="l-text">
                        <div>Foundation</div>
                        <div className="regular">
                          For 15-16 yr-olds, equivalent to GCSE / IB Middle
                          Years / High School Diploma
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="container">
                      <div className="white-circle">II</div>
                      <div className="and-sign">&</div>
                      <div className="white-circle">III</div>
                      <div className="l-text smaller">
                        <div>Core</div>
                        <div className="regular">
                          For 17-18 yr-olds, equivalent to A-level / IB / High
                          School Honors
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="container">
                      <div className="white-circle">IV</div>
                      <div className="l-text">
                        <div>Extension</div>
                        <div className="regular">
                          College / Undergraduate level, to challenge Oxbridge
                          (UK) or Advanced Placement (US) students
                        </div>
                      </div>
                    </div>
                  </div>
                </HoverHelp>
              </div>
            </div>
            {this.props.user
              ? this.renderSubjectLabelBox()
              : this.renderCategoryLabelBox()}
            {this.renderSubjectsToggle()}
            <div className="scroll-buttons">
              {this.props.user && (
                <div className="radio-container flex-center" onClick={() => this.props.selectUserSubjects(!this.props.isViewAll)}>
                  <RadioButton checked={this.props.isViewAll} name="" color="#001c58" />
                  All
                </div>
              )}
              <SpriteIcon
                name="arrow-up"
                className={`${!this.state.canScroll ? "disabled" : ""}`}
                onClick={this.scrollUp.bind(this)}
              />
              <SpriteIcon
                name="arrow-down"
                className={`${!this.state.canScroll ? "disabled" : ""}`}
                onClick={this.scrollDown.bind(this)}
              />
              {this.props.isClearFilter && (
                <button
                  className="btn-transparent filter-icon arrow-cancel"
                  onClick={() =>
                    this.props.selectAllSubjects(!this.props.isViewAll)
                  }
                ></button>
              )}
            </div>
          </div>
          <div
            className="sort-box subject-scrollable"
            ref={this.state.scrollArea}
          >
            {this.props.user ?
              <SubjectsListV3
                user={this.props.user}
                isPublic={this.props.isCore}
                subjects={subjects}
                isAllSubjects={isAllSubjects}
                isAll={this.props.isViewAll}
                isSelected={this.props.isClearFilter}
                filterHeight={this.state.filterHeight}
                subjectGroup={this.props.subjectGroup}
                openSubjectPopup={this.props.openAddSubjectPopup}
                selectAll={(isAll) => this.props.selectAllSubjects(!isAll)}
                filterBySubject={this.props.filterBySubject}
              />
              : <SubjectsListV4
                user={this.props.user}
                subjects={subjects}
                isAllCategory={this.props.isAllCategory}
                isAll={this.props.isViewAll}
                isSelected={this.props.isClearFilter}
                filterHeight={this.state.filterHeight}
                subjectGroup={this.props.subjectGroup}
                openSubjectPopup={this.props.openAddSubjectPopup}
                selectAll={(isAll) => this.props.selectAllSubjects(!isAll)}
                filterBySubject={this.props.filterBySubject}
              />
            }
          </div>
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default ViewAllFilterComponent;
