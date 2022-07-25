import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { User } from "model/user";

import SubjectsListV3 from "components/baseComponents/subjectsList/SubjectsListV3";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import {
  AcademicLevel,
  AcademicLevelLabels,
  BrickLengthEnum,
  SubjectGroup,
  SubjectGroupNames,
} from "model/brick";
import HoverHelp from "components/baseComponents/hoverHelp/HoverHelp";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import SubjectsListV4 from "components/baseComponents/subjectsList/SubjectsListV4";
import LevelHelpContent from "components/baseComponents/hoverHelp/LevelHelpContent";

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

  filterCompetition: boolean;
  filterByCompetition(): void;

  openAddSubjectPopup(): void;

  isViewAll: boolean;
  selectAllSubjects(isViewAll: boolean): void;

  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearSubjects(): void;
  filterBySubject(id: number): void;

  levels: AcademicLevel[];
  filterByLevel(level: AcademicLevel[]): void;

  lengths: BrickLengthEnum[];
  filterByLength(length: BrickLengthEnum[]): void;
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

    const found = levels.find((l) => l === level);
    if (found) {
      const newLevels = levels.filter((l) => l !== level);
      this.props.filterByLevel(newLevels);
    } else {
      levels.push(level);
      this.props.filterByLevel(levels);
    }
  }

  filterByLength(length: BrickLengthEnum) {
    const { lengths } = this.props;

    const found = lengths.find((l) => l === length);
    if (found) {
      const newLengths = lengths.filter((l) => l !== length);
      this.props.filterByLength(newLengths);
    } else {
      lengths.push(length);
      this.props.filterByLength(lengths);
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

  renderAcademicLevel(loopLevel: AcademicLevel, length: BrickLengthEnum) {
    const found = this.props.levels.find(l => l === loopLevel);
    const found2 = this.props.lengths.find(l => l === length);

    return (
      <div className="">
        <FormControlLabel
          value={SortBy.Popularity}
          style={{ marginRight: 0, width: "28%" }}
          control={
            <Radio
              className="sortBy"
              checked={!!found}
              onClick={() => this.filterByLevel(loopLevel)}
            />
          }
          label={`Level ${AcademicLevelLabels[loopLevel]}`}
        />
        <div>
        <FormControlLabel
          value={SortBy.Popularity}
          style={{ marginRight: 0, width: "28%" }}
          control={
            <Radio
              className="sortBy"
              checked={!!found2}
              onClick={() => this.filterByLength(length)}
            />
          }
          label={`${length} mins`}
        />
        </div>
      </div>
    );
  }

  
  renderCompetitionFilter() {
    return (
      <div className="flex-center competition-filter-d32">
        <FormControlLabel
          value={SortBy.Popularity}
          style={{ marginRight: 0 }}
          control={
            <Radio
              className="sortBy"
              checked={this.props.filterCompetition}
              onClick={() => this.props.filterByCompetition()}
            />
          }
          label={`Competition Arena`}
        />
        <div><SpriteIcon className="star-d32" name="star"/></div>
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
    }

    subjects = subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);

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
            <div className="competition-filter-box">
              {this.renderCompetitionFilter()}
            </div>
            <div className="sort-box level-filter-box less-top-padding-s3">
              {this.renderAcademicLevel(AcademicLevel.First, BrickLengthEnum.S20min)}
              {this.renderAcademicLevel(AcademicLevel.Second, BrickLengthEnum.S40min)}
              {this.renderAcademicLevel(AcademicLevel.Third, BrickLengthEnum.S60min)}
              <div className="absolute-difficult-help">
                <HoverHelp>
                  <LevelHelpContent />
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
            {!this.props.isAllCategory ?
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
