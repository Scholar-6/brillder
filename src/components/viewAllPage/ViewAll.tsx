import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from "query-string";
import { Route, Switch } from "react-router-dom";
import "swiper/swiper.scss";
import { isMobile } from "react-device-detect";
// @ts-ignore
import { Steps } from 'intro.js-react';

import brickActions from "redux/actions/brickActions";
import userActions from "../../redux/actions/user";
import { User } from "model/user";
import { Notification } from "model/notifications";
import {
  AcademicLevel,
  Author,
  Brick,
  BrickLengthEnum,
  KeyWord,
  Subject,
  SubjectGroup,
  SubjectGroupNames,
  SubjectItem,
} from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import {
  checkAdmin,
  getAssignmentIcon,
} from "components/services/brickService";
import {
  getPublicBricks,
  getPublishedBricks,
  searchBricks,
} from "services/axios/brick";
import { getSubjects } from "services/axios/subject";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import ViewAllFilter, { SortBy } from "./components/ViewAllFilter";
import ViewAllPagination from "./ViewAllPagination";
import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";
import BrickBlock16x9 from "./components/BrickBlock16x9";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { downKeyPressed, upKeyPressed } from "components/services/key";
import map from "components/map";
import NoSubjectDialog from "components/baseComponents/dialogs/NoSubjectDialog";
import { clearProposal } from "localStorage/proposal";
import CreateOneButton from "components/viewAllPage/components/CreateOneButton";
import RecommendButton from "components/viewAllPage/components/RecommendBuilderButton";
import SubjectCategoriesComponent from "./subjectCategories/SubjectCategories";

import {
  removeByIndex,
  sortByPopularity,
  sortByDate,
  sortAndFilterBySubject,
  getCheckedSubjects,
  prepareVisibleBricks,
  toggleSubject,
  renderTitle,
  sortAllBricks,
  countSubjectBricks,
  sortAndCheckSubjects,
  filterSearchBricks,
  getCheckedSubjectIds,
  onlyPrepareUserSubjects,
  countSubjectBricksV2,
  getSubjectsWithBricks,
  checkAllSubjects,
} from "./service/viewAll";
import {
  filterByCurretUser,
  filterByLevels,
  filterByLength,
  filterByCompetitions
} from "components/backToWorkPage/service";
import SubjectsColumn from "./allSubjectsPage/components/SubjectsColumn";
import MobileCategory from "./MobileCategory";
import { playCover } from "components/play/routes";
import { isPhone } from "services/phone";
import AddSubjectDialog from "components/baseComponents/dialogs/AddSubjectDialog";
import { addSubject } from "services/axios/user";
import PageLoaderBlue from "components/baseComponents/loaders/pageLoaderBlue";
import PhoneSearchPage from "./PhoneSearchPage";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import SearchSuggestions from "./components/SearchSuggestions";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";

interface ViewAllProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
  getUser(): Promise<any>;
  forgetBrick(): Promise<any>;
}

interface ViewAllState {
  bricks: Array<Brick>;
  searchBricks: Array<Brick>;
  searchString: string;
  searchTyping: boolean;
  isSearching: boolean;
  sortBy: SortBy;
  keywords: KeyWord[];

  filterCompetition: boolean;
  filterLevels: AcademicLevel[];
  filterLength: BrickLengthEnum[];
  subjects: SubjectItem[];
  userSubjects: Subject[];

  sortedIndex: number;
  finalBricks: Brick[];
  isLoading: boolean;

  isAllCategory: boolean;

  isSubjectPopupOpen: boolean;
  noSubjectOpen: boolean;
  activeSubject: SubjectItem;
  dropdownShown: boolean;
  deleteDialogOpen: boolean;
  deleteBrickId: number;

  subjectGroup: SubjectGroup | null;

  handleKey(e: any): void;

  isNewTeacher: boolean;
  stepsEnabled: boolean;
  teachSteps: any[];

  isClearFilter: any;
  failedRequest: boolean;
  pageSize: number;
  isAdmin: boolean;
  isCore: boolean;
  shown: boolean;
  isSearchBLoading: boolean;
  isAllSubjects: boolean;
  isViewAll: boolean;
  userIdSearch: number;

  // rezise and apect ratio based on those show 3, 2 or 1 column
  aspectRatio: number;
  resize(e: any): void;

  bricksRef: React.RefObject<any>;
  onBricksWheel(e: any): void;
}

const MobileTheme = React.lazy(() => import("./themes/ViewAllPageMobileTheme"));
const TabletTheme = React.lazy(() => import("./themes/ViewAllPageTabletTheme"));
const DesktopTheme = React.lazy(
  () => import("./themes/ViewAllPageDesktopTheme")
);

