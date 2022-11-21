import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import queryString from "query-string";
import { Swiper, SwiperSlide } from "swiper/react";

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
  SubjectGroupNames,
} from "model/brick";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from "redux/actions/brickActions";
import actions from "redux/actions/requestFailed";
import { getAssignmentIcon } from "components/services/brickService";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getBrickColor } from "services/brick";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import MobileHelp from "components/baseComponents/hoverHelp/MobileHelp";
import LevelHelpContent from "components/baseComponents/hoverHelp/LevelHelpContent";
import PhoneExpandedBrick from "./components/PhoneExpandedBrick";
import { isLevelVisible, toggleElement } from "./service/viewAll";
import routes from "components/play/routes";
import PageLoaderBlue from "components/baseComponents/loaders/pageLoaderBlue";
import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";
import InfinityScrollCustom from "./InvinityScrollCustom";
import subject from "redux/actions/subject";

const MobileTheme = React.lazy(() => import("./themes/ViewAllPageMobileTheme"));

enum Tab {
  MySubjects,
  AllSubjects,
  SubjectCategory,
}

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
  isCore: boolean;
  finalBricks: Brick[];
  isViewAll: boolean;
  mySubjects: SubjectWithBricks[];
  subjects: SubjectWithBricks[];
  categorySubjects: SubjectWithBricks[];
  shown: boolean;
  activeTab: Tab;
  isLoading: boolean;
  subjectGroup: SubjectGroup | null;
  expandedSubject: SubjectWithBricks | null;
  filterLevels: AcademicLevel[];
}

class MobileCategoryPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    const values = queryString.parse(props.location.search);

    let isViewAll = false;
    if (values.isViewAll) {
      isViewAll = true;
    }

    let subjectGroup = null;
    if (values.subjectGroup) {
      subjectGroup = parseInt(values.subjectGroup as string) as SubjectGroup;
    }

    let initTab = Tab.MySubjects;
    if (!this.props.user) {
      initTab = Tab.SubjectCategory;
    }

    this.state = {
      expandedBrick: null,
      bricks: [],
      isLoading: true,
      finalBricks: [],
      expandedSubject: null,
      isViewAll,
      isCore: true,
      mySubjects: [],
      subjects: [],
      categorySubjects: [],
      filterLevels: [],
      activeTab: initTab,
      subjectGroup,
      shown: false,
    };

    this.loadData(subjectGroup);
  }

  addBrickBySubject(subjects: SubjectWithBricks[], brick: Brick, isCore: boolean) {
    if (brick.isCore !== isCore) {
      return;
    }
    const subject = subjects.find((s) => s.id === brick.subjectId);
    if (subject) {
    }
  }

  async loadData(subjectGroup: SubjectGroup | null) {
    const subjects = (await getSubjects()) as SubjectWithBricks[] | null;
    if (subjects) {
      const mySubjects: SubjectWithBricks[] = [];
      const categorySubjects: SubjectWithBricks[] = [];

      if (this.props.user) {
        for (let ss of this.props.user.subjects) {
          mySubjects.push({ ...ss });
        }
      } else {
        for (let s of subjects) {
          if (s.group === subjectGroup) {
            categorySubjects.push({ ...s });
          }
        }
      }

      this.setState({
        ...this.state,
        subjects: subjects,
        mySubjects: mySubjects,
        categorySubjects: categorySubjects,
        shown: true,
        isLoading: false,
      });
    } else {
      this.props.requestFailed("Can`t get bricks");
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
        for (let student of assignment.stats.byStudent) {
          if (student.studentId === this.props.user?.id) {
            return true;
          }
        }
      }
    }
    return false;
  }

  setMySubjectsTab() {
    if (this.state.activeTab !== Tab.MySubjects) {
      this.setState({ activeTab: Tab.MySubjects });
    }
  }

  setAllSubjectsTab() {
    if (this.state.activeTab !== Tab.AllSubjects) {
      this.setState({ activeTab: Tab.AllSubjects });
    }
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
  }

  hideSubject() {
    this.setState({ expandedSubject: null });
  }

  toggleCore() {
    const newCore = !this.state.isCore;
    this.setState({ isCore: newCore });
  }

  renderMobileBricks() {
    if (this.state.isLoading) {
      return <div className="f-top-loader">
        <PageLoaderBlue content="" />
      </div>
    }
    if (this.state.finalBricks.length === 0) {
      return <div className="bricks-no-found bold">Sorry, no bricks found</div>;
    }

    const sorted = this.state.finalBricks.sort(
      (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
    );

    return (
      <Swiper slidesPerView={1}>
        {sorted.map((brick, i) => {
          const color = getBrickColor(brick);
          const circleIcon = getAssignmentIcon(brick);
          const isAssignment = this.checkAssignment(brick);

          return (
            <SwiperSlide key={i} onClick={() => this.handleClick(brick, isAssignment)}>
              {i === 0 && <div className="week-brick">Brick of the week</div>}
              <PhoneTopBrick16x9
                circleIcon={circleIcon}
                brick={brick}
                color={color}
                isViewAllAssignment={isAssignment}
                user={this.props.user}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }

  renderEmptySubject() {
    return (
      <div className="subject-no-bricks">
        <div>
          <p>Sorry, no bricks found.</p>
          <p>Try adjusting the filters or</p>
          <p>selecting another subject.</p>
        </div>
      </div>
    );
  }

  renderBricks(s: SubjectWithBricks) {
    return <InfinityScrollCustom
      user={this.props.user}
      subjectId={s.id}
      subjectGroup={this.state.subjectGroup}
      setBrick={b => {
        if (this.state.expandedBrick && this.state.expandedBrick.id === b.id) {
          this.setState({ expandedBrick: null });
        } else {
          this.setState({ expandedBrick: b });
        }
      }}
    />
  }

  renderSubjects(subjects: SubjectWithBricks[]) {
    return (
      <div>
        {subjects.map((s, n) => {
          return (
            <div key={n}>
              <div className="gg-subject-name">
                {s.name}
                <div className="va-expand" onClick={() => this.expandSubject(s)}>
                  <SpriteIcon name="arrow-down" />
                </div>
              </div>
              {this.renderBricks(s)}
            </div>
          );
        })}
        {this.state.expandedBrick && this.state.expandedBrick.title && (
          <PhoneExpandedBrick
            brick={this.state.expandedBrick}
            history={this.props.history}
            user={this.props.user}
            hide={() => this.setState({ expandedBrick: null })}
          />
        )}
      </div>
    );
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
            <div className="back-arrow-container">
              <SpriteIcon name="arrow-left" className="back-arrow-d33" />
              <div>Subject</div>
            </div>
            <div className="subjects-title-d33">{subject.name}</div>
            <InfinityScrollCustom
              user={this.props.user}
              subjectId={subject.id}
              subjectGroup={this.state.subjectGroup}
              setBrick={b => {
                if (this.state.expandedBrick && this.state.expandedBrick.id === b.id) {
                  this.setState({ expandedBrick: null });
                } else {
                  this.setState({ expandedBrick: b });
                }
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

  render() {
    if (this.state.expandedSubject) {
      return this.renderExpandedSubject(this.state.expandedSubject);
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
            {this.props.user && <div>
              <div className="subjects-title-d33">My Subjects</div>
              <Grid container direction="row" className="subjects-d33">
                {this.state.mySubjects.map(subject => <Grid xs={6} className="subject-d33">
                  <div>{subject.name}</div>
                </Grid>)}
              </Grid>
            </div>
            }
            <div>
              <div className="subjects-title-d33">All Subjects</div>
              <Grid container direction="row" className="subjects-d33">
                {this.state.subjects.map(subject => <Grid xs={6} className="subject-d33" onClick={() => this.expandSubject(subject)}>
                  <div>{subject.name}</div>
                </Grid>)}
              </Grid>
            </div>
          </div>
        </div>
      </React.Suspense>
    );
  }
}

export default connector(MobileCategoryPage);
