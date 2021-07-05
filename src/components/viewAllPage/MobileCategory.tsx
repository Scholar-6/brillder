import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { Swiper, SwiperSlide } from "swiper/react";
import queryString from "query-string";
import "swiper/swiper.scss";

import { AcademicLevel, AcademicLevelLabels, Brick, Subject, SubjectGroup, SubjectGroupNames } from "model/brick";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from "redux/actions/brickActions";
import actions from "redux/actions/requestFailed";
import { getAssignmentIcon } from "components/services/brickService";

import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getBrickColor } from "services/brick";
import { getPublicBricks, searchPublicBricks } from "services/axios/brick";
import routes from "components/play/routes";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import MobileHelp from "components/baseComponents/hoverHelp/MobileHelp";

const MobileTheme = React.lazy(() => import("./themes/ViewAllPageMobileTheme"));

enum Tab {
  MySubjects,
  AllSubjects,
  SubjectCategory
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
  bricks: Array<Brick>;
  searchString: string;
  isSearching: boolean;
  finalBricks: Brick[];
  isViewAll: boolean;
  mySubjects: SubjectWithBricks[];
  subjects: SubjectWithBricks[];
  categorySubjects: SubjectWithBricks[];
  subjectId: number;
  shown: boolean;
  activeTab: Tab;
  subjectGroup: SubjectGroup | null;
  filterLevels: AcademicLevel[];
}

class MobileCategoryPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    const values = queryString.parse(props.location.search);
    const searchString = (values.searchString as string) || "";
    if (
      !values.isViewAll &&
      !values.subjectId &&
      !values.searchString &&
      !this.props.isSearching &&
      !values.subjectGroup
    ) {
      //this.props.history.push(map.SubjectCategories);
    }

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

    let subjectId = -1;
    if (values.subjectId) {
      try {
        subjectId = parseInt(values.subjectId as string);
      } catch { }
    }

    let initTab = Tab.MySubjects;
    if (!this.props.user) {
      initTab = Tab.SubjectCategory;
    }

    this.state = {
      bricks: [],
      finalBricks: [],
      searchString: searchString,
      isSearching: this.props.isSearching ? this.props.isSearching : false,
      isViewAll,
      mySubjects: [],
      subjects: [],
      categorySubjects: [],
      subjectId,
      filterLevels: [],
      activeTab: initTab,
      subjectGroup,
      shown: false,
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
      let finalBricks = bricks;
      let mySubjects: SubjectWithBricks[] = [];
      let categorySubjects: SubjectWithBricks[] = [];

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

      if (this.state.subjectId > 0) {
        finalBricks = bricks.filter(
          (b) => b.subjectId === this.state.subjectId
        );
      }
      for (let brick of bricks) {
        this.addBrickBySubject(subjects, brick);
        this.addBrickBySubject(mySubjects, brick);
        this.addBrickBySubject(categorySubjects, brick);
      }
      this.setState({
        ...this.state,
        bricks,
        subjects,
        mySubjects,
        shown: true,
        finalBricks,
        categorySubjects
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

  moveToPlay(brickId: number) {
    this.props.history.push(routes.phonePrep(brickId));
  }

  move(brickId: number) {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen().then(() => {
        this.moveToPlay(brickId);
      });
    } else {
      this.moveToPlay(brickId);
    }
  }

  hideBricks() {
    const { finalBricks } = this.state;
    finalBricks.forEach((brick) => (brick.expanded = false));
  }

  handleClick(id: number) {
    const { finalBricks } = this.state;
    const brick = finalBricks.find((b) => b.id === id);
    if (brick) {
      const isExpanded = brick.expanded;
      finalBricks.forEach((brick) => (brick.expanded = false));
      brick.expanded = !isExpanded;
      this.setState({ ...this.state });
    }
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({
        ...this.state,
        searchString,
        finalBricks: this.state.bricks,
        isSearching: false,
      });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  async search() {
    const { searchString } = this.state;
    const bricks = await searchPublicBricks(searchString);
    if (bricks) {
      const { subjects } = this.state;
      this.clearBricks(subjects);
      for (let brick of bricks) {
        const subject = subjects.find((s) => s.id === brick.subjectId);
        if (subject) {
          subject.bricks.push(brick);
        }
      }
      this.setState({
        ...this.state,
        finalBricks: bricks,
        isSearching: true,
      });
    } else {
      this.props.requestFailed("Can`t get bricks");
    }
  }

  hide() {
    this.state.bricks.map((b) => (b.expanded = false));
    this.setState({ ...this.state });
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

  isLevelVisible(brick: Brick, levels: AcademicLevel[]) {
    if (levels.length > 0) {
      return !!levels.find(l => l === brick.academicLevel);
    }
    return true;
  }

  filterByLevel(level: AcademicLevel) {
    const { filterLevels } = this.state;
    let levels = filterLevels;
    const found = filterLevels.find((l) => l === level);
    if (found) {
      levels = filterLevels.filter((l) => l !== level);
    } else {
      filterLevels.push(level);
    }
    if (this.props.user) {
      const {subjects, mySubjects} = this.state;
      this.clearBricks(subjects);
      this.clearBricks(mySubjects);
      for (let brick of this.state.bricks) {
        if (this.isLevelVisible(brick, levels)) {
          this.addBrickBySubject(subjects, brick);
          this.addBrickBySubject(mySubjects, brick);
        }
      }
    } else {
      const {categorySubjects} = this.state;
      this.clearBricks(categorySubjects);
      for (let brick of this.state.bricks) {
        if (this.isLevelVisible(brick, levels)) {
          this.addBrickBySubject(categorySubjects, brick);
        }
      }
    }
    this.setState({filterLevels: levels});
  }

  renderExpandedBrick(brick: Brick) {
    let color = getBrickColor(brick);

    return (
      <ExpandedMobileBrick
        brick={brick}
        color={color}
        move={(brickId) => this.move(brickId)}
        hide={this.hide.bind(this)}
      />
    );
  }

  renderMobileBricks(expandedBrick: Brick | undefined) {
    if (this.state.finalBricks.length === 0) {
      return <div className="bricks-no-found bold">Sorry, no bricks found</div>;
    }
    if (expandedBrick) {
      return this.renderExpandedBrick(expandedBrick);
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

  renderBricks(s: any) {
    return (
      <div className="bricks-scroll-row">
        <div
          className="bricks-flex-row"
          style={{ width: s.bricks.length * 60 + 2 + "vw" }}
        >
          {s.bricks.map((b: any, i: number) => {
            const color = getBrickColor(b as Brick);
            return (
              <PhoneTopBrick16x9
                circleIcon=""
                brick={b}
                index={i}
                color={color}
              />
            );
          })}
        </div>
      </div>
    );
  }

  renderSubjects(ss: SubjectWithBricks[]) {
    return (
      <div>
        {ss.map((s, n) => (
          <div key={n}>
            <div className="gg-subject-name">{s.name}</div>
            {s.bricks.length > 0
              ? this.renderBricks(s)
              : this.renderEmptySubject()}
          </div>
        ))}
      </div>
    );
  }

  renderAcademicLevel(level: AcademicLevel) {
    const isActive = !!this.state.filterLevels.find(l => l === level);
    return (
      <div className={`va-round-level ${isActive ? 'active' : ''}`} onClick={() => this.filterByLevel(level)}>
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

    const expandedBrick = this.state.finalBricks.find(
      (b) => b.expanded === true
    );

    let pageClass =
      "main-listing dashboard-page mobile-category phone-view-all";
    if (expandedBrick) {
      pageClass += " expanded";
    }

    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className={pageClass}>
          <PageHeadWithMenu
            page={PageEnum.ViewAll}
            user={this.props.user}
            placeholder={"Search Ongoing Projects & Published Bricks…"}
            history={this.props.history}
            search={() => this.search()}
            searching={(v: string) => this.searching(v)}
          />
          <div className="mobile-scroll-bricks phone-top-bricks16x9">
            {this.renderMobileBricks(expandedBrick)}
          </div>
          {this.props.user ?
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
            :
            <div className="ss-tabs-container">
              <div className="ss-tab-1 active">
                {this.state.subjectGroup ? SubjectGroupNames[this.state.subjectGroup] : 'Subject Category'}
              </div>
            </div>
          }
          <div className="va-bricks-container">
            <div className="va-level-container">
              {this.renderAcademicLevel(AcademicLevel.First)}
              {this.renderAcademicLevel(AcademicLevel.Second)}
              {this.renderAcademicLevel(AcademicLevel.Third)}
              {this.renderAcademicLevel(AcademicLevel.Fourth)}
              <div className="va-difficult-help">
                <MobileHelp>
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
                </MobileHelp>
              </div>
            </div>
            {this.renderSubjects(subjects)}
          </div>
        </div>
      </React.Suspense>
    );
  }
}

export default connector(MobileCategoryPage);