class ViewAllPage extends Component<ViewAllProps, ViewAllState> {
  constructor(props: ViewAllProps) {
    super(props);

    let isAdmin = false;
    if (props.user) {
      isAdmin = checkAdmin(props.user.roles);
    }

    const values = queryString.parse(props.location.search);
    const searchString = (values.searchString as string) || "";
    const isSubjectCategory =
      props.location.pathname.slice(-map.SubjectCategoriesPrefix.length) ===
      map.SubjectCategoriesPrefix;

    let userIdSearch = -1;
    if (values.searchUserId) {
      userIdSearch = parseInt(values.searchUserId as string);
    }


    if (
      !isSubjectCategory &&
      !values.isViewAll &&
      !values.mySubject &&
      !values.subjectId &&
      !values.searchString &&
      !values.subjectIds &&
      !values.subjectGroup &&
      !isPhone()
    ) {
      let link = map.SubjectCategories;
      if (values.newTeacher) {
        link += "?" + map.NewTeachQuery;
      }
      this.props.history.push(link);
    }

    let isViewAll = false;
    if (values.isViewAll) {
      isViewAll = true;
    }

    let isAllSubjects = true;
    if (values.mySubject) {
      isAllSubjects = false;
    }

    let isAllCategory = false;
    let subjectGroup = null;
    if (values.subjectGroup) {
      subjectGroup = parseInt(values.subjectGroup as string) as SubjectGroup;
      isAllCategory = true;
    }

    this.state = {
      bricks: [],
      sortBy: SortBy.Date,
      subjects: [],
      userSubjects: props.user ? Object.assign([], props.user.subjects) : [],
      sortedIndex: 0,

      isSubjectPopupOpen: false,
      noSubjectOpen: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,
      finalBricks: [],
      dropdownShown: false,
      searchBricks: [],
      searchString,
      searchTyping: false,
      activeSubject: {} as SubjectItem,
      isSearching: false,
      pageSize: this.getPageSize(),
      isLoading: true,
      subjectGroup,
      aspectRatio: this.getAspectRatio(),

      stepsEnabled: false,
      isNewTeacher: !!values.newTeacher,
      teachSteps: [{
        element: '.bricks-list',
        intro: `<p>Click a brick you would like to assign</p>`,
      }, {
        element: '.private-core-toggle',
        intro: `<p>Click on the key icon to view your personal catalogue and assign a brick you have published yourself</p>`,
      }, {
        element: '.private-core-toggle',
        intro: `<p>Click on the key icon to view your personal catalogue and assign a brick you have published yourself</p>`,
      }],
      isAllCategory,

      filterCompetition: false,
      filterLevels: [],
      filterLength: [],
      keywords: [],
      isClearFilter: false,
      failedRequest: false,
      isAdmin,
      isCore: true,
      shown: false,
      isSearchBLoading: false,
      isAllSubjects,
      isViewAll,
      userIdSearch,
      handleKey: this.handleKey.bind(this),
      resize: this.resize.bind(this),

      bricksRef: React.createRef<any>(),
      onBricksWheel: this.onBricksWheel.bind(this),
    };

    this.loadData(values);
  }

  // load bricks when notification come
  componentDidUpdate(prevProps: ViewAllProps) {
    const { notifications } = this.props;
    const oldNotifications = prevProps.notifications;
    if (notifications && oldNotifications) {
      if (notifications.length > oldNotifications.length) {
        this.loadBricks();
      }
    }
    this.addWheelListener();
  }

  onBricksWheel(e: any) {
    if (e.wheelDeltaY < 0) {
      this.moveAllNext();
    } else {
      this.moveAllBack();
    }
  }

  checkSubjectsWithBricks(subjects: SubjectItem[]) {
    subjects.forEach((s) => {
      if (this.state.isCore) {
        if (s.publicCount > 0) {
          s.checked = true;
        }
      } else {
        if (s.personalCount && s.personalCount > 0) {
          s.checked = true;
        }
      }
    });
  }

