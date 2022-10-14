import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import './BricksPlayed.scss';
import { User } from "model/user";
import { Brick, Subject } from "model/brick";
import actions from 'redux/actions/requestFailed';
import { ReduxCombinedState } from "redux/reducers";
import { getSubjects } from "services/axios/subject";
import BricksTab, { BricksActiveTab } from "./BricksTab";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { GENERAL_SUBJECT } from "components/services/subject";
import { adminGetBrickAtemptStatistic } from "services/axios/brick";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import BricksPlayedSidebar, { ESubjectCategory, PDateFilter, PSortBy } from "./BricksPlayedSidebar";
import { getDateString } from "components/services/brickService";


interface TeachProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  sortBy: PSortBy;
  dateFilter: PDateFilter;
  subjectCategory: ESubjectCategory;
  bricks: Brick[];
  selectedSubjects: Subject[];
  subjects: Subject[];
  finalBricks: Brick[];
  artSubjects: Subject[];
  generalSubject: Subject[];
  mathSubjects: Subject[];
  humanitySubjects: Subject[];
  languageSubjects: Subject[];
  scienceSubjects: Subject[];
}

class BricksPlayedPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    this.state = {
      sortBy: PSortBy.MostPlayed,
      dateFilter: PDateFilter.Past24Hours,
      subjectCategory: ESubjectCategory.Everything,
      bricks: [],
      subjects: [],
      selectedSubjects: [],
      finalBricks: [],
      artSubjects: [],
      humanitySubjects: [],
      generalSubject: [],
      languageSubjects: [],
      mathSubjects: [],
      scienceSubjects: [],
    }
    this.loadInitPlayedData();
  }

  sortBricks(sortBy: PSortBy, bricks: Brick[]) {
    if (sortBy === PSortBy.MostPlayed) {
      return bricks.sort((a, b) => (a.attemptsCount > b.attemptsCount) ? -1 : 1);
    } else {
      return bricks.sort((a, b) => (a.attemptsCount > b.attemptsCount) ? 1 : -1);
    }
  }

  sortBricksP(sortBy: PSortBy, bricks: Brick[]) {
    if (sortBy === PSortBy.MostPlayed) {
      return bricks.sort((a, b) => {
        if (a.datePublished && b.datePublished) {
          return new Date(a.datePublished) > new Date(b.datePublished) ? -1 : 1;
        }
        return 1;
      });
    } else {
      return bricks.sort((a, b) => {
        if (a.datePublished && b.datePublished) {
          return new Date(a.datePublished) < new Date(b.datePublished) ? -1 : 1;
        }
        return -1;
      });
    }
  }

  fillSubjects(totalSubjects: Subject[], subjectNames: string[]) {
    const subjects: Subject[] = [];
    for (let sName of subjectNames) {
      const subject = totalSubjects.find(s => s.name === sName);
      if (subject) {
        subjects.push(subject);
      }
    }
    return subjects;
  }

  async loadInitPlayedData() {
    const bricks = await adminGetBrickAtemptStatistic(PDateFilter.Past24Hours);
    if (bricks) {
      const sortedBricks = this.sortBricks(PSortBy.MostPlayed, bricks);
      this.setState({ bricks: sortedBricks, finalBricks: sortedBricks });
    }

    const subjects = await getSubjects();
    if (subjects) {
      const generalSubject = this.fillSubjects(subjects, [GENERAL_SUBJECT]);

      const artSubjectNames = ['History of Art', "Art & Design", 'Design & Technology', "Drama & Theatre", 'Music'];
      const artSubjects = this.fillSubjects(subjects, artSubjectNames);

      const mathSubjectNames = ['Maths', "Computer Science"]
      const mathSubjects = this.fillSubjects(subjects, mathSubjectNames);

      const scienceSubjectNames = ['Chemistry', 'Biology', 'Physics'];
      const scienceSubjects = this.fillSubjects(subjects, scienceSubjectNames);

      const languageNames = ['French', 'German', 'Chinese', 'Spanish', 'English Language', 'Classics'];
      const languageSubjects = this.fillSubjects(subjects, languageNames);

      const humanitySubjectNames = [
        'English Literature', 'Religion & Philosophy', 'History & Politics',
        'Geography', 'Economics', 'Psychology', 'Sociology', 'Criminology'
      ];
      const humanitySubjects = this.fillSubjects(subjects, humanitySubjectNames);

      this.setState({ subjects, artSubjects, mathSubjects, languageSubjects, humanitySubjects, generalSubject, scienceSubjects });
    }
  }

  async loadData(dateFilter: PDateFilter) {
    const bricks = await adminGetBrickAtemptStatistic(dateFilter);
    if (bricks) {
      const finalBricks = this.filterAndSort(bricks, this.state.selectedSubjects, this.state.sortBy);
      this.setState({ bricks, dateFilter, finalBricks });
    }
  }

  renderBody() {
    const { finalBricks } = this.state;
    if (finalBricks.length == 0) {
      return <div>No Bricks</div>;
    }
    return <div className="table-body">
      {finalBricks.map(b => {
        return (<div className="table-row">
          <div className="first-column" dangerouslySetInnerHTML={{ __html: b.title }} />
          <div className="second-column">{b.attemptsCount}</div>
          <div className="third-column">{b.isCore ? <SpriteIcon name="globe" /> : <SpriteIcon name="key" />}</div>
        </div>);
      })}
    </div>
  }

  renderPublishedBody() {
    const { finalBricks } = this.state;
    if (finalBricks.length == 0) {
      return <div>No Bricks</div>;
    }

    const renderSubject = (subject?: Subject) => {
      if (subject) {
        return (
          <div className="flex-center subject-block">
            <div className="circle" style={{ background: subject.color }} />
            <div>{subject.name}</div>
          </div>
        );
      }
    }

    const renderThirdColumn = (b: Brick) => {
      let subject = this.state.subjects.find(s => s.id === b.subjectId);
      let alternative = this.state.subjects.find(s => s.id === b.alternateSubjectId);
      if (subject) {
        return (
          <div className="third-column">{renderSubject(subject)} {renderSubject(alternative)}</div>
        );
      }
      return <div className="third-column"></div>
    }

    return <div className="table-body">
      {finalBricks.map(b => {
        return (<div className="table-row">
          <div className="first-column">{b.datePublished ? getDateString(b.datePublished) : ''}</div>
          <div className="second-column" dangerouslySetInnerHTML={{ __html: b.title }} />
          {renderThirdColumn(b)}
        </div>);
      })}
    </div>
  }

  filterBricksBySubjectsAndSort(bricks: Brick[], selectedSubjects: Subject[], sortBy: PSortBy) {
    let finalBricks = [];
    if (selectedSubjects.length > 0) {
      for (let brick of bricks) {
        const found = selectedSubjects.find(s => s.id === brick.subjectId);
        if (found) {
          finalBricks.push(brick);
        }
      }
    } else {
      finalBricks = [...bricks];
    }
    finalBricks = this.sortBricks(sortBy, finalBricks);
    return finalBricks;
  }

  filterBricksBySubjectsAndSortP(bricks: Brick[], selectedSubjects: Subject[], sortBy: PSortBy) {
    let finalBricks: Brick[] = [];
    if (selectedSubjects.length > 0) {
      for (let brick of bricks) {
        const found = selectedSubjects.find(s => s.id === brick.subjectId);
        if (found) {
          finalBricks.push(brick);
        }
      }
    } else {
      finalBricks = [...bricks];
    }
    finalBricks = finalBricks.filter(b => b.datePublished);
    finalBricks = this.sortBricksP(sortBy, finalBricks);
    return finalBricks;
  }

  filterAndSort(bricks: Brick[], selectedSubjects: Subject[], sortBy: PSortBy) {
    return this.filterBricksBySubjectsAndSort(bricks, selectedSubjects, sortBy);
  }

  renderTable() {
    return (
      <div className="table">
        <div className="table-head bold">
          <div className="first-column">Brick</div>
          <div className="second-column">Times Played</div>
          <div className="third-column">Visibility</div>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  render() {
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={history}
          search={() => { }}
          searching={() => { }}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <BricksPlayedSidebar
            isLoaded={true}
            sortBy={this.state.sortBy} setSort={sortBy => {
              let finalBricks = this.filterAndSort(this.state.bricks, this.state.selectedSubjects, sortBy);
              this.setState({ sortBy, finalBricks });
            }}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => {
              this.loadData(dateFilter);
            }}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => {
              const finalBricks = this.filterAndSort(this.state.bricks, selectedSubjects, this.state.sortBy);
              this.setState({ selectedSubjects, finalBricks });
            }}
            subjectCategory={this.state.subjectCategory} setSubjectCategory={subjectCategory => {
              let { selectedSubjects } = this.state;
              if (subjectCategory === ESubjectCategory.Arts) {
                selectedSubjects = [...this.state.artSubjects];
              } else if (subjectCategory === ESubjectCategory.Humanities) {
                selectedSubjects = [...this.state.humanitySubjects];
              } else if (subjectCategory === ESubjectCategory.General) {
                selectedSubjects = [...this.state.generalSubject];
              } else if (subjectCategory === ESubjectCategory.Languages) {
                selectedSubjects = [...this.state.languageSubjects];
              } else if (subjectCategory === ESubjectCategory.Math) {
                selectedSubjects = [...this.state.mathSubjects];
              } else if (subjectCategory === ESubjectCategory.Science) {
                selectedSubjects = [...this.state.scienceSubjects];
              } else {
                selectedSubjects = [];
              }

              let finalBricks = this.filterAndSort(this.state.bricks, selectedSubjects, this.state.sortBy);

              this.setState({ subjectCategory, finalBricks, selectedSubjects });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Bricks} history={this.props.history} />
            <div className="tab-content">
              {this.renderTable()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(BricksPlayedPage);
