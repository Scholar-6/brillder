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
  getPublishedBricksByPage,
  getUnauthPublishedBricksByPage,
  searchPaginateBricks,
} from "services/axios/brick";
import { getSubjects } from "services/axios/subject";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
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
  sortAndFilterBySubject,
  getCheckedSubjects,
  prepareVisibleBricks2,
  toggleSubject,
  renderTitle,
  sortAndCheckSubjects,
  filterSearchBricks,
  getCheckedSubjectIds,
  getSubjectsWithBricks,
  checkAllSubjects,
} from "./service/viewAll";
import {
  filterByLevels,
  filterByCompetitions
} from "components/backToWorkPage/service";
import SubjectsColumn from "./allSubjectsPage/components/SubjectsColumn";
import { playCover } from "components/play/routes";
import { isPhone } from "services/phone";
import AddSubjectDialog from "components/baseComponents/dialogs/AddSubjectDialog";
import { addSubject } from "services/axios/user";
import PageLoaderBlue from "components/baseComponents/loaders/pageLoaderBlue";
import PhoneSearchPage from "./PhoneSearchPage";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import SearchSuggestions from "./components/SearchSuggestions";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";
import MobileCategory from "./MobileCategory";
import SpriteIcon from "components/baseComponents/SpriteIcon";

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

  isLoading: boolean;

  isAllCategory: boolean;

  isSubjectPopupOpen: boolean;
  noSubjectOpen: boolean;
  activeSubject: SubjectItem;
  dropdownShown: boolean;

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

  bricksCount: number;
  page: number;

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

    if (!this.props.user) {
      if (!values.subjectGroup) {
        this.props.history.push(map.SubjectCategories);
      }
    }

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
      bricksCount: 0,
      page: 0,

      isSubjectPopupOpen: false,
      noSubjectOpen: false,
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
        intro: `<p>You can browse our catalogue here to select a brick to assign</p>`,
      }, {
        element: '.private-core-toggle',
        intro: `<p>Click on the key icon to view your personal catalogue and assign a brick you have created yourself</p>`,
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
    this.setState({ pageSize: this.getPageSize(), aspectRatio: this.getAspectRatio() });
  }

  async loadData(values: queryString.ParsedQuery<string>) {
    await this.loadSubjects(values);

    if (values.searchString) {
      this.search();
    } else if (this.props.user) {
      if (this.state.subjectGroup) {
        this.loadUnauthorizedBricks(this.state.subjectGroup);
      } else {
        this.loadBricks(values);
      }
    } else {
      if (this.state.subjectGroup) {
        this.loadUnauthorizedBricks(this.state.subjectGroup);
      } else {
        this.setState({
          isLoading: false
        });
      }
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
    this.loadUnauthorizedBricks(sGroup);
  }

  async loadUnauthorizedBricks(sGroup: SubjectGroup) {
    this.loadAndSetUnauthBricks(0, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, sGroup);
  }

  async loadBricks(values?: queryString.ParsedQuery<string>) {
    if (this.props.user) {
      let subjectIds: number[] = [];
      if (this.state.isAllSubjects == false) {
        subjectIds = this.props.user.subjects.map(s => s.id);
      }
      const pageBricks = await getPublishedBricksByPage(
        this.state.pageSize, this.state.page, true,
        [], [], subjectIds,
        this.state.filterCompetition, this.state.isAllSubjects
      );
      if (pageBricks) {
        let { subjects } = this.state;

        for (let subject of pageBricks.subjects) {
          const filterSubject = subjects.find(s => s.id === subject.id);
          if (filterSubject) {
            filterSubject.personalCount = subject.count;
            filterSubject.publicCount = subject.count;
          }
        }
        if (values && values.isViewAll) {
          this.checkSubjectsWithBricks(subjects);
        }

        this.setState({
          ...this.state,
          subjects,
          bricksCount: pageBricks.pageCount,
          bricks: pageBricks.bricks,
          isLoading: false,
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

  async loadAndSetBricks(
    page: number,
    isCore: boolean,
    levels: AcademicLevel[],
    length: BrickLengthEnum[],
    filterCompetition: boolean,
    isAllSubjects: boolean
  ) {
    let subjectIds = this.getSubjectIds();

    if (isAllSubjects === false) {
      if (subjectIds.length === 0) {
        subjectIds = this.props.user.subjects.map(s => s.id);
      } else {
        // get only user subject ids
        let tempSubjectIds: number[] = [];
        for (let sId of subjectIds) {
          const found = this.props.user.subjects.find(s => s.id == sId);
          if (found) {
            tempSubjectIds.push(sId);
          }
        }
        if (tempSubjectIds.length === 0) {
          subjectIds = this.props.user.subjects.map(s => s.id);
        } else {
          subjectIds = tempSubjectIds;
        }
      }
    }

    const pageBricks = await getPublishedBricksByPage(this.state.pageSize, page, isCore, levels, length, subjectIds, filterCompetition, isAllSubjects);

    if (pageBricks) {
      const { subjects } = this.state;
      for (let subject of pageBricks.subjects) {
        const filterSubject = subjects.find(s => s.id === subject.id);
        if (filterSubject) {
          filterSubject.personalCount = subject.count;
          filterSubject.publicCount = subject.count;
        }
      }

      this.setState({
        ...this.state,
        page,
        bricksCount: pageBricks.pageCount,
        bricks: pageBricks.bricks,
        isCore,
        subjects,
        filterLength: length,
        filterLevels: levels,
        isClearFilter: this.isFilterClear(),
        isLoading: false,
        isSearching: false,
        isAllSubjects,
        shown: true
      });
    }
  }

  async loadAndSetUnauthBricks(
    page: number,
    levels: AcademicLevel[],
    length: BrickLengthEnum[],
    filterCompetition: boolean,
    sGroup: SubjectGroup
  ) {
    const subjectIds = this.getSubjectIds();
    const pageBricks = await getUnauthPublishedBricksByPage(this.state.pageSize, page, levels, length, subjectIds, filterCompetition, sGroup);

    let { subjects } = this.state;

    if (pageBricks) {
      for (let subject of pageBricks.subjects) {
        const filterSubject = subjects.find(s => s.id === subject.id);
        if (filterSubject) {
          filterSubject.personalCount = subject.count;
          filterSubject.publicCount = subject.count;
        }
      }
    }

    if (pageBricks) {
      this.setState({
        ...this.state,
        subjects,
        page,
        bricksCount: pageBricks.pageCount,
        bricks: pageBricks.bricks,
        filterLength: length,
        filterLevels: levels,
        isClearFilter: this.isFilterClear(),
        isLoading: false,
        shown: true
      });
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

  moveToPlay(brick: Brick) {
    this.props.history.push(playCover(brick));
  }

  handleSortChange = (e: any) => {
    const { state } = this;
    const sortBy = parseInt(e.target.value) as SortBy;
    this.setState({ ...state, sortBy });
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

  isFilterClear() {
    return this.state.subjects.some((r) => r.checked);
  }

  getSubjectIds() {
    let subjectIds: number[] = [];
    const checked = this.state.subjects.find(s => s.checked === true);
    if (checked) {
      const checkedSubjects = this.state.subjects.filter(s => s.checked === true);
      subjectIds = checkedSubjects.map(s => s.id);
    }
    return subjectIds;
  }

  filterBySubject(id: number) {
    toggleSubject(this.state.subjects, id);
    toggleSubject(this.state.userSubjects, id);

    if (this.state.subjectGroup) {
      this.loadAndSetUnauthBricks(0, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.subjectGroup);
    } else if (this.props.user) {
      this.loadAndSetBricks(0, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.isAllSubjects);
    }

    this.setState({ ...this.state, isViewAll: false, shown: false });
    setTimeout(() => {
      try {
        if (this.props.user) {

        } else {
          // no subjects here
        }
        this.setState({
          ...this.state,
          isClearFilter: this.isFilterClear(),
          shown: true,
        });
      } catch { }
    }, 1400);
  }

  filterByLevel(filterLevels: AcademicLevel[]) {
    this.setState({ filterLevels, shown: false });
    setTimeout(() => {
      try {
        if (this.state.subjectGroup) {
          this.loadAndSetUnauthBricks(0, filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.subjectGroup);
        } else if (this.props.user) {
          this.loadAndSetBricks(0, this.state.isCore, filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.isAllSubjects);
        }
      } catch { }
    }, 1400);
  }

  filterByCompetition() {
    let filterCompetition = !this.state.filterCompetition;
    this.setState({ filterCompetition, shown: false });
    setTimeout(() => {
      try {
        if (this.state.subjectGroup) {
          this.loadAndSetUnauthBricks(0, this.state.filterLevels, this.state.filterLength, filterCompetition, this.state.subjectGroup);
        } else if (this.props.user) {
          this.loadAndSetBricks(0, this.state.isCore, this.state.filterLevels, this.state.filterLength, filterCompetition, this.state.isAllSubjects);
        }
      } catch { }
    }, 1400);
  }

  filterByLength(filterLength: BrickLengthEnum[]) {
    this.setState({ filterLength, shown: false });
    setTimeout(() => {
      try {
        if (this.state.subjectGroup) {
          this.loadAndSetUnauthBricks(0, this.state.filterLevels, filterLength, this.state.filterCompetition, this.state.subjectGroup);
        } else {
          this.loadAndSetBricks(0, this.state.isCore, this.state.filterLevels, filterLength, this.state.filterCompetition, this.state.isAllSubjects);
        }
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
    if (this.state.subjectGroup) {
      checkAllSubjects(this.state.subjects, this.state.isCore);
      this.loadAndSetUnauthBricks(0, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.subjectGroup);
    }
    if (this.props.user) {
      checkAllSubjects(this.state.subjects, this.state.isCore);
      this.loadAndSetBricks(0, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, true);
    } else {
      for (let s of this.state.subjects) {
        s.checked = false;
      }
      this.loadAndSetBricks(0, true, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, true);
    }
    this.setState({
      isViewAll,
      isClearFilter: this.isFilterClear(),
    });
  }

  selectUserSubjects(isViewAll: boolean) {
    if (this.state.subjectGroup) {
      this.checkUserSubjects();
      this.loadAndSetUnauthBricks(0, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.subjectGroup);
      this.setState({
        isViewAll,
        isClearFilter: this.isFilterClear(),
      });
    }
    if (this.props.user) {
      this.checkUserSubjects();
      this.loadAndSetBricks(0, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.isAllSubjects);
      this.setState({
        isViewAll,
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
      shown: true,
      isLoading: false,
      searchTyping: false,
      isSearchBLoading: false,
      isSearching: true,
    });
  }

  filterSuggestionSubject(subject: Subject) {
    toggleSubject(this.state.subjects, subject.id);
    toggleSubject(this.state.userSubjects, subject.id);

    this.loadAndSetBricks(0, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.isAllSubjects);

    this.setState({
      ...this.state,
      isClearFilter: this.isFilterClear(),
      searchString: subject.name,
      isSearching: true,
    });
  }

  filterSuggestionKeyword(keyword: KeyWord) {
    this.loadAndSetSearchBricks(keyword.name, 0, this.state.pageSize, this.state.isCore);

    this.setState({
      ...this.state,
      isClearFilter: this.isFilterClear(),
      searchString: keyword.name,
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

    this.setState({
      ...this.state,
      isClearFilter: this.isFilterClear(),
      isViewAll: false,
      shown: true,
    });
  }

  viewAll() {
    this.checkSubjectsWithBricks(this.state.subjects);
    this.setState({ isViewAll: true });
  }

  clearSubjects = () => {
    const { state } = this;
    const { subjects, userSubjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    userSubjects.forEach((r: any) => (r.checked = false));
    this.setState({ ...state, isClearFilter: false });
  };

  moveAllBack() {
    let index = this.state.page * this.state.pageSize;

    if (index >= this.state.pageSize) {
      if (this.state.isSearching) {
        this.loadAndSetSearchBricks(this.state.searchString, this.state.page - 1, this.state.pageSize, this.state.isCore);
      } else {
        if (this.state.subjectGroup) {
          this.loadAndSetUnauthBricks(this.state.page - 1, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.subjectGroup);
        } else if (this.props.user) {
          this.loadAndSetBricks(this.state.page - 1, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.isAllSubjects);
        }
      }
    }
  }

  moveAllNext() {
    let index = this.state.page * this.state.pageSize;
    const { pageSize, bricksCount } = this.state;

    if (index + pageSize <= bricksCount - 1) {
      if (this.state.isSearching) {
        this.loadAndSetSearchBricks(this.state.searchString, this.state.page + 1, this.state.pageSize, this.state.isCore);
      } else {
        if (this.state.subjectGroup) {
          this.loadAndSetUnauthBricks(this.state.page + 1, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.subjectGroup);
        } else if (this.props.user) {
          this.loadAndSetBricks(this.state.page + 1, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.isAllSubjects);
        }
      }
    }
  }

  searching(searchString: string) {
    if (searchString.length === 0) {

      this.setState({
        ...this.state,
        searchString,
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

  async loadAndSetSearchBricks(searchString: string, page: number, pageSize: number, isCore: boolean) {
    let pageBricks = await searchPaginateBricks(searchString, page, pageSize, isCore);

    if (pageBricks && pageBricks.bricks.length >= 0) {
      this.setState({
        ...this.state,
        page,
        bricks: pageBricks.bricks,
        bricksCount: pageBricks.pageCount,
        searchBricks: pageBricks.bricks,
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
  }

  async search() {
    const { searchString } = this.state;
    this.setState({ shown: false, searchTyping: false, isSearchBLoading: true });

    setTimeout(() => {
      try {
        this.loadAndSetSearchBricks(searchString, 0, this.state.pageSize, this.state.isCore);
      } catch {
        this.setState({ isLoading: false, isSearchBLoading: false, failedRequest: true });
      }
    }, 1400);
  }

  renderSortedBricks() {
    const data = prepareVisibleBricks2(this.state.bricks);
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
          isPlay={true}
        />
      );
    });
  }

  toggleCore() {
    const isCore = !this.state.isCore;
    this.setState({ isCore, shown: false, page: 0 });
    setTimeout(() => {
      this.loadAndSetBricks(0, isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.isAllSubjects);
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
      if (this.state.subjectGroup) {
        return SubjectGroupNames[this.state.subjectGroup];
      }
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
              window.location.href = "https://brillder.com/brilliant-minds-prizes/";
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
            {renderTitle(this.state.bricksCount)}
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
        <div className={className}>{this.renderSortedBricks()}</div>
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

  renderDesktopBricks() {
    const filterSubjects = getCheckedSubjectIds(this.state.subjects);

    return (
      <div>
        <div
          className={`brick-row-title main-title ${filterSubjects.length === 1 && "subject-title"}`}
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
        {this.renderDesktopBricksPanel(this.state.bricks)}
        <ViewAllPagination
          pageSize={this.state.pageSize}
          sortedIndex={this.state.page * this.state.pageSize}
          bricksLength={this.state.bricksCount}
          moveAllNext={() => this.moveAllNext()}
          moveAllBack={() => this.moveAllBack()}
        />
      </div>
    );
  }


  renderDesktopViewAllPage() {
    return (
      <Grid container direction="row" className="sorted-row no-mobile-css">
        {!this.props.user && this.state.subjectGroup && <div className="categories-absolute">
          <div>
            <div className="category" onClick={() => {
              this.props.history.push(map.SubjectCategories);
            }}>Categories</div>
            <div>
              <SpriteIcon name="arrow-right" />
            </div>
            <div>{SubjectGroupNames[this.state.subjectGroup]}</div>
          </div>
        </div>}
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
            if (this.state.subjectGroup) {
              this.loadAndSetUnauthBricks(0, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.subjectGroup);
            } else {
              this.loadAndSetBricks(0, this.state.isCore, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, isAllSubjects);
            }
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
          {this.renderDesktopBricks()}
        </Grid>
      </Grid>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
    }

    const { user, history } = this.props;

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
      //bricks = filterSearchBricks(this.state.searchBricks, this.state.isCore);
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
                {this.renderDesktopViewAllPage()}
              </Route>
            </Switch>
          </div>
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
            options={{
              doneLabel: 'Next'
            }}
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

