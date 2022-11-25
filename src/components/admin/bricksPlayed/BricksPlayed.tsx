import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

import './BricksPlayed.scss';
import { playCover } from "components/play/routes";
import { User } from "model/user";
import { Brick, Subject } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import { getSubjects } from "services/axios/subject";
import BricksTab, { BricksActiveTab } from "./BricksTab";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { GENERAL_SUBJECT } from "components/services/subject";
import { adminGetBrickAtemptStatistic, getAdminBrickStatistic } from "services/axios/brick";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import BricksPlayedSidebar, { ESubjectCategory, PDateFilter } from "./BricksPlayedSidebar";
import { fileFormattedDate, getDateString } from "components/services/brickService";
import { stripHtml } from "components/build/questionService/ConvertService";
import ExportBtn from "../components/ExportBtn";
import { exportToCSV } from "services/excel";
import { exportToPDF } from "services/pdf";

enum SortBy {
  Published,
  Subjects,
  Title,
  Author,
  Played
}

interface TeachProps {
  history: History;
  searchString: string;
  user: User;
}

interface TeachState {
  isSearching: boolean;
  searchString: string;
  downloadClicked: boolean;
  isAscending: boolean;
  sortBy: SortBy;
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

  brickIdPlayers: number;
  brickAttempts: any[];
}

class BricksPlayedPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    this.state = {
      isSearching: false,
      searchString: '',
      downloadClicked: false,
      sortBy: SortBy.Played,
      isAscending: false,
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

