import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import queryString from 'query-string';
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
import { AdminBricksFilters, GetAdminBricksFilters, SetAdminBricksFilters } from "localStorage/admin";
import BrickPlayedPopup from "./BrickPlayedPopup";

enum SortBy {
  Published,
  Subjects,
  Title,
  Author,
  Played,
  Modified
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

  selectedBrick: Brick | null;

  brickAttempts: any[];
  assignments: any[];
}

class BricksPlayedPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    let dateFilter = PDateFilter.Past24Hours;
    let subjectCategory = ESubjectCategory.Everything;

    const filters = GetAdminBricksFilters();
    if (filters) {
      dateFilter = filters.dateFilter;
      subjectCategory = filters.subjectCategory;
    }

    const values = queryString.parse(props.history.location.search);
    if (values.dateFilter) {
      dateFilter = parseInt(values.dateFilter as string);
    }

    let sortBy = SortBy.Played;
    if (values.sortBy) {
      sortBy = parseInt(values.sortBy as string);
    }

    if (values.sortBy && values.dateFilter) {
      subjectCategory = ESubjectCategory.Everything;
      SetAdminBricksFilters({
        dateFilter: dateFilter,
        subjectCategory: subjectCategory,
        selectedSubjectIds: []
      });
    }

    this.state = {
      isSearching: false,
      searchString: '',
      downloadClicked: false,
      sortBy,
      isAscending: false,
      dateFilter,
      subjectCategory,
      selectedSubjects: [],
      bricks: [],
      subjects: [],
      finalBricks: [],
      artSubjects: [],
      humanitySubjects: [],
      generalSubject: [],
      languageSubjects: [],
      mathSubjects: [],
      scienceSubjects: [],

      selectedBrick: null,
      brickAttempts: [],
      assignments: []
    }
    this.loadInitPlayedData(filters || {
      dateFilter,
      subjectCategory,
      selectedSubjectIds: []
    });
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
    } else if (sortBy === SortBy.Modified) {
      if (isAscending) {
        return bricks.sort((a, b) => {
          if (a.updated && b.updated) {
            var res = new Date(a.updated).getTime() < new Date(b.updated).getTime() ? -1 : 1;
            return res;
          }
          return 1;
        });
      }
      return bricks.sort((a, b) => {
        if (a.updated && b.updated) {
          var res = new Date(a.updated).getTime() > new Date(b.updated).getTime() ? -1 : 1;
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

          if (a.author && a.author.lastName) {
            aT = a.author.lastName.toLocaleLowerCase();
          }
          if (b.author && b.author.lastName) {
            bT = b.author.lastName.toLocaleLowerCase();
          }

          if (aT === bT) {
            let aFT = '';
            let bFT = '';

            if (a.author && a.author.firstName) {
              aFT = a.author.firstName.toLocaleLowerCase();
            }
            if (b.author && b.author.firstName) {
              bFT = b.author.firstName.toLocaleLowerCase();
            }

            if (aFT === bFT) {
              if (a.datePublished && b.datePublished) {
                return a.datePublished < b.datePublished ? -1 : 1;
              }
            }

            return aFT > bFT ? -1 : 1;
          }

          return aT > bT ? -1 : 1;
        });
      }
      return bricks.sort((a, b) => {
        let aT = '';
        let bT = '';

        if (a.author && a.author.lastName) {
          aT = a.author.lastName.toLocaleLowerCase();
        }
        if (b.author && b.author.lastName) {
          bT = b.author.lastName.toLocaleLowerCase();
        }

        if (aT === bT) {
          let aFT = '';
          let bFT = '';

          if (a.author && a.author.firstName) {
            aFT = a.author.firstName.toLocaleLowerCase();
          }
          if (b.author && b.author.firstName) {
            bFT = b.author.firstName.toLocaleLowerCase();
          }

          if (aFT === bFT) {
            if (a.datePublished && b.datePublished) {
              return a.datePublished > b.datePublished ? -1 : 1;
            }
          }

          return aFT < bFT ? -1 : 1;
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

  sortSubjectsBasedonBricks(subjects: Subject[], bricks: Brick[]) {
    subjects.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
    subjects.map(s => s.count = 0);
    for (let brick of bricks) {
      const subject = subjects.find(s => s.id === brick.subjectId);
      if (subject) {
        subject.count += 1;
      }
      const alternativeSubject = subjects.find(s => s.id === brick.alternateSubjectId);
      if (alternativeSubject) {
        alternativeSubject.count += 1;
      }
    }

    return subjects;
  }

  async loadInitPlayedData(filters: AdminBricksFilters) {
    const bricks = await adminGetBrickAtemptStatistic(filters.dateFilter);
    if (bricks) {
      bricks.map(b => {
        if (!b.datePublished) {
          b.datePublished = b.created;
        }
      });
      const sortedBricks = this.sortBricks(SortBy.Played, bricks, false);


      this.setState({ bricks: sortedBricks, finalBricks: sortedBricks });

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

        const finalSubjects = this.sortSubjectsBasedonBricks(subjects, sortedBricks);

        this.setState({
          subjects: finalSubjects, artSubjects, mathSubjects,
          languageSubjects, humanitySubjects, generalSubject, scienceSubjects
        });


        if (filters.subjectCategory) {
          this.setSubjectCategory(filters.subjectCategory);
        } else if (filters.selectedSubjectIds && filters.selectedSubjectIds.length > 0) {
          this.checkSubjects(finalSubjects, filters.selectedSubjectIds);
        }
      }
    }
  }

  async loadData(dateFilter: PDateFilter) {
    const bricks = await adminGetBrickAtemptStatistic(dateFilter);
    if (bricks) {
      const finalBricks = this.filterAndSort(bricks, this.state.selectedSubjects, this.state.sortBy, false);
      const subjects = this.sortSubjectsBasedonBricks(this.state.subjects, finalBricks);
      this.setState({ bricks, subjects, dateFilter, finalBricks });
    }
  }

  filterBricksBySubjectsAndSort(
    bricks: Brick[], selectedSubjects: Subject[], sortBy: SortBy, isAscending: boolean
  ) {
    let finalBricks: Brick[] = [];
    if (selectedSubjects.length > 0) {
      for (let brick of bricks) {
        const found = selectedSubjects.find(s => s.id === brick.subjectId);
        if (found) {
          finalBricks.push(brick);
        }
        const foundAlternative = selectedSubjects.find(s => s.id === brick.alternateSubjectId);
        if (foundAlternative) {
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

  search(searchRString?: string) {
    let { searchString } = this.state;

    if (searchRString) {
      searchString = searchRString;
    }

    const bricks = this.filterBricksBySubjectsAndSort(
      this.state.bricks, this.state.selectedSubjects, this.state.sortBy, false
    );

    const finalBricks = bricks.filter(b => {
      const title = b.title.toLocaleLowerCase();
      if (title.indexOf(searchString) >= 0) {
        return true;
      }
      if (b.author) {
        const { author } = b;
        if (author.firstName) {
          if (author.firstName.toLocaleLowerCase().indexOf(searchString) >= 0) {
            return true;
          }
        }

        if (author.lastName) {
          if (author.lastName.toLocaleLowerCase().indexOf(searchString) >= 0) {
            return true;
          }
        }
      }
      return false;
    });

    setTimeout(() => {
      this.setState({ finalBricks, isSearching: true });
    })
  }

  async searching(searchString: string) {
    if (searchString.length === 0) {
      const finalBricks = this.filterAndSort(
        this.state.bricks, this.state.selectedSubjects, this.state.sortBy, this.state.isAscending
      );
      this.setState({ ...this.state, searchString, isSearching: false, finalBricks });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  renderDate(b: Brick) {
    if (b.datePublished) {
      return getDateString(b.datePublished);
    }
    return getDateString("2022-01-01");
  }

  renderUpdatedDate(b: Brick) {
    if (b.updated) {
      return getDateString(b.updated);
    }
    return '';
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

    return <div className="table-body">
      {finalBricks.map((b, i) => {
        if (b.adaptedFrom) {
          console.log('adapted', b);
        }
        return (<div className="table-row clickable" key={i} onClick={() => {
          SetAdminBricksFilters({
            dateFilter: this.state.dateFilter,
            subjectCategory: this.state.subjectCategory,
            selectedSubjectIds: this.state.selectedSubjects.map(s => s.id)
          });
          this.props.history.push(playCover(b));
        }}>
          <div className="publish-column">{this.renderDate(b)}</div>
          {renderSubjectColumn(b)}
          <div className="first-column" dangerouslySetInnerHTML={{ __html: b.title }} />
          <div className="author-column" onClick={e => {
            e.stopPropagation();
            this.search(b.author.firstName.toLocaleLowerCase());
          }}>{b.author.firstName} {b.author.lastName} {b.author.email}</div>
          <div className="second-column" onClick={async (e) => {
            e.stopPropagation();
            const data = await getAdminBrickStatistic(b.id);
            if (data) {
              this.setState({ selectedBrick: b, brickAttempts: data.attempts, assignments: data.assignments })
            }
          }}>
            {b.attemptsCount}
          </div>
          <div className="third-column">{b.isCore ? <SpriteIcon name="globe" /> : <SpriteIcon name="key" />}</div>
          <div className="sponsor-column">
            {b.sponsorName ? b.sponsorName : 'Scholar6'}
          </div>
          <div className="publish-column">{this.renderUpdatedDate(b)}</div>
        </div>);
      })}
    </div>
  }

  renderTable() {
    return (
      <div className="table">
        <div className="table-scroll">
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
            <div className="publish-column header">
              <div>Updated</div>
              <div><SpriteIcon name="sort-arrows" onClick={() => {
                let isAscending = !this.state.isAscending;
                const finalBricks = this.filterAndSort(this.state.bricks, this.state.selectedSubjects, SortBy.Modified, isAscending)
                this.setState({ sortBy: SortBy.Modified, finalBricks, isAscending });
              }} /></div>
            </div>
          </div>
          {this.renderBody()}
        </div>
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

  checkSubjects(subjects: Subject[], subjectIds: number[]) {
    for (let subjectId of subjectIds) {
      const subject = subjects.find(s => s.id === subjectId);
      if (subject) {
        subject.checked = true;
      }
    }
    const selectedSubjects = subjects.filter(s => s.checked);
    const finalBricks = this.filterAndSort(this.state.bricks, selectedSubjects, this.state.sortBy, this.state.isAscending);
    this.setState({ selectedSubjects, finalBricks });
  }

  setSubjectCategory(subjectCategory: ESubjectCategory) {
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
      this.selectCategorySubjects(this.state.languageSubjects);
      selectedSubjects = [...this.state.languageSubjects];
    } else if (subjectCategory === ESubjectCategory.Math) {
      this.selectCategorySubjects(this.state.mathSubjects);
      selectedSubjects = [...this.state.mathSubjects];
    } else if (subjectCategory === ESubjectCategory.Science) {
      this.selectCategorySubjects(this.state.scienceSubjects);
      selectedSubjects = [...this.state.scienceSubjects];
    } else if (subjectCategory === ESubjectCategory.Everything) {
      this.selectCategorySubjects([]);
      selectedSubjects = [];
    }

    const finalBricks = this.filterAndSort(this.state.bricks, selectedSubjects, this.state.sortBy, this.state.isAscending);
    this.setState({ subjectCategory, finalBricks, selectedSubjects });
  }

  render() {
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page only-bricks-played-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title or Author Name"
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
            subjectCategory={this.state.subjectCategory}
            setSubjectCategory={this.setSubjectCategory.bind(this)}
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
                        Published: this.renderDate(brick),
                        Subjects: subject?.name,
                        Title: stripHtml(brick.title),
                        Author: brick.author.firstName + ' ' + brick.author.lastName + ' ' + brick.author.email,
                        Played: brick.attemptsCount,
                        'Public?': brick.isCore ? "yes" : "no",
                        Sponsor: brick.sponsorName ? brick.sponsorName : 'Scholar6',
                        'Modified At': this.renderUpdatedDate(brick)
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
                      [['Published', 'Subjects', 'Title', 'Author', 'Played', 'Public?', 'Sponsor', 'Modified At']],
                      this.state.finalBricks.map(b => {
                        const subject = this.state.subjects.find(s => s.id === b.subjectId);
                        return [this.renderDate(b), subject ? subject.name : '', stripHtml(b.title), b.author.firstName + ' ' + b.author.lastName, b.attemptsCount, b.isCore ? 'yes' : 'no', b.sponsorName ? b.sponsorName : 'Scholar6', this.renderUpdatedDate(b)]
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
        {this.state.selectedBrick && <BrickPlayedPopup
          history={this.props.history}
          dateFilter={this.state.dateFilter}
          brick={this.state.selectedBrick}
          subjects={this.state.subjects}
          assignments={this.state.assignments}
          brickAttempts={this.state.brickAttempts}
          close={() => {
            this.setState({ selectedBrick: null });
          }}
        />}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(BricksPlayedPage);
