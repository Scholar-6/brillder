import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { Swiper, SwiperSlide } from "swiper/react";
import queryString from "query-string";
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
import { getPublicBricks } from "services/axios/brick";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import MobileHelp from "components/baseComponents/hoverHelp/MobileHelp";
import LevelHelpContent from "components/baseComponents/hoverHelp/LevelHelpContent";
import PhoneExpandedBrick from "./components/PhoneExpandedBrick";
import PhoneSearchPage from "./PhoneSearchPage";
import { isLevelVisible, toggleElement } from "./service/viewAll";
import { showZendesk } from "services/zendesk";
import routes from "components/play/routes";
import PageLoaderBlue from "components/baseComponents/loaders/pageLoaderBlue";

const MobileTheme = React.lazy(() => import("./themes/ViewAllPageMobileTheme"));

enum Tab {
  MySubjects,
  AllSubjects,
  SubjectCategory,
}

interface SubjectWithBricks extends Subject {
  bricks: Brick[];
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
  isSearching: boolean;
  forgetBrick(): void;
  requestFailed(e: string): void;
}

interface BricksListState {
  expandedBrick: Brick | null;
  bricks: Array<Brick>;
  isSearching: boolean;
  finalBricks: Brick[];
  isViewAll: boolean;
  mySubjects: SubjectWithBricks[];
  subjects: SubjectWithBricks[];
  categorySubjects: SubjectWithBricks[];
  shown: boolean;
  activeTab: Tab;
  isLoading: boolean;
  isSearchingPage: boolean;
  subjectGroup: SubjectGroup | null;
  expandedSubject: SubjectWithBricks | null;
  filterLevels: AcademicLevel[];
}

class MobileCategoryPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    const values = queryString.parse(props.location.search);

    if (!this.props.user) {
      if (!values.subjectGroup) {
        this.props.history.push(map.SubjectCategories);
      }
    }

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
      isSearching: this.props.isSearching ? this.props.isSearching : false,
      isViewAll,
      mySubjects: [],
      subjects: [],
      categorySubjects: [],
      filterLevels: [],
      activeTab: initTab,
      subjectGroup,
      shown: false,

      isSearchingPage: false,
    };

    this.loadData(subjectGroup);
  }

  addBrickBySubject(subjects: SubjectWithBricks[], brick: Brick) {
    const subject = subjects.find((s) => s.id === brick.subjectId);
    if (subject) {
      subject.bricks.push(brick);
    }
  }

  async loadData(subjectGroup: SubjectGroup | null) {
    const bricks = await getPublicBricks();
    const subjects = (await getSubjects()) as SubjectWithBricks[] | null;
    if (bricks && subjects) {
      const mySubjects: SubjectWithBricks[] = [];
      const categorySubjects: SubjectWithBricks[] = [];

      if (this.props.user) {
        for (let ss of this.props.user.subjects) {
          mySubjects.push({ ...ss, bricks: [] });
        }
      } else {
        for (let s of subjects) {
          if (s.group === subjectGroup) {
            categorySubjects.push(s);
          }
        }
      }

      this.clearBricks(subjects);

      for (let brick of bricks) {
        this.addBrickBySubject(subjects, brick);
        this.addBrickBySubject(mySubjects, brick);
        this.addBrickBySubject(categorySubjects, brick);
      }
      this.setState({
        ...this.state,
        bricks,
        finalBricks: bricks,
        subjects,
        mySubjects,
        shown: true,
        isLoading: false,
        categorySubjects,
      });
    } else {
      this.props.requestFailed("Can`t get bricks");
    }
  }

  clearBricks(subjects: SubjectWithBricks[]) {
    for (let s of subjects) {
      s.bricks = [];
    }
  }

  handleClick(brickId: number) {
    this.props.history.push(routes.playCover(brickId));
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
    if (this.props.user) {
      const { subjects, mySubjects } = this.state;
      this.clearBricks(subjects);
      this.clearBricks(mySubjects);
      for (let brick of this.state.bricks) {
        if (isLevelVisible(brick, levels)) {
          this.addBrickBySubject(subjects, brick);
          this.addBrickBySubject(mySubjects, brick);
        }
      }
    } else {
      const { categorySubjects } = this.state;
      this.clearBricks(categorySubjects);
      for (let brick of this.state.bricks) {
        if (isLevelVisible(brick, levels)) {
          this.addBrickBySubject(categorySubjects, brick);
        }
      }
    }
    this.setState({ filterLevels: levels });
  }

  expandSubject(s: SubjectWithBricks) {
    this.setState({ expandedSubject: s });
  }

  hideSubject() {
    this.setState({ expandedSubject: null });
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

    let bricksList: any[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const brick = sorted[i];
      if (brick) {
        const color = getBrickColor(brick);
        const circleIcon = getAssignmentIcon(brick);
        bricksList.push({
          brick,
          elem: (
            <PhoneTopBrick16x9
              circleIcon={circleIcon}
              brick={brick}
              index={i}
              color={color}
            />
          ),
        });
      }
    }

    return (
      <Swiper slidesPerView={1}>
        {bricksList.map((b, i) => (
          <SwiperSlide key={i} onClick={() => this.handleClick(b.brick.id)}>
            {i === 0 && <div className="week-brick">Brick of the week</div>}
            {b.elem}
          </SwiperSlide>
        ))}
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

  renderBricks(bricks: Brick[]) {
    return (
      <div className="bricks-scroll-row">
        <div
          className="bricks-flex-row"
          style={{ width: bricks.length * 60 + 2 + "vw" }}
        >
          {bricks.map((b: any, i: number) => {
            const color = getBrickColor(b as Brick);
            return (
              <PhoneTopBrick16x9
                key={i}
                circleIcon=""
                brick={b}
                index={i}
                color={color}
                onClick={() => {
                  if (this.state.expandedBrick === b) {
                    this.setState({ expandedBrick: null });
                  } else {
                    this.setState({ expandedBrick: b });
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  renderSubjects(subjects: SubjectWithBricks[]) {
    return (
      <div>
        {subjects.map((s, n) => {
          const expandedBrick = s.bricks.find((b) => b.expanded);
          return (
            <div key={n}>
              <div className="gg-subject-name">
                {s.name}
                {s.bricks.length > 0 && (
                  <div
                    className="va-expand"
                    onClick={() => this.expandSubject(s)}
                  >
                    <SpriteIcon name="arrow-down" />
                  </div>
                )}
              </div>
              {s.bricks.length > 0
                ? this.renderBricks(s.bricks)
                : this.renderEmptySubject()}
              {expandedBrick && expandedBrick.title && (
                <PhoneExpandedBrick
                  brick={expandedBrick}
                  history={this.props.history}
                  hide={() => this.setState({ expandedBrick: null })}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  renderExpandedSubject() {
    const { expandedSubject } = this.state;

    if (expandedSubject) {
      const { bricks } = expandedSubject;
      var brickGroups = [];
      brickGroups.push(
        bricks.filter((b) => b.academicLevel === AcademicLevel.First)
      );
      brickGroups.push(
        bricks.filter((b) => b.academicLevel === AcademicLevel.Second)
      );
      brickGroups.push(
        bricks.filter((b) => b.academicLevel === AcademicLevel.Third)
      );
      brickGroups.push(
        bricks.filter((b) => b.academicLevel === AcademicLevel.Fourth)
      );

      brickGroups = brickGroups.filter((b) => b.length > 0);

      return (
        <div>
          <div className="gg-subject-name">
            {expandedSubject.name}
            <div className="va-level-container smaller">
              {this.renderAcademicLevel(brickGroups[0][0].academicLevel)}
              <div className="va-level-count">{brickGroups[0].length}</div>
            </div>
            {expandedSubject.bricks.length > 0 && (
              <div
                className="va-expand va-hide"
                onClick={this.hideSubject.bind(this)}
              >
                <SpriteIcon name="arrow-up" />
              </div>
            )}
          </div>
          {brickGroups.map((bs, i) => (
            <div className="va-s-subject-bricks" key={i}>
              {i > 0 && (
                <div className="va-level-container smaller">
                  {this.renderAcademicLevel(bs[0].academicLevel)}
                  <div className="va-level-count">{bs.length}</div>
                </div>
              )}
              {this.renderBricks(bs)}
            </div>
          ))}
        </div>
      );
    }
    return <div />;
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
    let subjects = this.state.mySubjects;

    if (this.state.activeTab === Tab.AllSubjects) {
      subjects = this.state.subjects;
    }

    if (!this.props.user) {
      subjects = this.state.categorySubjects;
    }

    if (this.state.isSearchingPage) {
      return (
        <React.Suspense fallback={<></>}>
          <MobileTheme />
          <PhoneSearchPage
            {...this.props}
            subjects={this.state.subjects as Subject[]}
            moveBack={() => {
              this.setState({ isSearchingPage: false });
              showZendesk();
            }}
          />
        </React.Suspense>
      );
    }

    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className="main-listing dashboard-page mobile-category phone-view-all">
          <PageHeadWithMenu
            page={PageEnum.ViewAll}
            user={this.props.user}
            toggleSearch={() => this.setState({ isSearchingPage: true })}
            placeholder="Search Ongoing Projects & Published Bricks…"
            history={this.props.history}
            search={() => { }}
            searching={() => { }}
          />
          <div className="mobile-scroll-bricks phone-top-bricks16x9">
            {this.renderMobileBricks()}
          </div>
          {this.props.user ? (
            <div className="ss-tabs-container">
              <div
                className={`ss-tab-1 ${this.state.activeTab === Tab.MySubjects ? "active" : ""
                  }`}
                onClick={this.setMySubjectsTab.bind(this)}
              >
                <SpriteIcon name="user-custom" />
                My Subjects
              </div>
              <div
                className={`ss-tab-2 ${this.state.activeTab === Tab.AllSubjects ? "active" : ""
                  }`}
                onClick={this.setAllSubjectsTab.bind(this)}
              >
                All Subjects
              </div>
            </div>
          ) : (
            <div className="ss-tabs-container">
              <div className="ss-tab-1 full active">
                <SpriteIcon
                  name="arrow-left"
                  onClick={() => this.props.history.push(map.SubjectCategories)}
                />
                {this.state.subjectGroup
                  ? SubjectGroupNames[this.state.subjectGroup]
                  : "Subject Category"}
              </div>
            </div>
          )}
          <div className="va-level-container">
            {this.renderAcademicLevel(AcademicLevel.First)}
            {this.renderAcademicLevel(AcademicLevel.Second)}
            {this.renderAcademicLevel(AcademicLevel.Third)}
            {this.renderAcademicLevel(AcademicLevel.Fourth)}
            <div className="va-difficult-help">
              <MobileHelp>
                <LevelHelpContent />
              </MobileHelp>
            </div>
          </div>
          <div className="va-bricks-container">
            {this.state.expandedSubject
              ? this.renderExpandedSubject()
              : this.renderSubjects(subjects)}
            {this.state.expandedBrick && (
              <PhoneExpandedBrick
                brick={this.state.expandedBrick}
                history={this.props.history}
                hide={() => this.setState({ expandedBrick: null })}
              />
            )}
          </div>
        </div>
      </React.Suspense>
    );
  }
}

export default connector(MobileCategoryPage);