      brickIdPlayers: -1,
      brickAttempts: []
    }
    this.loadInitPlayedData();
  }

  sortBricks(sortBy: SortBy, bricks: Brick[], isAscending: boolean) {
    if (sortBy === SortBy.Played) {
      if (isAscending) {
        return bricks.sort((a, b) => (a.attemptsCount < b.attemptsCount) ? -1 : 1);
      }
      return bricks.sort((a, b) => (a.attemptsCount > b.attemptsCount) ? -1 : 1);
    } else if (sortBy === SortBy.Published) {
      if (isAscending) {
        return bricks.sort((a, b) => {
          if (a.datePublished && b.datePublished) {
            var res = new Date(a.datePublished).getTime() < new Date(b.datePublished).getTime() ? -1 : 1;
            return res;
          }
          return 1;
        });
      }
      return bricks.sort((a, b) => {
        if (a.datePublished && b.datePublished) {
          var res = new Date(a.datePublished).getTime() > new Date(b.datePublished).getTime() ? -1 : 1;
          return res;
        }
        return -1;
      });
    } else if (sortBy === SortBy.Title) {
      if (isAscending) {
        return bricks.sort((a, b) => {
          let aT = stripHtml(a.title).toLocaleLowerCase();
          let bT = stripHtml(b.title).toLocaleLowerCase();
  
          return aT > bT ? -1 : 1;
        });
      }
      return bricks.sort((a, b) => {
        let aT = stripHtml(a.title).toLocaleLowerCase();
        let bT = stripHtml(b.title).toLocaleLowerCase();

        return aT < bT ? -1 : 1;
      });
    } else if (sortBy === SortBy.Author) {
      if (isAscending) {
        return bricks.sort((a, b) => {
          let aT = '';
          let bT = '';

          if (a.author && a.author.firstName) {
            aT = a.author.firstName.toLocaleLowerCase();
          }
          if (b.author && b.author.firstName) {
            bT = b.author.firstName.toLocaleLowerCase();
          }
          return aT > bT ? -1 : 1;
        });
      }
      return bricks.sort((a, b) => {
        let aT = '';
        let bT = '';

        if (a.author && a.author.firstName) {
          aT = a.author.firstName.toLocaleLowerCase();
        }
        if (b.author && b.author.firstName) {
          bT = b.author.firstName.toLocaleLowerCase();
        }
        return aT < bT ? -1 : 1;
      });
    } else {
      return bricks;
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
      bricks.map(b => {
        if (!b.datePublished) {
          b.datePublished = b.created;
        }
      })
      const sortedBricks = this.sortBricks(SortBy.Played, bricks, false);
      this.setState({ bricks: sortedBricks, finalBricks: sortedBricks });
    }

    const subjects = await getSubjects();
    if (subjects) {
      const generalSubject = this.fillSubjects(subjects, [GENERAL_SUBJECT]);

      const artSubjectNames = ['History of Art', "Art & Design", 'Design & Technology', "Drama & Theatre", 'Music'];
      const artSubjects = this.fillSubjects(subjects, artSubjectNames);

      const mathSubjectNames = ['Maths', "Computer Science"]
      const mathSubjects = this.fillSubjects(subjects, mathSubjectNames);

      const scienceSubjectNames = ['Chemistry', 'Biology, Health & Care, Health & Care', 'Physics'];
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
      const finalBricks = this.filterAndSort(bricks, this.state.selectedSubjects, this.state.sortBy, false);
      this.setState({ bricks, dateFilter, finalBricks });
    }
  }

  filterBricksBySubjectsAndSort(bricks: Brick[], selectedSubjects: Subject[], sortBy: SortBy, isAscending: boolean) {
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
    finalBricks = this.sortBricks(sortBy, finalBricks, isAscending);
    return finalBricks;
  }

  filterAndSort(bricks: Brick[], selectedSubjects: Subject[], sortBy: SortBy, isAscending: boolean) {
    return this.filterBricksBySubjectsAndSort(bricks, selectedSubjects, sortBy, isAscending);
  }

  search() {
    const { searchString } = this.state;

    const bricks = this.filterBricksBySubjectsAndSort(this.state.bricks, this.state.selectedSubjects, this.state.sortBy, false);

    const finalBricks = bricks.filter(b => {
      const title = b.title.toLocaleLowerCase();
      if (title.indexOf(searchString) >= 0) {
        return true;
      }
      return false;
    });

    setTimeout(() => {
      this.setState({ finalBricks, isSearching: true });
    })
  }

  async searching(searchString: string) {
    if (searchString.length === 0) {
      //await this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, searchString, this.state.orderBy, this.state.isAscending);
      this.setState({ ...this.state, searchString, isSearching: false });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  renderBody() {
    const { finalBricks } = this.state;
    if (finalBricks.length == 0) {
      return <div className="table-body">
        <div className="table-row">
          <div className="publish-column">No Bricks</div>
        </div>
      </div>;
    }

    const renderSubject = (subject?: Subject) => {
      if (subject) {
        return (
          <div className="subject-block">
            <div className="circle" style={{ background: subject.color }} />
            <div>{subject.name}</div>
          </div>
        );
      }
    }

    const renderSubjectColumn = (b: Brick) => {
      let subject = this.state.subjects.find(s => s.id === b.subjectId);
      let alternative = this.state.subjects.find(s => s.id === b.alternateSubjectId);
      if (subject) {
        return (
          <div className="subject-column">
            <div>{renderSubject(subject)}</div>
            <div>{renderSubject(alternative)}</div>
          </div>
        );
      }
      return <div className="subject-column"></div>
    }

    const renderDate = (b: Brick) => {
      if (b.datePublished) {
        return getDateString(b.datePublished);
      }
      if (b.created) {
        return getDateString(b.created);
      }
      return '';
    }

    return <div className="table-body">
      {finalBricks.map((b, i) => {
        return (<div className="table-row clickable" key={i} onClick={() => this.props.history.push(playCover(b))}>
          <div className="publish-column">{renderDate(b)}</div>
          {renderSubjectColumn(b)}
          <div className="first-column" dangerouslySetInnerHTML={{ __html: b.title }} />
          <div className="author-column">{b.author.firstName} {b.author.lastName}</div>
          <div className="second-column" onClick={async (e) => {
            e.stopPropagation();
            console.log(b);
            const data = await getAdminBrickStatistic(b.id);
            if (data) {
              this.setState({ brickIdPlayers: b.id, brickAttempts: data.attempts })
            }
          }}>
            {b.attemptsCount}
            {this.state.brickIdPlayers > 0 && this.state.brickIdPlayers === b.id &&
              <div className="players-popup-d3423">
                <div>
                  <SpriteIcon name="cancel-custom" className="close-btn" onClick={e => {
                    e.stopPropagation();
                    this.setState({ brickIdPlayers: -1, brickAttempts: [] });
                  }} />
                  {this.state.brickAttempts.map(a => {
                    if (a.student) {
                      const { student } = a;
                      return student.firstName + ' ' + student.lastName;
                    }
                    return '';
                  })}
                </div>
              </div>}
          </div>
          <div className="third-column">{b.isCore ? <SpriteIcon name="globe" /> : <SpriteIcon name="key" />}</div>
          <div className="sponsor-column">
            {b.sponsorName ? b.sponsorName : 'Scholar6'}
          </div>
        </div>);
      })}
    </div>
  }

  renderTable() {
    return (
      <div className="table">
        <div className="table-head bold">
          <div className="publish-column header">
            <div>Published</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
              let isAscending = !this.state.isAscending;
              const finalBricks = this.filterAndSort(this.state.bricks, this.state.selectedSubjects, SortBy.Published, isAscending)
              this.setState({ sortBy: SortBy.Published, finalBricks, isAscending });
            }} /></div>
          </div>
          <div className="subject-column header">
            <div>Subjects</div>
          </div>
          <div className="first-column header">
            <div>Title</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
              let isAscending = !this.state.isAscending;
              const finalBricks = this.filterAndSort(this.state.bricks, this.state.selectedSubjects, SortBy.Title, isAscending)
              this.setState({ sortBy: SortBy.Title, finalBricks, isAscending });
            }} /></div>
          </div>
          <div className="author-column header">
            <div>Author</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
              let isAscending = !this.state.isAscending;
              const finalBricks = this.filterAndSort(this.state.bricks, this.state.selectedSubjects, SortBy.Author, isAscending)
              this.setState({ sortBy: SortBy.Author, finalBricks, isAscending });
            }} /></div>
          </div>
          <div className="second-column header">
            <div>Played</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
              let isAscending = !this.state.isAscending;
              const finalBricks = this.filterAndSort(this.state.bricks, this.state.selectedSubjects, SortBy.Played, isAscending)
              this.setState({ sortBy: SortBy.Played, finalBricks, isAscending });
            }} /></div>
          </div>
          <div className="third-column header">Visibility</div>
          <div className="sponsor-column header">Sponsor</div>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  selectCategorySubjects(categorySubjects: Subject[]) {
    this.state.subjects.map(s => s.checked = false);
    for (let cs of categorySubjects) {
      const subject = this.state.subjects.find(s => s.id === cs.id);
      if (subject) {
        subject.checked = true;
      }
    }
    this.setState({ subjects: this.state.subjects });
  }

  render() {
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page only-bricks-played-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={this.props.history}
          search={() => this.search()}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <BricksPlayedSidebar
            isLoaded={true}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => {
              this.loadData(dateFilter);
            }}
            subjects={this.state.subjects}
            selectSubject={selectedSubject => {
              const subject = this.state.subjects.find(s => s.id === selectedSubject.id);
              if (subject) {
                subject.checked = !subject?.checked;
                const selectedSubjects = this.state.subjects.filter(s => s.checked);
                const finalBricks = this.filterAndSort(this.state.bricks, selectedSubjects, this.state.sortBy, this.state.isAscending);
                this.setState({ selectedSubjects, finalBricks });
              }
            }}
            subjectCategory={this.state.subjectCategory} setSubjectCategory={subjectCategory => {
              console.log(55, subjectCategory);
              let { selectedSubjects } = this.state;
              if (subjectCategory === ESubjectCategory.Arts) {
                this.selectCategorySubjects(this.state.artSubjects);
                selectedSubjects = [...this.state.artSubjects];
              } else if (subjectCategory === ESubjectCategory.Humanities) {
                this.selectCategorySubjects(this.state.humanitySubjects);
                selectedSubjects = [...this.state.humanitySubjects];
              } else if (subjectCategory === ESubjectCategory.General) {
                this.selectCategorySubjects(this.state.generalSubject);
                selectedSubjects = [...this.state.generalSubject];
              } else if (subjectCategory === ESubjectCategory.Languages) {
                this.selectCategorySubjects(this.state.generalSubject);
                selectedSubjects = [...this.state.languageSubjects];
              } else if (subjectCategory === ESubjectCategory.Math) {
                this.selectCategorySubjects(this.state.generalSubject);
                selectedSubjects = [...this.state.mathSubjects];
              } else if (subjectCategory === ESubjectCategory.Science) {
                this.selectCategorySubjects(this.state.generalSubject);
                selectedSubjects = [...this.state.scienceSubjects];
              } else if (subjectCategory === ESubjectCategory.Everything) {
                this.selectCategorySubjects([]);
                selectedSubjects = [];
              } else {
                this.selectCategorySubjects(this.state.generalSubject);
                selectedSubjects = [];
              }

              const finalBricks = this.filterAndSort(this.state.bricks, selectedSubjects, this.state.sortBy, this.state.isAscending);
              this.setState({ subjectCategory, finalBricks, selectedSubjects });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Bricks} history={this.props.history} />
            <div className="tab-content">
              <ExportBtn onClick={() => this.setState({ downloadClicked: true })} />
              {this.state.downloadClicked && <Dialog className="sort-dialog-classes export-dialog-ew35" open={this.state.downloadClicked} onClose={() => this.setState({ downloadClicked: false })}>
                <div className="popup-3rfw bold">
                  <div className="btn-sort" onClick={() => {
                    let data: any[] = [];

                    for (const brick of this.state.finalBricks) {
                      const subject = this.state.subjects.find(s => s.id === brick.subjectId);

                      data.push({
                        Published: brick.datePublished?.toString(),
                        Subjects: subject?.name,
                        Title: stripHtml(brick.title),
                        Author: brick.author.firstName + ' ' + brick.author.lastName,
                        Played: brick.attemptsCount,
                        'Public?': brick.isCore ? "yes" : "no",
                        Sponsor: brick.sponsorName ? brick.sponsorName : 'Scholar6'
                      });
                    }

                    exportToCSV(data, "Brillder data " + fileFormattedDate(new Date().toString()));

                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to Excel</div>
                    <SpriteIcon name="excel-icon" />
                  </div>
                  <div className="btn-sort" onClick={() => {
                    exportToPDF(
                      [['Published', 'Subjects', 'Title', 'Author', 'Played', 'Public?', 'Sponsor']],
                      this.state.finalBricks.map(b => {
                        const subject = this.state.subjects.find(s => s.id === b.subjectId);
                        return [b.datePublished ? b.datePublished : '', subject ? subject.name : '', stripHtml(b.title), b.author.firstName + ' ' + b.author.lastName, b.attemptsCount, b.isCore ? 'yes' : 'no', b.sponsorName ? b.sponsorName : 'Scholar6']
                      }),
                      `Brillder data ${fileFormattedDate(new Date().toString())}.pdf`
                    );
                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to PDF</div>
                    <img alt="brill" src="/images/PDF_icon.png" />
                  </div>
                </div>
              </Dialog>}
              {this.renderTable()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(BricksPlayedPage);