  addWheelListener() {
    const { current } = this.state.bricksRef;
    if (current) {
      current.addEventListener("wheel", this.state.onBricksWheel, false);
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
    window.addEventListener("resize", this.state.resize, false);
    
    this.addWheelListener();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
    window.removeEventListener("resize", this.state.resize, false);

    const { current } = this.state.bricksRef;
    if (current) {
      current.removeEventListener("wheel", this.state.onBricksWheel, false);
    }
  }

  async handleKey(e: any) {
    if (upKeyPressed(e)) {
      this.moveAllBack();
    } else if (downKeyPressed(e)) {
      this.moveAllNext();
    }
  }

  getAspectRatio() {
    return window.innerWidth / window.innerHeight;
  }

  getPageSize() {
    let pageSize = 6;
    const aspectRatio = this.getAspectRatio();
    if (aspectRatio < 1.5) {
      pageSize = 4;
    }
    if (aspectRatio < 1.05) {
      pageSize = 2;
    }
    return pageSize;
  }

  resize(e: any) {
    this.setState({pageSize: this.getPageSize(), aspectRatio: this.getAspectRatio()});
  }

  async loadData(values: queryString.ParsedQuery<string>) {
    await this.loadSubjects(values);

    if (values.searchString) {
      this.search();
    } else if (this.props.user) {
      this.loadBricks(values);
    } else {
      this.loadUnauthorizedBricks();
    }
  }

  /**
   * Load subject and check by query string
   */
  async loadSubjects(values: queryString.ParsedQuery<string>) {
    const subjects = (await getSubjects()) as SubjectItem[] | null;

    if (subjects) {
      sortAndCheckSubjects(subjects, values);
      this.setState({ ...this.state, subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }

  setSubjectGroup(sGroup: SubjectGroup) {
    for (const s of this.state.subjects) {
      s.checked = false;
    }
    this.setState({
      isLoading: true,
      isAllSubjects: true,
      isAllCategory: true,
      subjectGroup: sGroup,
    });
    this.loadUnauthorizedBricks();
  }

  async loadUnauthorizedBricks() {
    const bricks = await getPublicBricks();
    if (bricks) {
      const finalBricks = this.filter(bricks, this.state.isAllSubjects, true);
      const { subjects } = this.state;
      countSubjectBricks(subjects, bricks);
      subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
      this.setState({
        ...this.state,
        bricks,
        isLoading: false,
        finalBricks,
        shown: true,
      });
    } else {
      this.setState({ ...this.state, isLoading: false, failedRequest: true });
    }
  }

  collectKeywords(bricks: Brick[]) {
    let keywords: KeyWord[] = [];
    for (let brick of bricks) {
      if (brick.keywords && brick.keywords.length > 0) {
        for (let keyword of brick.keywords) {
          /*eslint-disable-next-line*/
          var found = keywords.find(k => k.id == keyword.id);
          if (!found) {
            keywords.push(keyword);
          }
        }
      }
    }
    return keywords;
  }

  async loadBricks(values?: queryString.ParsedQuery<string>) {
    if (this.props.user) {
      const bricks = await getPublishedBricks();
      if (bricks) {
        var keywords = this.collectKeywords(bricks);
        let bs = sortAllBricks(bricks);
        let finalBricks = this.filter(
          bs,
          this.state.isAllSubjects,
          this.state.isCore
        );
        let { subjects } = this.state;
        countSubjectBricksV2(subjects, bs, this.props.user, this.state.isAdmin);
        subjects.sort((s1, s2) => s2.publicCount - s1.publicCount);
        if (values && values.isViewAll) {
          this.checkSubjectsWithBricks(subjects);
          finalBricks = this.filter(
            bricks,
            this.state.isAllSubjects,
            this.state.isCore
          );
        }
        this.setState({
          ...this.state,
          subjects,
          bricks,
          keywords,
          isLoading: false,
          finalBricks,
          shown: true,
        });
      } else {
        this.setState({ ...this.state, isLoading: false, failedRequest: true });
      }
      setTimeout(() => {
        if (values) {
          let newTeacher = values.newTeacher as any;
          this.setState({ stepsEnabled: !!newTeacher });
        }
      }, 300);
    } else {
      this.setState({ isLoading: false });
    }
  }

  onIntroExit() {
    this.setState({ stepsEnabled: false });
  }

  onIntroChanged(e: any) {
    if (e >= 2) {
       this.setState({ stepsEnabled: false });
    }
  }

  delete(brickId: number) {
    removeByIndex(this.state.bricks, brickId);
    removeByIndex(this.state.finalBricks, brickId);
    removeByIndex(this.state.searchBricks, brickId);
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  moveToPlay(brick: Brick) {
    this.props.history.push(playCover(brick));
  }

  handleSortChange = (e: any) => {
    const { state } = this;
    const sortBy = parseInt(e.target.value) as SortBy;
    let { finalBricks } = this.state;
    if (sortBy === SortBy.Date) {
      finalBricks = sortByDate(finalBricks);
    } else if (sortBy === SortBy.Popularity) {
      finalBricks = sortByPopularity(finalBricks);
    }
    this.setState({ ...state, finalBricks, sortBy });
  };

  filterUnauthorized(
    bricks: Brick[],
    showAll?: boolean,
    levels?: AcademicLevel[],
    filterCompetition?: boolean
  ) {
    if (this.state.isSearching) {
      bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
    }

    let filterSubjects: any[] = [];
    if (this.state.subjectGroup) {
      const groupSubjects = this.state.subjects.filter(
        (s) => s.group === this.state.subjectGroup
      );
      filterSubjects = getCheckedSubjectIds(groupSubjects);

      if (showAll === true) {
        filterSubjects = this.state.subjects.map((s) => s.id);
      }
    }

    if (levels && levels.length > 0) {
      bricks = filterByLevels(bricks, levels);
    }

    if (filterCompetition) {
      bricks = filterByCompetitions(bricks);
    }

    if (filterSubjects.length > 0) {
      return sortAndFilterBySubject(bricks, filterSubjects);
    }
    return bricks;
  }

  filter(
    bricks: Brick[],
    isAllSubjects: boolean,
    isCore: boolean,
    showAll?: boolean,
    levels?: AcademicLevel[],
    filterLength?: BrickLengthEnum[],
    filterCompetition?: boolean,
  ) {
    if (this.state.isSearching) {
      bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
    }

    let filterSubjects: any[] = [];
    if (isAllSubjects) {
      filterSubjects = getCheckedSubjectIds(this.state.subjects);
    } else {
      const userSubjects = onlyPrepareUserSubjects(
        this.state.subjects,
        this.state.userSubjects
      );
      const isChecked = userSubjects.find((s) => s.checked === true);
      if (isChecked) {
        filterSubjects = getCheckedSubjectIds(userSubjects);
      } else {
        filterSubjects = userSubjects.map((s) => s.id);
      }
    }
    if (this.state.subjectGroup) {
      // unauthorized user see groups of subjects
      const groupSubjects = this.state.subjects.filter(
        (s) => s.group === this.state.subjectGroup
      );
      filterSubjects = groupSubjects.map((s) => s.id);
    }

    if (showAll === true) {
      filterSubjects = this.state.subjects.map((s) => s.id);
    }

    bricks = this.filterByCore(bricks, isCore);

    if (!isCore && !this.state.isAdmin) {
      bricks = filterByCurretUser(bricks, this.props.user.id);
    }

    if (levels && levels.length > 0) {
      bricks = filterByLevels(bricks, levels);
    }

    if (filterLength && filterLength.length > 0) {
      bricks = filterByLength(bricks, filterLength)
    }

    if (filterCompetition) {
      bricks = filterByCompetitions(bricks);
    }

    if (filterSubjects.length > 0) {
      return sortAndFilterBySubject(bricks, filterSubjects);
    }
    return bricks;
  }

  isFilterClear() {
    return this.state.subjects.some((r) => r.checked);
  }

  filterBySubject(id: number) {
    toggleSubject(this.state.subjects, id);
    toggleSubject(this.state.userSubjects, id);

    let checked = this.state.subjects.find((s) => s.checked === true);
    if (this.state.isAllSubjects && !checked) {
      //this.props.history.push(map.SubjectCategories + "?filter=true");
    }

    this.setState({ ...this.state, isViewAll: false, shown: false });
    setTimeout(() => {
      try {
        let finalBricks: Brick[] = [];
        if (this.props.user) {
          finalBricks = this.filter(
            this.state.bricks,
            this.state.isAllSubjects,
            this.state.isCore,
            false,
            this.state.filterLevels,
            this.state.filterLength,
            this.state.filterCompetition
          );
        } else {
          finalBricks = this.filterUnauthorized(
            this.state.bricks,
            this.state.isViewAll,
            this.state.filterLevels,
            this.state.filterCompetition
          );
        }
        this.setState({
          ...this.state,
          isClearFilter: this.isFilterClear(),
          finalBricks,
          shown: true,
        });
      } catch { }
    }, 1400);
  }

  filterByLevel(filterLevels: AcademicLevel[]) {
    this.setState({ filterLevels, shown: false });
    setTimeout(() => {
      try {
        let finalBricks: Brick[] = [];
        if (this.props.user) {
          finalBricks = this.filter(
            this.state.bricks,
            this.state.isAllSubjects,
            this.state.isCore,
            false,
            filterLevels,
            this.state.filterLength,
            this.state.filterCompetition
          );
        } else {
          finalBricks = this.filterUnauthorized(
            this.state.bricks,
            this.state.isViewAll,
            filterLevels,
            this.state.filterCompetition
          );
        }
        this.setState({
          ...this.state,
          isClearFilter: this.isFilterClear(),
          finalBricks,
          shown: true,
        });
      } catch { }
    }, 1400);
  }

  filterByCompetition() {
    let filterCompetition = !this.state.filterCompetition;
    this.setState({ filterCompetition, shown: false });
    setTimeout(() => {
      try {
        let finalBricks: Brick[] = [];
        if (this.props.user) {
          finalBricks = this.filter(
            this.state.bricks,
            this.state.isAllSubjects,
            this.state.isCore,
            false,
            this.state.filterLevels,
            this.state.filterLength,
            filterCompetition
          );
        } else {
          finalBricks = this.filterUnauthorized(
            this.state.bricks,
            this.state.isViewAll,
            this.state.filterLevels,
            filterCompetition
          );
        }
        this.setState({
          ...this.state,
          isClearFilter: this.isFilterClear(),
          finalBricks,
          shown: true,
        });
      } catch { }
    }, 1400);
  }

  filterByLength(filterLength: BrickLengthEnum[]) {
    this.setState({ filterLength, shown: false });
    setTimeout(() => {
      try {
        let finalBricks: Brick[] = [];
        if (this.props.user) {
          finalBricks = this.filter(
            this.state.bricks,
            this.state.isAllSubjects,
            this.state.isCore,
            false,
            this.state.filterLevels,
            filterLength,
            this.state.filterCompetition
          );
        } else {
          finalBricks = this.filterUnauthorized(
            this.state.bricks,
            this.state.isViewAll,
            this.state.filterLevels,
            this.state.filterCompetition
          );
        }
        this.setState({
          ...this.state,
          isClearFilter: this.isFilterClear(),
          finalBricks,
          shown: true,
        });
      } catch { }
    }, 1400);
  }

  checkUserSubject(s: Subject) {
    const found = this.state.userSubjects.find((s2) => s2.id === s.id);
    if (found) {
      s.checked = true;
    }
  }

  checkUserSubjects() {
    let { subjects } = this.state;
    if (this.state.isCore) {
      subjects.forEach((s) => {
        if (s.publicCount > 0) {
          this.checkUserSubject(s);
        } else {
          s.checked = false;
        }
      });
    } else {
      subjects.forEach((s) => {
        if (s.personalCount && s.personalCount > 0) {
          this.checkUserSubject(s);
        } else {
          s.checked = false;
        }
      });
    }
  }

  selectAllSubjects(isViewAll: boolean) {
    if (this.props.user) {
      if (isViewAll !== false) {
        checkAllSubjects(this.state.subjects, this.state.isCore);
        const finalBricks = this.filter(
          this.state.bricks,
          this.state.isAllSubjects,
          this.state.isCore,
          isViewAll
        );
        this.setState({
          isViewAll,
          finalBricks,
          isClearFilter: this.isFilterClear(),
        });
      }
    } else {
      for (let s of this.state.subjects) {
        s.checked = false;
      }
      const finalBricks = this.filterUnauthorized(
        this.state.bricks,
        isViewAll,
        this.state.filterLevels,
        this.state.filterCompetition
      );
      this.setState({
        isViewAll,
        finalBricks,
        isClearFilter: this.isFilterClear(),
      });
    }
  }

  selectUserSubjects(isViewAll: boolean) {
    if (this.props.user) {
      this.checkUserSubjects();
      const finalBricks = this.filter(
        this.state.bricks,
        this.state.isAllSubjects,
        this.state.isCore,
        undefined,
        this.state.filterLevels,
        this.state.filterLength,
        this.state.filterCompetition
      );
      this.setState({
        isViewAll,
        finalBricks,
        isClearFilter: this.isFilterClear(),
      });
    }
  }

  filterByAuthor(author: Author) {
    /*eslint-disable-next-line*/
    const searchBricks = this.state.bricks.filter(b => b.author.id == author.id);

    this.setState({
      ...this.state,
      isClearFilter: this.isFilterClear(),
      searchString: author.firstName + ' ' + author.lastName,
      searchBricks,
      finalBricks: searchBricks,
      shown: true,
      isLoading: false,
      searchTyping: false,
      isSearchBLoading: false,
      isSearching: true,
    });
  }

  filterSuggestionSubject(subject: Subject) {
    /*eslint-disable-next-line*/
    const searchBricks = this.state.bricks.filter(b => b.subject && b.subject.id == subject.id);

    this.setState({
      ...this.state,
      isClearFilter: this.isFilterClear(),
      searchString: subject.name,
      searchBricks,
      finalBricks: searchBricks,
      shown: true,
      isLoading: false,
      searchTyping: false,
      isSearchBLoading: false,
      isSearching: true,
    });
  }

  filterSuggestionKeyword(keyword: KeyWord) {
    const searchBricks = this.state.bricks.filter(b => {
      if (b.keywords && b.keywords.length > 0) {
        /*eslint-disable-next-line*/
        let found = b.keywords.find(k => k.id == keyword.id);
        if (found) {
          return true;
        }
      }
      return false;
    });

    this.setState({
      ...this.state,
      isClearFilter: this.isFilterClear(),
      searchString: keyword.name,
      searchBricks,
      finalBricks: searchBricks,
      shown: true,
      isLoading: false,
      searchTyping: false,
      isSearchBLoading: false,
      isSearching: true,
    });
  }

  filterByOneSubject(id: number) {
    this.state.subjects.forEach((s) => (s.checked = false));
    toggleSubject(this.state.subjects, id);
    toggleSubject(this.state.userSubjects, id);

    const finalBricks = this.filter(
      this.state.bricks,
      this.state.isAllSubjects,
      this.state.isCore
    );
    this.setState({
      ...this.state,
      isClearFilter: this.isFilterClear(),
      isViewAll: false,
      finalBricks,
      shown: true,
    });
  }

  viewAll() {
    this.checkSubjectsWithBricks(this.state.subjects);
    const finalBricks = this.filter(
      this.state.bricks,
      this.state.isAllSubjects,
      this.state.isCore
    );
    this.setState({ finalBricks, isViewAll: true });
  }

  clearSubjects = () => {
    const { state } = this;
    const { subjects, userSubjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    userSubjects.forEach((r: any) => (r.checked = false));
    this.setState({ ...state, isClearFilter: false });
  };

  moveAllBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({
        ...this.state,
        sortedIndex: index - this.state.pageSize,
      });
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    const { pageSize } = this.state;
    let bricks = this.state.finalBricks;

    if (this.state.isSearching) {
      bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
    }

    if (index + pageSize <= bricks.length - 1) {
      this.setState({
        ...this.state,
        sortedIndex: index + this.state.pageSize,
      });
    }
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  filterByCore(bricks: Brick[], isCore: boolean) {
    return isCore
      ? bricks.filter((b) => b.isCore === true)
      : bricks.filter((b) => b.isCore === false);
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      const finalBricks = this.filter(this.state.bricks, this.state.isAllSubjects, this.state.isCore, false, this.state.filterLevels, this.state.filterLength, true);

      this.setState({
        ...this.state,
        searchString,
        finalBricks,
        searchTyping: false,
        isSearching: false,
      });
    } else {
      this.setState({ ...this.state, searchTyping: true, searchString });
    }
  }

  showDropdown() {
    this.setState({ ...this.state, dropdownShown: true });
  }
  hideDropdown() {
    this.setState({ ...this.state, dropdownShown: false });
  }

  async search() {
    const { searchString } = this.state;
    this.setState({ shown: false, searchTyping: false, isSearchBLoading: true });
    let bricks = await searchBricks(searchString);

    setTimeout(() => {
      try {
        if (bricks) {
          const finalBricks = this.filter(
            bricks,
            this.state.isAllSubjects,
            this.state.isCore
          );
          this.setState({
            ...this.state,
            searchBricks: bricks,
            finalBricks,
            shown: true,
            isLoading: false,
            isSearchBLoading: false,
            isSearching: true,
          });
        } else {
          this.setState({
            ...this.state,
            isLoading: false,
            isSearchBLoading: false,
            failedRequest: true,
          });
        }
      } catch {
        this.setState({ isLoading: false, isSearchBLoading: false, failedRequest: true });
      }
    }, 1400);
  }

  renderSortedBricks(bricks: Brick[]) {
    const data = prepareVisibleBricks(
      this.state.sortedIndex,
      this.state.pageSize,
      bricks
    );
    return data.map((item) => {
      let circleIcon = "";
      if (this.props.user) {
        circleIcon = getAssignmentIcon(item.brick);
        if (item.brick.editor?.id === this.props.user.id) {
          circleIcon = "award";
        }
        if (item.brick.adaptedFrom) {
          circleIcon = "copy";
        }
      }

      let searchString = "";
      if (this.state.isSearching) {
        searchString = this.state.searchString;
      }

      return (
        <BrickBlock16x9
          isViewAll={true}
          brick={item.brick}
          index={item.index}
          row={item.row + 1}
          user={this.props.user}
          key={item.index}
          searchString={searchString}
          shown={this.state.shown}
          history={this.props.history}
          circleIcon={circleIcon}
          handleDeleteOpen={(brickId) => this.handleDeleteOpen(brickId)}
          isPlay={true}
        />
      );
    });
  }

  toggleCore() {
    const isCore = !this.state.isCore;
    this.setState({ isCore, shown: false, sortedIndex: 0 });
    setTimeout(() => {
      try {
        const finalBricks = this.filter(
          this.state.bricks,
          this.state.isAllSubjects,
          isCore
        );
        this.setState({ shown: true, finalBricks, sortedIndex: 0 });
      } catch { }
    }, 1400);
  }

  renderMainTitle(filterSubjects: number[]) {
    if (!this.props.user && this.state.subjectGroup) {
      return SubjectGroupNames[this.state.subjectGroup];
    }

    const renderName = (name: string) => {
      if (name[name.length - 1] === 's') {
        return `${name}'`;
      }
      return `${name}'s`;
    }

    if (filterSubjects.length === 1) {
      const subjectId = filterSubjects[0];
      const subject = this.state.subjects.find((s) => s.id === subjectId);
      return subject?.name;
    } else if (this.state.isViewAll) {
      return "All bricks";
    } else if (filterSubjects.length > 1) {
      return "Filtered";
    } else if (this.state.isSearching) {
      if (this.state.userIdSearch >= 1) {
        return renderName(this.state.searchString) + ' bricks';
      }
      return this.state.searchString;
    }

    if (this.state.isAllSubjects) {
      return "All subjects";
    }
    return "My Subjects";
  }

  async moveToCreateOne() {
    await this.props.forgetBrick();
    clearProposal();
    const filterSubjects = getCheckedSubjects(this.state.subjects);
    if (filterSubjects.length === 1) {
      const subjectId = filterSubjects[0].id;
      if (this.props.user) {
        const { subjects } = this.props.user;
        if (subjects) {
          for (let s of subjects) {
            if (s.id === subjectId) {
              clearProposal();
              this.props.history.push(
                map.ProposalSubjectLink + "?selectedSubject=" + subjectId
              );
            } else {
              this.setState({
                noSubjectOpen: true,
                activeSubject: filterSubjects[0],
              });
            }
          }
        }
      }
    } else {
      this.props.history.push(map.ProposalSubjectLink);
    }
  }


  renderNoBricks() {
    const subjects = getSubjectsWithBricks(this.state.subjects, this.props.user, this.state.isCore, this.state.isAllSubjects);

    return (
      <div className="bricks-list-container desktop-no-bricks">
        <div className="main-brick-container">
          <div className="centered text-theme-dark-blue title no-found">
            Sorry, no bricks found
          </div>
          <CreateOneButton onClick={this.moveToCreateOne.bind(this)} />
          <RecommendButton />
        </div>
        <div className="no-found-help-text">Try one of the following:</div>
        <SubjectsColumn
          subjects={subjects}
          viewAll={this.viewAll.bind(this)}
          onClick={(subjectId) => this.filterByOneSubject(subjectId)}
        />
      </div>
    );
  }

  renderFirstRow(bricks: Brick[]) {
    if (this.state.filterCompetition) {
      return (
        <div className="main-brick-container">
          <div className="centered text-theme-dark-blue title found">
            <div className="italic">
              Enter the competitions below for a chance to maximise your brills and earn cash prizes:
            </div>
            <div className="btn learn-more-btn-d3" onClick={() => {
               window.location.href="https://brillder.com/brilliant-minds-prizes/";
            }}>
              Learn more
            </div>
          </div>
        </div>
      );
    }
    if (bricks.length > 0) {
      return (
        <div className="main-brick-container">
          <div className="centered text-theme-dark-blue title found">
            {renderTitle(bricks)}
            <CreateOneButton onClick={this.moveToCreateOne.bind(this)} />
            {/*<RecommendButton />*/}
          </div>
        </div>
      );
    }
    return "";
  }

  renderDesktopBricksPanel(bricks: Brick[]) {
    if (!this.props.user) {
      if (bricks.length === 0) {
        return this.renderNoBricks();
      }
    }
    if (bricks.length === 0) {
      return this.renderNoBricks();
    }

    let className = 'bricks-list';
    if (this.state.pageSize === 4) {
      className += ' two-columns-t34';
    } else if (this.state.pageSize === 2) {
      className += ' one-column-t34';
    }

    return (
      <div
        className="bricks-list-container bricks-container-mobile"
        ref={this.state.bricksRef}
      >
        {this.renderFirstRow(bricks)}
        {this.state.isSearchBLoading && <div className="ffef-loader-container"> <PageLoaderBlue content="" /></div>}
        <div className={className}>{this.renderSortedBricks(bricks)}</div>
      </div>
    );
  }

  async addSubject(s: Subject) {
    const res = await addSubject(s.id);
    if (res) {
      this.setState({ isSubjectPopupOpen: false });
      const user = await this.props.getUser();
      if (user) {
        this.setState({ userSubjects: user.subjects });
      }
    }
  }

  renderDesktopBricks(bricks: Brick[]) {
    const filterSubjects = getCheckedSubjectIds(this.state.subjects);

    return (
      <div>
        <div
          className={`brick-row-title main-title ${filterSubjects.length === 1 && "subject-title"
            }`}
        >
          {this.renderMainTitle(filterSubjects)}
        </div>
        {this.props.user && (
          <PrivateCoreToggle
            isViewAll={true}
            isCore={this.state.isCore}
            onSwitch={() => this.toggleCore()}
          />
        )}
        {this.renderDesktopBricksPanel(bricks)}
        <ViewAllPagination
          pageSize={this.state.pageSize}
          sortedIndex={this.state.sortedIndex}
          bricksLength={bricks.length}
          moveAllNext={() => this.moveAllNext()}
          moveAllBack={() => this.moveAllBack()}
        />
      </div>
    );
  }


  renderDesktopViewAllPage(bricks: Brick[]) {
    return (
      <Grid container direction="row" className="sorted-row no-mobile-css">
        <ViewAllFilter
          user={this.props.user}
          sortBy={this.state.sortBy}
          subjects={this.state.subjects}
          userSubjects={this.state.userSubjects}
          subjectGroup={this.state.subjectGroup}
          isCore={this.state.isCore}
          isClearFilter={this.state.isClearFilter}
          isAllSubjects={this.state.isAllSubjects}
          isViewAll={this.state.isViewAll}
          isAllCategory={this.state.isAllCategory}
          selectAllSubjects={this.selectAllSubjects.bind(this)}
          selectUserSubjects={this.selectUserSubjects.bind(this)}
          setAllSubjects={(isAllSubjects) => {
            const finalBricks = this.filter(
              this.state.bricks,
              isAllSubjects,
              this.state.isCore,
              undefined,
              this.state.filterLevels,
              this.state.filterLength,
              this.state.filterCompetition
            );
            this.setState({ isAllSubjects, finalBricks, sortedIndex: 0 });
          }}
          openAddSubjectPopup={() =>
            this.setState({ isSubjectPopupOpen: true })
          }
          handleSortChange={(e) => this.handleSortChange(e)}
          clearSubjects={() => this.clearSubjects()}
          levels={this.state.filterLevels}
          filterByLevel={(lvs) => this.filterByLevel(lvs)}
          lengths={this.state.filterLength}
          filterByLength={lens => this.filterByLength(lens)}
          filterBySubject={(id) => this.filterBySubject(id)}
          filterCompetition={this.state.filterCompetition}
          filterByCompetition={this.filterByCompetition.bind(this)}
         />
        <Grid item xs={9} className="brick-row-container">
          {this.renderDesktopBricks(bricks)}
        </Grid>
      </Grid>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }

    const { user, history } = this.props;

    let bricks = this.state.finalBricks;

    if (isPhone()) {
      return (
        <React.Suspense fallback={<></>}>
          <MobileTheme />
          <div className="main-listing dashboard-page">
            <Switch>
              <Route exec path={map.SubjectCategories}>
                <SubjectCategoriesComponent
                  user={user}
                  subjects={this.state.subjects}
                  history={history}
                  location={this.props.location}
                  filterByOneSubject={this.filterByOneSubject.bind(this)}
                  setViewAll={() => this.setState({ isViewAll: true })}
                  setSubjectGroup={this.setSubjectGroup.bind(this)}
                  checkSubjectsWithBricks={() =>
                    this.checkSubjectsWithBricks(this.state.subjects)
                  }
                />
              </Route>
              <Route exec path={map.SearchPublishBrickPage}>
                <React.Suspense fallback={<></>}>
                  {isPhone() && <MobileTheme />}
                  <PhoneSearchPage
                    user={user} subjects={this.state.subjects}
                    history={history}
                    requestFailed={() => this.setState({ failedRequest: true })}
                  />
                </React.Suspense>
              </Route>
              <Route exec path={map.ViewAllPage}>
                <MobileCategory
                  history={history}
                  location={this.props.location}
                />
              </Route>
            </Switch>
            <DeleteBrickDialog
              isOpen={this.state.deleteDialogOpen}
              brickId={this.state.deleteBrickId}
              close={() => this.handleDeleteClose()}
              onDelete={(brickId) => this.delete(brickId)}
            />
            <FailedRequestDialog
              isOpen={this.state.failedRequest}
              close={() =>
                this.setState({ ...this.state, failedRequest: false })
              }
            />
            <NoSubjectDialog
              isOpen={this.state.noSubjectOpen}
              subject={this.state.activeSubject}
              history={history}
              close={() => this.setState({ noSubjectOpen: false })}
            />
            {this.state.isSubjectPopupOpen && (
              <AddSubjectDialog
                isOpen={this.state.isSubjectPopupOpen}
                userSubjects={this.state.userSubjects}
                success={this.addSubject.bind(this)}
                close={() => this.setState({ isSubjectPopupOpen: false })}
              />
            )}
          </div>
        </React.Suspense>
      );
    }

    if (this.state.isSearching) {
      bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
    }

    let className = 'main-listing dashboard-page';
    if (this.state.pageSize === 4) {
      className += ' two-columns-inside';
    } else if (this.state.pageSize === 2) {
      className += ' one-column-inside';
    }

    return (
      <React.Suspense fallback={<></>}>
        {isMobile ? <TabletTheme /> : <DesktopTheme />}
        <div className={className}>
          {this.state.searchTyping === true && this.state.searchString.length >= 1 && <SearchSuggestions
            history={this.props.history} subjects={this.state.subjects}
            searchString={this.state.searchString} bricks={this.state.bricks}
            keywords={this.state.keywords}
            filterByAuthor={this.filterByAuthor.bind(this)}
            filterBySubject={this.filterSuggestionSubject.bind(this)}
            filterByKeyword={this.filterSuggestionKeyword.bind(this)}
          />}
          <div>
            <PageHeadWithMenu
              page={PageEnum.ViewAll}
              user={user}
              placeholder="Subjects, Topics, Titles & more"
              history={history}
              search={() => this.search()}
              searching={this.searching.bind(this)}
            />
            <Switch>
              <Route exec path={map.SubjectCategories}>
                <SubjectCategoriesComponent
                  user={user}
                  subjects={this.state.subjects}
                  history={history}
                  location={this.props.location}
                  filterByOneSubject={this.filterByOneSubject.bind(this)}
                  setViewAll={() => this.setState({ isViewAll: true })}
                  setSubjectGroup={this.setSubjectGroup.bind(this)}
                  checkSubjectsWithBricks={() =>
                    this.checkSubjectsWithBricks(this.state.subjects)
                  }
                />
              </Route>
              <Route exec path={map.ViewAllPage}>
                {this.renderDesktopViewAllPage(bricks)}
              </Route>
            </Switch>
          </div>
          <DeleteBrickDialog
            isOpen={this.state.deleteDialogOpen}
            brickId={this.state.deleteBrickId}
            close={() => this.handleDeleteClose()}
            onDelete={(brickId) => this.delete(brickId)}
          />
          <FailedRequestDialog
            isOpen={this.state.failedRequest}
            close={() => this.setState({ ...this.state, failedRequest: false })}
          />
          <NoSubjectDialog
            isOpen={this.state.noSubjectOpen}
            subject={this.state.activeSubject}
            history={history}
            close={() => this.setState({ noSubjectOpen: false })}
          />
          {this.state.isSubjectPopupOpen && (
            <AddSubjectDialog
              isOpen={this.state.isSubjectPopupOpen}
              userSubjects={this.state.userSubjects}
              success={this.addSubject.bind(this)}
              close={() => this.setState({ isSubjectPopupOpen: false })}
            />
          )}
        </div>
        <ClassInvitationDialog />
        <ClassTInvitationDialog />
        {this.state.isNewTeacher &&
          <Steps
            enabled={this.state.stepsEnabled}
            steps={this.state.teachSteps}
            initialStep={0}
            onChange={this.onIntroChanged.bind(this)}
            onExit={this.onIntroExit.bind(this)}
            onComplete={() => { }}
          />}
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications,
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
});

export default connect(mapState, mapDispatch)(ViewAllPage);
