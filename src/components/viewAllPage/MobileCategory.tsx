import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
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
} from "model/brick";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from "redux/actions/brickActions";
import actions from "redux/actions/requestFailed";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import PhoneExpandedBrick from "./components/PhoneExpandedBrick";
import { toggleElement } from "./service/viewAll";
import routes from "components/play/routes";
import InfinityScrollCustom from "./InvinityScrollCustom";

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
  mySubjects: SubjectWithBricks[];
  subjects: SubjectWithBricks[];
  shown: boolean;
  activeTab: Tab;
  isLoading: boolean;
  expandedSubject: SubjectWithBricks | null;
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

    let initTab = Tab.MySubjects;
    if (!this.props.user) {
      initTab = Tab.SubjectCategory;
    }

    this.state = {
      expandedBrick: null,
      bricks: [],
      isLoading: true,
      expandedSubject: null,
      isCore: true,
      mySubjects: [],
      subjects: [],
      filterLevels: [],
      activeTab: initTab,
      shown: false,
    };

    this.loadData(subjectId);
  }

  addBrickBySubject(subjects: SubjectWithBricks[], brick: Brick, isCore: boolean) {
    if (brick.isCore !== isCore) {
      return;
    }
    const subject = subjects.find((s) => s.id === brick.subjectId);
    if (subject) {
    }
  }

  async loadData(subjectId: number | null) {
    const subjects = (await getSubjects()) as SubjectWithBricks[] | null;
    if (subjects) {
      const mySubjects: SubjectWithBricks[] = [];

      if (this.props.user) {
        for (let ss of this.props.user.subjects) {
          mySubjects.push({ ...ss });
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
      subject={s}
      setBrick={(b: Brick) => {
        if (this.props.user && this.checkAssignment(b)) {
          this.props.history.push(map.postAssignment(b.id, this.props.user.id));
        } else {
          this.props.history.push(routes.playBrief(b));
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
            <div className="back-arrow-container" onClick={() => this.setState({ expandedSubject: null })}>
              <SpriteIcon name="arrow-left" className="back-arrow-d33" />
              <div>Subject</div>
            </div>
            <div className="subjects-title-d33 subject-custom-d33">{subject.name}</div>
            <InfinityScrollCustom
              user={this.props.user}
              subject={subject}
              setBrick={(b: Brick) => {
                if (this.props.user && this.checkAssignment(b)) {
                  this.props.history.push(map.postAssignment(b.id, this.props.user.id));
                } else {
                  this.props.history.push(routes.playBrief(b));
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
                {this.state.mySubjects.map(subject => <Grid xs={6} className="subject-d33" onClick={() => this.expandSubject(subject)}>
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
