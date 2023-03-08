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
  Subject,
  SubjectGroup,
} from "model/brick";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from "redux/actions/brickActions";
import actions from "redux/actions/requestFailed";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import { toggleElement } from "./service/viewAll";
import routes from "components/play/routes";
import InfinityScrollCustom from "./InvinityScrollCustom";
import { getPublishedBricksByPage, getUnauthPublishedBricksByPage } from "services/axios/brick";
import { ENGLISH_LANGUAGE_SUBJECT, ENGLISH_LITERATURE_SUBJECT, GENERAL_SUBJECT } from "components/services/subject";
import { getSubjects } from "services/axios/subject";

const MobileTheme = React.lazy(() => import("./themes/ViewAllPageMobileTheme"));

interface SubjectWithBricks extends Subject {
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  user: User;
  history: any;
  location: any;
  forgetBrick(): void;
  requestFailed(e: string): void;
}

interface BricksListState {
  expandedBrick: Brick | null;
  bricks: Array<Brick>;
  mySubjects: SubjectWithBricks[];
  subjects: SubjectWithBricks[];
  shown: boolean;
  isCore: boolean;
  isLoading: boolean;
  bricksCount: number;
  expandedSubject: SubjectWithBricks | null;
  expandedGroup: SubjectGroup | null;
  groupSubjects: Subject[];
  filterLevels: AcademicLevel[];
}

class MobileCategoryPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    const values = queryString.parse(props.location.search);

    let subjectId = null;
    if (values.subjectId) {
      subjectId = parseInt(values.subjectId as string);
    }

    let expandedGroup = null;
    if (values.subjectGroup) {
      expandedGroup = parseInt(values.subjectGroup as string);
    }

    this.state = {
      isCore: true,
      expandedBrick: null,
      bricks: [],
      isLoading: true,
      expandedSubject: null,
      expandedGroup,
      filterLevels: [],
      mySubjects: [],
      subjects: [],
      groupSubjects: [],
      bricksCount: 0,
      shown: false,
    };

    this.loadData(subjectId, expandedGroup);
  }

  async loadData(subjectId: number | null, expandedGroup: SubjectGroup | null) {
    if (this.props.user) {
      const data = await getPublishedBricksByPage(1, 0, true, [], [], [], false);
      if (data) {
        const mySubjects: SubjectWithBricks[] = [];
        const subjects = data.subjects.filter(s => s.count > 0);

        for (let s of this.props.user.subjects) {
          const s3 = subjects.find(s2 => s2.id == s.id);
          if (s3) {
            mySubjects.push(s3);
          }
        }

        let expandedSubject = null;
        if (subjectId) {
          const s = subjects.find(s => s.id === subjectId);
          if (s) {
            expandedSubject = s;
          }
        }

        this.setState({
          ...this.state,
          subjects,
          mySubjects,
          expandedSubject,
          shown: true,
          isLoading: false,
        });
      } else {
        this.props.requestFailed("Can`t get bricks");
      }
    } else {
      let subjects = await getSubjects();

      if (subjects) {

        let expandedSubject = null;
        if (subjectId) {
          const s = subjects.find(s => s.id === subjectId);
          if (s) {
            expandedSubject = s;
          }
        }

        let groupSubjects = [] as SubjectWithBricks[];
        if (expandedGroup) {
          groupSubjects = this.getGroupSubjects(subjects, expandedGroup);
        }

        if (subjects) {
          this.setState({
            ...this.state,
            subjects,
            expandedSubject,
            groupSubjects,
            shown: true,
            isLoading: false,
          })
        }
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

    // way to rerender infinity loaders with new data
    if (this.props.user) {

    } else {

    }
    this.setState({ filterLevels: levels });
  }

  expandSubject(s: SubjectWithBricks) {
    this.setState({ expandedSubject: s });
    let path = this.props.location.pathname;
    let link = path + '?subjectId=' + s.id;
    if (this.state.expandedGroup) {
      link += '&subjectGroup=' + this.state.expandedGroup;
    }
    this.props.history.push(link);
  }

  renderExpandedSubject(subject: SubjectWithBricks) {
    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className="main-listing dashboard-page mobile-category phone-view-all select-subject-dashboard-d3">
          <PageHeadWithMenu
            page={PageEnum.ViewAll}
            user={this.props.user}
            toggleSearch={() => this.props.history.push(map.SearchPublishBrickPage)}
            placeholder="Search Ongoing Projects & Published Bricks…"
            history={this.props.history}
            search={() => { }}
            searching={() => { }}
          />
          <div className="select-subject-dashboard-d33">
            <div className="back-arrow-container" onClick={() => this.setState({ expandedSubject: null, bricksCount: 0 })}>
              <SpriteIcon name="arrow-left" className="back-arrow-d33" />
              <div>Subject</div>
            </div>
            <div className="subjects-title-d33 subject-custom-d33">
              <div className="subject-title">{subject.name}</div>
              {this.state.bricksCount ? <div className="bricks-count">{this.state.bricksCount} Brick{this.state.bricksCount > 1 ? 's' : ''} found</div> : ''}
            </div>
            {this.state.groupSubjects.length > 0 ? this.renderJustSubjects(this.state.groupSubjects, this.state.expandedSubject) : <div />}
            <InfinityScrollCustom
              user={this.props.user}
              isCore={this.state.isCore}
              subjects={[subject]}
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
            placeholder="Search Ongoing Projects & Published Bricks…"
            history={this.props.history}
            search={() => { }}
            searching={() => { }}
          />
          <div className="select-subject-dashboard-d33">
            <div className="back-arrow-container" onClick={() => this.setState({ expandedGroup: null })}>
              <SpriteIcon name="arrow-left" className="back-arrow-d33" />
            </div>
            <div className="subjects-title-d33 subject-custom-d33">
              <div className="subject-title">{this.renderGroupName(subjectGroup)}</div>
              {this.state.bricksCount ? <div className="bricks-count">{this.state.bricksCount} Brick{this.state.bricksCount > 1 ? 's' : ''} found</div> : ''}
            </div>
            {this.state.groupSubjects.length > 0 ? this.renderJustSubjects(this.state.groupSubjects, this.state.expandedSubject) : <div />}
            <InfinityScrollCustom
              user={this.props.user}
              isCore={this.state.isCore}
              subjects={this.state.groupSubjects}
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
    }
    return groupSubjects;
  }

  moveToGroup(expandedGroup: SubjectGroup) {
    let path = this.props.location.pathname;
    if (expandedGroup === SubjectGroup.GeneralTopical) {
      const subject = this.state.subjects.find(s => s.name === GENERAL_SUBJECT);
      if (subject) {
        this.expandSubject(subject);
      }
    } else if (expandedGroup === SubjectGroup.English) {
      const s1 = this.state.subjects.find(s => s.name == ENGLISH_LANGUAGE_SUBJECT);
      const s2 = this.state.subjects.find(s => s.name == ENGLISH_LITERATURE_SUBJECT);
      if (s1 && s2) {
        this.setState({ expandedGroup, groupSubjects: [s1, s2], isCore: true });
        this.props.history.push(path + '?subjectGroup=' + expandedGroup);
      }
    } else if (expandedGroup === SubjectGroup.Personal) {
      this.setState({ expandedGroup, isCore: false });
      this.props.history.push(path + '?subjectGroup=' + expandedGroup);
    } else {
      this.setState({ expandedGroup, isCore: true, groupSubjects: this.getGroupSubjects(this.state.subjects, expandedGroup) });
      this.props.history.push(path + '?subjectGroup=' + expandedGroup);
    }
  }

  renderJustSubjects(subjects: any[], expandedSubject?: any) {
    return (
      <div className="subjects-custom-v6">
        {subjects.map(s => {
          let selected = false;
          if (expandedSubject && s.id === expandedSubject.id) {
            selected = true;
          }
          return (
            <div key={s.id} className={`subject-button ${selected ? 'active' : ''}`} onClick={() => this.expandSubject(s)}>
              <SpriteIcon name="circle-filled" style={{ color: s.color }} />
              <div>
                {s.name}
              </div>
            </div>
          );
        }
        )}
      </div>
    );
  }

  renderSubjectsV2(subjects: any[]) {
    return (
      <div>
        <div className="bold category-label">
          My Subjects
        </div>
        {this.renderJustSubjects(subjects)}
      </div>
    )
  }

  render() {
    if (this.state.expandedSubject) {
      return this.renderExpandedSubject(this.state.expandedSubject);
    }
    if (this.state.expandedGroup) {
      return this.renderExpandedSubjectGroup(this.state.expandedGroup);
    }
    return (
      <div className="mobile-categorise">
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          toggleSearch={() => this.props.history.push(map.SearchPublishBrickPage)}
          placeholder="Search Ongoing Projects & Published Bricks…"
          history={this.props.history}
          search={() => { }}
          searching={() => { }}
        />
        {this.props.user ?
          <div className="text-center header">
            <SpriteIcon className="absolute-arrow" name="arrow-left-stroke" onClick={() => this.props.history.push(map.MainPage)} />
            <div>
              <div>Click to explore one of the following subject</div>
              <div>categories</div>
            </div>
          </div>
          :
          <div className="text-center header">
            <div>
              <div>Click to explore one of the subject categories</div>
            </div>
          </div>
        }
        {this.state.mySubjects.length > 0 ? this.renderSubjectsV2(this.state.mySubjects) : <div />}
        <div className="bold category-label">
          Subject Categories
        </div>
        <div className="">
        </div>
        <div className="subject-categories">
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
            <div className={`subject-category ${this.props.user ? '' : 'disabled'}`}>
              <div onClick={() => {
                if (this.props.user) {
                  this.moveToGroup(SubjectGroup.Personal)
                }
              }}>
                <div className="flex-center zoom-item">
                  <SpriteIcon className="key-icon" name="category-personal" />
                </div>
                <div className="cat-name">{this.renderGroupName(SubjectGroup.Personal)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connector(MobileCategoryPage);
