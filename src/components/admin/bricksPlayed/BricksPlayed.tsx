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
import DPublishToggle from "./DPublishToggle";
import { getDateString } from "components/services/brickService";


interface TeachProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  isPublish: boolean;
  sortBy: PSortBy;
  dateFilter: PDateFilter;
  subjectCategory: ESubjectCategory;
  bricks: Brick[];
  selectedSubjects: Subject[];
  subjects: Subject[];
  finalBricks: Brick[];
  stemSubjects: Subject[];
  humanitySubjects: Subject[];
  otherSubjects: Subject[];
  generalSubject: Subject | null;
}

class BricksPlayedPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    this.state = {
      isPublish: false,
      sortBy: PSortBy.MostPlayed,
      dateFilter: PDateFilter.Today,
      subjectCategory: ESubjectCategory.Everything,
      bricks: [],
      subjects: [],
      selectedSubjects: [],
      finalBricks: [],
      stemSubjects: [],
      humanitySubjects: [],
      otherSubjects: [],
      generalSubject: null
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
    const bricks = await adminGetBrickAtemptStatistic(PDateFilter.Today);
    if (bricks) {
      const sortedBricks = this.sortBricks(PSortBy.MostPlayed, bricks);
      this.setState({ bricks: sortedBricks, finalBricks: sortedBricks });
    }

    const subjects = await getSubjects();
    if (subjects) {
      const generalSubject = subjects.find(s => s.name === GENERAL_SUBJECT) as Subject;

      const stemSubjectNames = ['Chemistry', 'Biology', 'Physics', 'Maths']
      const stemSubjects = this.fillSubjects(subjects, stemSubjectNames);

      const humanitySubjectNames = [
        'English Literature', 'Religion & Philosophy', 'History & Politics',
        'History of Art', 'Geography', 'Economics', 'Psychology', 'Sociology',
        'French', 'German', 'Chinese', 'Spanish', 'Classics', 'English Language', 'Criminology'
      ];
      const humanitySubjects = this.fillSubjects(subjects, humanitySubjectNames);

      const otherSubjectNames = [
        'Music', 'Design & Technology', "Drama & Theatre",
        "Computer Science", "Art & Design"
      ]
      const otherSubjects = this.fillSubjects(subjects, otherSubjectNames);

      this.setState({ subjects, stemSubjects, otherSubjects, humanitySubjects, generalSubject });
    }
  }

  async loadData(dateFilter: PDateFilter) {
    const bricks = await adminGetBrickAtemptStatistic(dateFilter);
    if (bricks) {
      const finalBricks = this.filterAndSort(this.state.isPublish, bricks, this.state.selectedSubjects, this.state.sortBy);
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

    const renderThirdColumn = (b: Brick) => {
      let subject = this.state.subjects.find(s => s.id === b.subjectId);
      let alternative = this.state.subjects.find(s => s.id === b.alternateSubjectId);
      if (subject) {
        return (
          <div className="third-column">{subject.name} {alternative ? alternative.name : ''}</div>
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
    let finalBricks:Brick[] = [];
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

  filterAndSort(isPublish: boolean, bricks: Brick[], selectedSubjects: Subject[], sortBy: PSortBy) {
    if (isPublish) {
      return this.filterBricksBySubjectsAndSortP(bricks, selectedSubjects, sortBy);
    } else {
      return this.filterBricksBySubjectsAndSort(bricks, selectedSubjects, sortBy);
    }
  }

  renderTable() {
    if (this.state.isPublish) {
      return (
        <div className="table">
          <div className="table-head bold">
            <div className="first-column">Date Published</div>
            <div className="second-column">Brick</div>
            <div className="third-column">Subjects</div>
          </div>
          {this.renderPublishedBody()}
        </div>
      );
    }
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
            isPublish={this.state.isPublish}
            sortBy={this.state.sortBy} setSort={sortBy => {
              let finalBricks = this.filterAndSort(this.state.isPublish, this.state.bricks, this.state.selectedSubjects, sortBy);
              this.setState({ sortBy, finalBricks });
            }}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => {
              this.loadData(dateFilter);
            }}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => {
              const finalBricks = this.filterAndSort(this.state.isPublish, this.state.bricks, selectedSubjects, this.state.sortBy);
              this.setState({ selectedSubjects, finalBricks });
            }}
            subjectCategory={this.state.subjectCategory} setSubjectCategory={subjectCategory => {
              let { selectedSubjects } = this.state;
              if (subjectCategory === ESubjectCategory.STEM) {
                selectedSubjects = [...this.state.stemSubjects];
              } else if (subjectCategory === ESubjectCategory.Humanities) {
                selectedSubjects = [...this.state.humanitySubjects];
              } else if (subjectCategory === ESubjectCategory.General) {
                if (this.state.generalSubject) {
                  selectedSubjects = [this.state.generalSubject];
                }
              } else if (subjectCategory === ESubjectCategory.Others) {
                selectedSubjects = [...this.state.otherSubjects];
              } else {
                selectedSubjects = [];
              }

              let finalBricks = this.filterAndSort(this.state.isPublish, this.state.bricks, selectedSubjects, this.state.sortBy);

              this.setState({ subjectCategory, finalBricks, selectedSubjects });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Bricks} history={this.props.history} />
            <div className="tab-content">
              <DPublishToggle isPublish={this.state.isPublish} onSwitch={isPublish => {
                let finalBricks = this.filterAndSort(isPublish, this.state.bricks, this.state.selectedSubjects, this.state.sortBy);
                this.setState({ isPublish, finalBricks });
              }} />
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
