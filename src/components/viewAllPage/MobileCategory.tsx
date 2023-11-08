import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import "swiper/swiper.scss";

import {
  AcademicLevel,
  AcademicLevelLabels,
  Brick,
  BrickLengthEnum,
  Subject,
  SubjectGroup,
} from "model/brick";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from "redux/actions/brickActions";
import actions from "redux/actions/requestFailed";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import map, { SubjectCategories } from "components/map";
import { toggleElement } from "./service/viewAll";
import routes from "components/play/routes";
import InfinityScrollCustom from "./InvinityScrollCustom";
import { getPublishedBricksByPage, getUnauthPublishedBricksByPage } from "services/axios/brick";
import { ENGLISH_LANGUAGE_SUBJECT, ENGLISH_LITERATURE_SUBJECT, GENERAL_SUBJECT } from "components/services/subject";
import { SortBy } from "./components/ViewAllFilter";
import subjectActions from "redux/actions/subject";
import PageLoader from "components/baseComponents/loaders/pageLoader";

const MobileTheme = React.lazy(() => import("./themes/ViewAllPageMobileTheme"));

interface BricksListProps {
  user: User;
  history: any;
  location: any;
  forgetBrick(): void;
  requestFailed(e: string): void;

  subjects: Subject[];
  getSubjects(): Promise<Subject[]>;
}

enum ActiveTab {
  Categories,
  MySubjects,
  AllBricks
}

interface BricksListState {
  typingString: string;
  searchString: string;
  typingTimeout: number | NodeJS.Timeout;
  mySubjects: Subject[];
  totalSubjects: Subject[];
  subjects: Subject[];

  hasPersonalBricks: boolean;

  shown: boolean;
  isCore: boolean;
  isLoading: boolean;
  bricksCount: number;
  activeTab: ActiveTab;

  expandedSubjects: Subject[];
  expandedGroup: SubjectGroup | null;
  groupSubjects: Subject[];

  filterLevels: AcademicLevel[];
  filterLength: BrickLengthEnum[];

  searchExpanded: boolean;
}

class MobileCategoryPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    const values = queryString.parse(props.location.search);

    let subjectIds:number[] = [];
    if (values.subjectIds) {
      try {
        let subjectsStr = values.subjectIds as string;
        const idsArray = subjectsStr.split(',');
        subjectIds.push(...idsArray.map(id => parseInt(id)));
      } catch { }
    }

    let expandedGroup = null;
    if (values.subjectGroup) {
      expandedGroup = parseInt(values.subjectGroup as string);
    }

    let activeTab = ActiveTab.Categories;

    if (values.mySubject) {
      if (values.mySubject === 'false') {
        activeTab = ActiveTab.AllBricks;
      } else {
        activeTab = ActiveTab.MySubjects;
      }
    }

    this.state = {
      typingTimeout: -1,
      typingString: '',
      searchString: '',
      isCore: true,
      hasPersonalBricks: false,
      isLoading: true,
      expandedSubjects: [],
      expandedGroup,
      filterLevels: [],
      filterLength: [],
      mySubjects: [],
      subjects: [],
      totalSubjects: [],
      groupSubjects: [],
      bricksCount: 0,
      shown: false,
      activeTab,
      searchExpanded: false
    }

    this.loadData(subjectIds, expandedGroup);
  }

  prepareExpandedSubjects(subjects: Subject[], subjectIds: number[]) {
    const expandedSubjects = [];
    if (subjectIds.length > 0) {
      for (let subjectId of subjectIds) {
        const s = subjects.find(s => s.id === subjectId);
        if (s) {
          expandedSubjects.push(s);
        }
      }
    }
    return expandedSubjects;
  }

  async loadData(subjectIds: number[], expandedGroup: SubjectGroup | null) {
    if (this.props.user) {
      const data = await getPublishedBricksByPage(1, 0, true, [], [], [], false, undefined, SortBy.Date);
      if (data) {
        let subjects = this.props.subjects;
        if (this.props.subjects.length === 0) {
          subjects = await this.props.getSubjects();
        }
        const mySubjects: Subject[] = [];

        for (let s of this.props.user.subjects) {
          const s3 = subjects.find(s2 => s2.id == s.id);
          if (s3) {
            mySubjects.push(s3);
          }
        }

        const expandedSubjects = this.prepareExpandedSubjects(subjects, subjectIds);

        let isCore = true;
        let groupSubjects = [] as Subject[];
        if (expandedGroup) {
          groupSubjects = this.getGroupSubjects(subjects, expandedGroup);
          if (expandedGroup == SubjectGroup.Personal) {
            groupSubjects = data.subjects;
            isCore = false;
          }
        }

        this.setState({
          ...this.state,
          isCore,
          subjects,
          totalSubjects: subjects,
          mySubjects,
          expandedSubjects,
          groupSubjects,
          shown: true,
          isLoading: false,
        });
        const personalData = await getPublishedBricksByPage(1, 0, false, [], [], [], false, undefined, SortBy.Date);
        if (personalData && personalData.bricks && personalData.bricks.length > 0) {
          this.setState({ hasPersonalBricks: true });
        }
      } else {
        this.props.requestFailed("Can`t get subjects");
      }
    } else {
      const data = await getUnauthPublishedBricksByPage(1, 0, [], [], [], false, SortBy.Date);

      if (data) {
        const subjects = data.subjects ? data.subjects.filter(s => s.count > 0) : [];
        const expandedSubjects = this.prepareExpandedSubjects(subjects, subjectIds);

        let groupSubjects = [] as Subject[];
        if (expandedGroup) {
          groupSubjects = this.getGroupSubjects(subjects, expandedGroup);
        }

        if (subjects) {
          this.setState({
            ...this.state,
            subjects,
            expandedSubjects,
            groupSubjects,
            shown: true,
            isLoading: false,
          })
        }
      } else {
        this.props.requestFailed("Can`t get subjects");
      }
    }
  }

  handleClick(brick: Brick, isAssignment: boolean) {
    if (isAssignment) {
      this.props.history.push(map.postAssignment(brick.id, this.props.user.id));
    } else {
      this.props.history.push(routes.playCover(brick));
    }
  }

  checkAssignment(brick: Brick) {
    if (brick.assignments) {
      for (let assignmen of brick.assignments) {
        let assignment = assignmen as any;
        if (assignment && assignment.stats) {
          for (let student of assignment?.stats?.byStudent) {
            if (student.studentId === this.props.user?.id) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  filterByLevel(level: AcademicLevel) {
    const { filterLevels } = this.state;
    const levels = toggleElement(filterLevels, level);
    this.setState({ filterLevels: [...levels] });
  }

  filterByLength(length: BrickLengthEnum) {
    const { filterLength } = this.state;
    const lengths = toggleElement(filterLength, length);
    this.setState({ filterLength: [...lengths] });
  }

  async search(searchString: string) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    const typingTimeout = setTimeout(() => {
      this.setState({ searchString });
      clearTimeout(typingTimeout);
    }, 200);

    this.setState({ typingString: searchString });
    this.setState({ typingTimeout });
  }

  renderSubjectSearch() {
    return (
      <div className="back-arrow-container">
        <SpriteIcon
          name="arrow-left-stroke" className="absolute-arrow"
          onClick={() => {
            this.setState({ expandedSubjects: [], searchString: '', typingString: '', bricksCount: 0 });
            const path = this.pathSubjectGroup(this.state.expandedGroup);
            this.props.history.push(path);
          }}
        />
        <div className="ba-search-input-container" onClick={() => {
          this.setState({ searchExpanded: true });
        }}>
          <SpriteIcon name="search" />
          <input
            value={this.state.typingString}
            onChange={e => this.search(e.target.value)}
            placeholder="Search in subject"
          />
        </div>
      </div>
    );
  }

  renderSubjectTitle(subjects: Subject[]) {
    if (subjects.length === 1) {
      return (
        <div className="subject-title">{subjects[0].name}</div>
      );
    }
    return (
      <div className="subject-title">Search Results</div>
    );
  }

  renderExpandedSubjects(subjects: Subject[]) {
    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className="main-listing dashboard-page mobile-category phone-view-all select-subject-dashboard-d3">
          <PageHeadWithMenu
            page={PageEnum.ViewAll}
            user={this.props.user}
            toggleSearch={() => this.props.history.push(map.SearchPublishBrickPage)}
            history={this.props.history}
          />
          <div className="select-subject-dashboard-d33">
            {this.renderSubjectSearch()}
            <div className="subjects-title-d33 subject-custom-d33">
              {this.renderSubjectTitle(subjects)}
              {this.state.bricksCount ? <div className="bricks-count">{this.state.bricksCount} Brick{this.state.bricksCount > 1 ? 's' : ''} found</div> : ''}
            </div>
            <InfinityScrollCustom
              searchString={this.state.searchString}
              user={this.props.user}
              filterLevels={this.state.filterLevels}
              filterLength={this.state.filterLength}
              isCore={this.state.isCore}
              subjects={subjects}
              setBrick={(b: Brick) => {
                if (this.props.user && this.checkAssignment(b)) {
                  this.props.history.push(map.postAssignment(b.id, this.props.user.id));
                } else {
                  this.props.history.push(routes.playBrief(b));
                }
              }}
              onLoad={data => {
                this.setState({ bricksCount: data.pageCount });
              }}
            />
          </div>
        </div>
      </React.Suspense>
    );
  }

  renderGroupName(sGroup: SubjectGroup) {
    if (sGroup === SubjectGroup.Arts) {
      return 'Arts'
    } else if (sGroup === SubjectGroup.English) {
      return 'English';
    } else if (sGroup === SubjectGroup.GeneralTopical) {
      return 'General & Topical';
    } else if (sGroup === SubjectGroup.HumanitiesAndSocialSciences) {
      return 'Humanities';
    } else if (sGroup === SubjectGroup.MathsAndComputing) {
      return 'Maths & Computing';
    } else if (sGroup === SubjectGroup.Science) {
      return 'Science';
    } else if (sGroup === SubjectGroup.Languages) {
      return 'Languages';
    } else if (sGroup === SubjectGroup.Personal) {
      return 'Personal Bricks';
    }
  }

  renderGroupSearch(label: string, clickBack?: Function) {
    if (this.state.searchExpanded) {
      return (
        <div className="search-container expanded">
          <div className="backgrond-blur" onClick={() => this.setState({ searchExpanded: false })} />
          <div className="search-and-filters-popup">
            <div className="back-arrow-container">
              <SpriteIcon
                name="arrow-left-stroke" className="absolute-arrow"
                onClick={() => {
                  this.setState({ searchExpanded: false });
                }}
              />
              <div className="ba-search-input-container">
                <SpriteIcon name="search" />
                <input
                  value={this.state.typingString}
                  onChange={e => this.search(e.target.value)}
                  placeholder={label}
                />
              </div>
            </div>
            <div className="level-and-length">
              <div className="level-rd5">
                <div className="bold">Level</div>
                <div className="ba-filter">
                  {this.renderAcademicLevel(AcademicLevel.First)}
                  {this.renderAcademicLevel(AcademicLevel.Second)}
                  {this.renderAcademicLevel(AcademicLevel.Third)}
                </div>
              </div>
              <div className="length-rd5">
                <div className="bold">Length</div>
                <div className="ba-filter">
                  {this.renderBrickLengthBox(BrickLengthEnum.S20min)}
                  {this.renderBrickLengthBox(BrickLengthEnum.S40min)}
                  {this.renderBrickLengthBox(BrickLengthEnum.S60min)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="search-container">
        <div className="back-arrow-container">
          <SpriteIcon
            name="arrow-left-stroke" className="absolute-arrow"
            onClick={() => {
              if (clickBack) {
                clickBack();
              } else {
                this.setState({ expandedGroup: null, typingString: '', searchString: '', groupSubjects: [] })
                this.props.history.push(this.props.location.pathname);
              }
            }}
          />
          <div className="ba-search-input-container">
            <SpriteIcon name="search" />
            <input
              value={this.state.typingString}
              onChange={e => this.search(e.target.value)}
              placeholder={label}
            />
            <div className="filter-btn">
              <div onClick={() => {
                this.setState({ searchExpanded: true });
              }}>
                <div>
                  Filters
                </div>
                <SpriteIcon name="arrow-down" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  toggleSelectedSubject(s: Subject) {
    // toggle subject
    const expandedSubjects = [...this.state.expandedSubjects];
    const foundIndex = expandedSubjects.findIndex(sub => sub.id === s.id);
    if (foundIndex >= 0) {
      expandedSubjects.splice(foundIndex, 1);
    } else {
      expandedSubjects.push(s);
    }

    let isCore = true;
    if (this.state.expandedGroup === SubjectGroup.Personal) {
      isCore = false;
    }
    this.setState({ expandedSubjects, isCore });

    // prepare link
    let link = this.props.location.pathname + '?subjectIds=' + expandedSubjects.map(s => s.id);

    if (this.state.expandedGroup) {
      link += '&' + this.justSubjectGroup(this.state.expandedGroup);
    }
    this.props.history.push(link);
  }

  renderSubjectsList(subjects: Subject[]) {
    return (
      <div className="subject-d33">
        {subjects.map((s, i) => <div key={i} className={this.state.expandedSubjects.find(sr => sr.id === s.id) ? 'selected' : ''} onClick={() => this.toggleSelectedSubject(s)}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill={s.color} />
          </svg>
          {s.name}
        </div>)}
      </div>
    );
  }

  renderExpandedSubjectGroup(subjectGroup: SubjectGroup) {
    if (this.state.groupSubjects.length === 0) {
      return <div />;
    }

    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className="main-listing dashboard-page mobile-category phone-view-all select-subject-dashboard-d3">
          <PageHeadWithMenu
            page={PageEnum.ViewAll}
            user={this.props.user}
            toggleSearch={() => this.props.history.push(map.SearchPublishBrickPage)}
            history={this.props.history}
          />
          <div className="select-subject-dashboard-d33">
            {this.renderGroupSearch('Search in ' + this.renderGroupName(subjectGroup), () => {
              this.setState({ expandedGroup: null, typingString: '', expandedSubjects: [], searchString: '', activeTab: ActiveTab.Categories, groupSubjects: [] })
              this.props.history.push(SubjectCategories);
            })}
            <div className="subjects-title-d33 subject-custom-d33">
              <div className="subject-title">{this.renderGroupName(subjectGroup)}</div>
              {this.state.bricksCount ? <div className="bricks-count">{this.state.bricksCount} Brick{this.state.bricksCount > 1 ? 's' : ''} found</div> : ''}
            </div>
            {this.renderSubjectsList(this.getGroupSubjects(this.state.subjects, subjectGroup))}
            <InfinityScrollCustom
              searchString={this.state.searchString}
              user={this.props.user}
              isCore={this.state.isCore}
              filterLevels={this.state.filterLevels}
              filterLength={this.state.filterLength}
              subjects={this.state.expandedSubjects.length > 0 ? this.state.expandedSubjects : this.state.groupSubjects}
              setBrick={(b: Brick) => {
                if (this.props.user && this.checkAssignment(b)) {
                  this.props.history.push(map.postAssignment(b.id, this.props.user.id));
                } else {
                  this.props.history.push(routes.playBrief(b));
                }
              }}
              onLoad={data => {
                this.setState({ bricksCount: data.pageCount });
              }}
            />
          </div>
        </div>
      </React.Suspense>
    );
  }

  renderAcademicLevel(level: AcademicLevel) {
    const isActive = !!this.state.filterLevels.find((l) => l === level);
    return (
      <div
        className={`va-round-level ${isActive ? "active" : ""}`}
        onClick={() => this.filterByLevel(level)}
      >
        {AcademicLevelLabels[level]}
      </div>
    );
  }

  renderBrickLengthBox(length: number) {
    const isActive = !!this.state.filterLength.find((l) => l === length);
    return (
      <div
        className={`va-round-level ${isActive ? "active" : ""}`}
        onClick={() => this.filterByLength(length)}
      >
        {length}
      </div>
    );
  }

  getGroupSubjects(subjects: Subject[], subjectGroup: SubjectGroup) {
    let groupSubjects = subjects.filter(s => s.group === subjectGroup);
    if (subjectGroup === SubjectGroup.English) {
      const s1 = subjects.find(s => s.name == ENGLISH_LANGUAGE_SUBJECT);
      const s2 = subjects.find(s => s.name == ENGLISH_LITERATURE_SUBJECT);
      if (s1 && s2) {
        groupSubjects = [s1, s2];
      }
    } else if (subjectGroup === SubjectGroup.HumanitiesAndSocialSciences) {
      groupSubjects = groupSubjects.filter(s => s.name != ENGLISH_LITERATURE_SUBJECT);
    } else if (subjectGroup === SubjectGroup.Languages) {
      groupSubjects = groupSubjects.filter(s => s.name != ENGLISH_LANGUAGE_SUBJECT);
    }
    return groupSubjects;
  }

  justSubjectGroup(subjectGroup?: SubjectGroup | null) {
    if (subjectGroup) {
      return 'subjectGroup=' + subjectGroup;
    }
    return '';
  }

  pathSubjectGroup(subjectGroup?: SubjectGroup | null) {
    return this.props.location.pathname + '?' + this.justSubjectGroup(subjectGroup);
  }


  moveToGroup(expandedGroup: SubjectGroup) {
    if (expandedGroup === SubjectGroup.GeneralTopical) {
      const subject = this.state.subjects.find(s => s.name === GENERAL_SUBJECT);
      if (subject) {
        this.setState({ expandedGroup, groupSubjects: [subject], isCore: true });
        this.props.history.push(this.pathSubjectGroup(expandedGroup));
      }
    } else if (expandedGroup === SubjectGroup.English) {
      const s1 = this.state.subjects.find(s => s.name == ENGLISH_LANGUAGE_SUBJECT);
      const s2 = this.state.subjects.find(s => s.name == ENGLISH_LITERATURE_SUBJECT);
      if (s1 && s2) {
        this.setState({ expandedGroup, groupSubjects: [s1, s2], isCore: true });
        this.props.history.push(this.pathSubjectGroup(expandedGroup));
      }
    } else if (expandedGroup === SubjectGroup.Personal) {   
      this.setState({ expandedGroup, groupSubjects: this.state.totalSubjects, isCore: false });
      this.props.history.push(this.pathSubjectGroup(expandedGroup));
    } else {
      this.setState({ expandedGroup, isCore: true, groupSubjects: this.getGroupSubjects(this.state.subjects, expandedGroup) });
      this.props.history.push(this.pathSubjectGroup(expandedGroup));
    }
  }

  renderTopButtons() {
    if (this.props.user) {
      return (
        <div>
          <div className="row top-row">
            <div className="top-btn bg-green" onClick={() => {
              this.setState({ activeTab: ActiveTab.AllBricks });
              this.props.history.push(map.ViewAllPageB);
            }} >
              All Bricks
              <SpriteIcon name='arrow-right' />
            </div>
            <div className="top-btn bg-purple" onClick={() => {
              this.setState({ activeTab: ActiveTab.MySubjects });
              this.props.history.push(map.ViewAllPageA);
            }}>
              My Subjects
              <SpriteIcon name='arrow-right' />
            </div>
          </div>
          {this.state.hasPersonalBricks &&
            <div className="row">
              <div className="top-btn bg-blue" onClick={() => {
                if (this.props.user) {
                  this.moveToGroup(SubjectGroup.Personal)
                }
              }}>
                Personal Bricks
                <SpriteIcon name='arrow-right' />
              </div>
            </div>}
        </div>
      );
    }

    return (
      <div>
        <div className="row top-row">
          <div className="top-btn bg-green full-width" onClick={() => {
            this.setState({ activeTab: ActiveTab.AllBricks });
            this.props.history.push(map.ViewAllPageB);
          }} >
            All Bricks
            <SpriteIcon name='arrow-right' />
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }
    if (this.state.expandedGroup) {
      return this.renderExpandedSubjectGroup(this.state.expandedGroup);
    }
    if (this.state.activeTab === ActiveTab.MySubjects) {
      return (
        <React.Suspense fallback={<></>}>
          <MobileTheme />
          <div className="main-listing dashboard-page mobile-category phone-view-all select-subject-dashboard-d3">
            <PageHeadWithMenu
              page={PageEnum.ViewAll}
              user={this.props.user}
              toggleSearch={() => this.props.history.push(map.SearchPublishBrickPage)}
              history={this.props.history}
            />
            <div className="select-subject-dashboard-d33">
              {this.renderGroupSearch('Search in my subjects', () => {
                this.setState({ expandedGroup: null, typingString: '', searchString: '', activeTab: ActiveTab.Categories, groupSubjects: [] })
                this.props.history.push(SubjectCategories);
              })}
              <div className="subjects-title-d33 subject-custom-d33">
                <div className="subject-title">My Subjects</div>
                {this.state.bricksCount ? <div className="bricks-count">{this.state.bricksCount} Brick{this.state.bricksCount > 1 ? 's' : ''}</div> : ''}
              </div>
              {this.renderSubjectsList(this.props.user.subjects)}
              <InfinityScrollCustom
                searchString={this.state.searchString}
                user={this.props.user}
                isCore={this.state.isCore}
                subjects={this.state.expandedSubjects ? this.state.expandedSubjects : this.state.mySubjects}
                filterLevels={this.state.filterLevels}
                filterLength={this.state.filterLength}
                setBrick={(b: Brick) => {
                  if (this.props.user && this.checkAssignment(b)) {
                    this.props.history.push(map.postAssignment(b.id, this.props.user.id));
                  } else {
                    this.props.history.push(routes.playBrief(b));
                  }
                }}
                onLoad={data => {
                  this.setState({ bricksCount: data.pageCount });
                }}
              />
            </div>
          </div>
        </React.Suspense>
      );
    }
    if (this.state.activeTab === ActiveTab.AllBricks) {
      return (
        <React.Suspense fallback={<></>}>
          <MobileTheme />
          <div className="main-listing dashboard-page mobile-category phone-view-all select-subject-dashboard-d3">
            <PageHeadWithMenu
              page={PageEnum.ViewAll}
              user={this.props.user}
              toggleSearch={() => this.props.history.push(map.SearchPublishBrickPage)}
              history={this.props.history}
            />
            <div className="select-subject-dashboard-d33">
              {this.renderGroupSearch('Search in all bricks', () => {
                this.setState({ expandedGroup: null, typingString: '', searchString: '', activeTab: ActiveTab.Categories, groupSubjects: [] })
                this.props.history.push(SubjectCategories);
              })}
              <InfinityScrollCustom
                searchString={this.state.searchString}
                user={this.props.user}
                isCore={this.state.isCore}
                subjects={this.state.subjects}
                filterLevels={this.state.filterLevels}
                filterLength={this.state.filterLength}
                setBrick={(b: Brick) => {
                  if (this.props.user && this.checkAssignment(b)) {
                    this.props.history.push(map.postAssignment(b.id, this.props.user.id));
                  } else {
                    this.props.history.push(routes.playBrief(b));
                  }
                }}
                onLoad={data => {
                  this.setState({ bricksCount: data.pageCount });
                }}
              />
            </div>
          </div>
        </React.Suspense>
      );
    }
    return (
      <div className="mobile-categorise">
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          toggleSearch={() => this.props.history.push(map.SearchPublishBrickPage)}
          history={this.props.history}
        />
        <div className="text-center header header-mobile">
          <SpriteIcon className="absolute-arrow" name="arrow-left-stroke" onClick={() => this.props.history.push(map.MainPage)} />
          <div>
            <div>Click to explore one of the subject categories</div>
          </div>
        </div>
        <div className="subject-categories">
          {this.renderTopButtons()}
          <div className="row label-row bold">
            Subject Areas
          </div>
          <div className="row">
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.English)}>
                <div className="flex-center zoom-item">
                  <SpriteIcon name="english-literature" />
                </div>
                <div className="cat-name">{this.renderGroupName(SubjectGroup.English)}</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.GeneralTopical)}>
                <div className="flex-center zoom-item">
                  <SpriteIcon name="category-internet" />
                </div>
                <div className="cat-name">{this.renderGroupName(SubjectGroup.GeneralTopical)}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.HumanitiesAndSocialSciences)}>
                <div className="flex-center zoom-item">
                  <SpriteIcon name="category-book" />
                </div>
                <div className="cat-name">{this.renderGroupName(SubjectGroup.HumanitiesAndSocialSciences)}</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.MathsAndComputing)}>
                <div className="flex-center zoom-item">
                  <SpriteIcon name="binary-code" />
                </div>
                <div className="cat-name">{this.renderGroupName(SubjectGroup.MathsAndComputing)}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.Languages)}>
                <div className="flex-center zoom-item">
                  <SpriteIcon name="category-translation" />
                </div>
                <div className="cat-name">{this.renderGroupName(SubjectGroup.Languages)}</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.Science)}>
                <div className="flex-center zoom-item">
                  <SpriteIcon name="category-chemistry" />
                </div>
                <div className="cat-name">{this.renderGroupName(SubjectGroup.Science)}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.Arts)}>
                <div className="flex-center zoom-item">
                  <SpriteIcon name="category-canvas" />
                </div>
                <div className="cat-name">{this.renderGroupName(SubjectGroup.Arts)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  subjects: state.subjects.subjects
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
  getSubjects: () => dispatch(subjectActions.fetchSubjects())
});

const connector = connect(mapState, mapDispatch);

export default connector(MobileCategoryPage);
