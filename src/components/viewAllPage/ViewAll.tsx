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
import subjectActions from "redux/actions/subject";
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
import searchActions from "redux/actions/search";

import {
  getCheckedSubjects,
  prepareVisibleBricks2,
  toggleSubject,
  renderTitle,
  getCheckedSubjectIds,
  getSubjectsWithBricks,
  checkAllSubjects,
  getSubjectIdsFromUrl,
} from "./service/viewAll";
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
import PersonalBrickInvitationDialog from "components/baseComponents/classInvitationDialog/PersonalBrickInvitationDialog";
import SharePersonalBrickButton from "./components/SharePersonalBrickButton";
import { ClassroomApi, getClassById } from "components/teach/service";
import BottomAssignmentPopup from "components/play/BottomAssignmentPopup";
import AssignPopupHint from "./components/AssignPopupHint";

interface ViewAllProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
  getUser(): Promise<any>;
  forgetBrick(): Promise<any>;

  subjects: Subject[];
  getSubjects(): Subject[] | null;
  clearSearch(): void;
}

interface ViewAllState {
  bricks: Array<Brick>;
  searchBricks: Array<Brick>;
  searchString: string;
  searchTyping: boolean;
  isSearching: boolean;
  sortBy: SortBy;
  keywords: KeyWord[];

  assignPopupOpen: boolean;
  assignPopupClossingAnimation: boolean;
  assignClassroom: ClassroomApi | null;
  assigningBricks: boolean;
  onlyAssignBricks: boolean;

  isKeywordSearch: boolean;

  filterCompetition: boolean;
  filterLevels: AcademicLevel[];
  filterLength: BrickLengthEnum[];
  userSubjects: Subject[];

  isLoading: boolean;

  isAllCategory: boolean;

  isSubjectPopupOpen: boolean;
  noSubjectOpen: boolean;
  activeSubject: Subject;

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

  subjects: Subject[];

  bricksCount: number;
  page: number;

  // rezise and apect ratio based on those show 3, 2 or 1 column
  aspectRatio: number;
  resize(e: any): void;

  bricksRef: React.RefObject<any>;
}

const MobileTheme = React.lazy(() => import("./themes/ViewAllPageMobileTheme"));
const TabletTheme = React.lazy(() => import("./themes/ViewAllPageTabletTheme"));
const DesktopTheme = React.lazy(() => import("./themes/ViewAllPageDesktopTheme"));

class ViewAllPage extends Component<ViewAllProps, ViewAllState> {
  static animationTimeout = 600;

  constructor(props: ViewAllProps) {
    super(props);

    let isAdmin = false;
    if (props.user) {
      isAdmin = checkAdmin(props.user.roles);
    }

    const values = queryString.parse(props.location.search);

    const searchString = (values.searchString as string) || "";

    let userIdSearch = -1;
    if (values.searchUserId) {
      userIdSearch = parseInt(values.searchUserId as string, 10);
    }

    let filterLength: BrickLengthEnum[] = [];
    if (values.length) {
      try {
        filterLength = (values.length as string).split(',').map(a => parseInt(a));
      } catch { }
    }

    let sortBy = SortBy.Date;
    if (values.sortBy) {
      sortBy = parseInt((values.sortBy as string));
    }

    let filterLevels: AcademicLevel[] = [];
    if (values.level) {
      try {
        filterLevels = (values.level as string).split(',').map(a => parseInt(a));
      } catch { }
    }

    let page = 0;
    if (values.page) {
      page = parseInt(values.page as string, 10);
    }

    let isViewAll = false;
    if (values.isViewAll) {
      isViewAll = true;
    }

    let isAllSubjects = true;
    if (values.mySubject === 'true') {
      isAllSubjects = false;
    }

    let isAllCategory = false;
    let subjectGroup = null;
    if (values.subjectGroup) {
      subjectGroup = parseInt(values.subjectGroup as string) as SubjectGroup;
      isAllCategory = true;
    }

    let onlyAssignBricks = false;

    if (values["only-bricks"]) {
      onlyAssignBricks = true;
    }

    this.state = {
      bricks: [],
      sortBy,
      userSubjects: props.user ? Object.assign([], props.user.subjects) : [],
      bricksCount: 0,
      page,
      assignPopupOpen: false,
      assignPopupClossingAnimation: false,
      assigningBricks: false,
      assignClassroom: null,
      onlyAssignBricks,

      isSubjectPopupOpen: false,
      noSubjectOpen: false,
      searchBricks: [],
      searchString,
      searchTyping: false,
      isKeywordSearch: false,
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
      filterLevels,
      filterLength,
      subjects: props.subjects,
      keywords: [],
      isClearFilter: false,
      failedRequest: false,
      isAdmin,
      isCore: values.personal ? false : true,
      shown: false,
      isSearchBLoading: false,
      isAllSubjects,
      isViewAll,
      userIdSearch,
      handleKey: this.handleKey.bind(this),
      resize: this.resize.bind(this),

      bricksRef: React.createRef<any>(),
    };

    this.loadInitData(values);
  }

  async loadInitData(values: queryString.ParsedQuery<string>) {
    let subjects = this.props.subjects;
    if (subjects.length == 0) {
      let subjectsNew = await this.props.getSubjects();
      if (subjectsNew) {
        subjects = subjectsNew;
        this.setState({ subjects });
      }
    }

    let subjectIds = getSubjectIdsFromUrl(values);

    if (subjectIds && subjectIds.length > 0) {
      for (let subjectId of subjectIds) {
        const subject = subjects.find(s => s.id == subjectId);
        if (subject) {
          subject.checked = true;
        }
      }
    }

    this.loadData(values);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
    window.addEventListener("resize", this.state.resize, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
    window.removeEventListener("resize", this.state.resize, false);
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
    if (values.searchString) {
      let page = 0;
      if (values.page) {
        page = parseInt(values.page as string, 10);
      }
      this.search(page);
    } else if (this.props.user) {
      this.loadBricks(values);
    } else {
      if (this.state.subjectGroup) {
        this.loadUnauthorizedBricks(this.state.subjectGroup);
      } else {
        this.loadUnauthorizedBricks();
      }
    }
  }

  async setStateAndAssignClassroom(state: any, queryValues: queryString.ParsedQuery<string>) {
    let assignValue = queryValues['assigning-bricks'];
    const classroomId = assignValue ? parseInt(assignValue as string) : -1;

    if (classroomId > 0) {
      const assignClassroom = await getClassById(classroomId);
      if (assignClassroom) {
        state.assignClassroom = assignClassroom;
        state.assignPopupOpen = assignValue ? true : false;
      }
    }
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

  async loadUnauthorizedBricks(sGroup?: SubjectGroup) {
    const { state } = this;
    this.loadAndSetUnauthBricks(
      0, state.filterLevels, state.filterLength,
      state.filterCompetition, state.sortBy, sGroup
    );
  }

  async loadBricks(values: queryString.ParsedQuery<string>) {
    if (this.props.user) {
      let subjectIds: number[] = [];
      let { state } = this;
      if (state.isAllSubjects == false) {
        subjectIds = this.props.user.subjects.map(s => s.id);
      } else {
        let checked = getSubjectIdsFromUrl(values);
        if (checked && checked.length > 0) {
          subjectIds = checked;
        }
      }

      subjectIds = this.state.subjects.filter(s => s.checked === true).map(s => s.id);
      if (!isPhone()) {
        const pageBricks = await getPublishedBricksByPage(
          state.pageSize, state.page, (values && values.personal) ? false : true,
          state.filterLevels, state.filterLength, subjectIds,
          state.filterCompetition, this.state.subjectGroup, state.sortBy
        );
        if (pageBricks) {
          this.state.subjects.map(s1 => {
            s1.viewAllCount = 0;
            pageBricks.res && pageBricks.res.map(s => {
              if (s.brick_subjectId === s1.id) {
                s1.viewAllCount = parseInt(s.count);
              }
            });
          });

          if (values) {
            await this.setStateAndAssignClassroom(state, values);
          }

          this.setState({
            ...state,
            bricksCount: pageBricks.pageCount,
            bricks: pageBricks.bricks,
            isLoading: false,
            shown: true,
          });
        } else {
          this.setState({ ...state, isLoading: false, failedRequest: true });
        }
      }
      setTimeout(() => {
        if (values && values.newTeacher) {
          let newTeacher = values.newTeacher as any;
          this.setState({ stepsEnabled: !!newTeacher });
        }
      }, ViewAllPage.animationTimeout);
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
    isAllSubjects: boolean,
    sortBy: SortBy
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

    const pageBricks = await getPublishedBricksByPage(
      this.state.pageSize, page, isCore, levels, length, subjectIds,
      filterCompetition, this.state.subjectGroup, sortBy
    );

    if (pageBricks) {
      this.state.subjects.map(s1 => {
        s1.viewAllCount = 0;
        pageBricks.res && pageBricks.res.map(s => {
          if (s.brick_subjectId === s1.id) {
            s1.viewAllCount = parseInt(s.count);
          }
        });
      });
      this.setState({
        ...this.state,
        page,
        bricksCount: pageBricks.pageCount,
        bricks: pageBricks.bricks,
        isCore,
        filterLength: length,
        filterLevels: levels,
        isClearFilter: this.isFilterClear(),
        isLoading: false,
        isSearching: false,
        isAllSubjects,
        shown: true,
        sortBy
      });

      const { state } = this;

      this.historyUpdate(
        isAllSubjects, page, state.searchString,
        state.filterLevels, state.filterLength, state.sortBy,
        subjectIds, isCore, state.subjectGroup
      );
    }
  }

  async loadAndSetUnauthBricks(
    page: number,
    levels: AcademicLevel[],
    length: BrickLengthEnum[],
    filterCompetition: boolean,
    sortBy: SortBy,
    sGroup?: SubjectGroup | null,
  ) {
    const subjectIds = this.getSubjectIds();
    const pageBricks = await getUnauthPublishedBricksByPage(this.state.pageSize, page, levels, length, subjectIds, filterCompetition, sortBy, sGroup);

    if (pageBricks) {
      this.state.subjects.map(s1 => {
        s1.viewAllCount = 0;
        pageBricks.res && pageBricks.res.map(s => {
          if (s.brick_subjectId === s1.id) {
            s1.viewAllCount = parseInt(s.count);
          }
        });
      });

      this.setState({
        ...this.state,
        page,
        bricksCount: pageBricks.pageCount,
        bricks: pageBricks.bricks,
        filterLength: length,
        filterLevels: levels,
        isClearFilter: this.isFilterClear(),
        isLoading: false,
        sortBy,
        shown: true
      });

      const { state } = this;

      this.historyUpdate(
        state.isAllSubjects, page, state.searchString,
        state.filterLevels, state.filterLength, state.sortBy,
        subjectIds, state.isCore, state.subjectGroup
      );
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

    const sortBy = parseInt(e.target.value) as SortBy;

    this.setState({ ...this.state, sortBy, shown: false });

    setTimeout(() => {
      const { state } = this;
      try {
        if (this.state.isSearching) {
          this.loadAndSetSearchBricks(
            state.searchString, 0, state.pageSize, state.isCore, this.getSubjectIds(), state.isKeywordSearch
          );
        } else if (this.props.user) {
          this.loadAndSetBricks(
            0, state.isCore, state.filterLevels, state.filterLength,
            state.filterCompetition, state.isAllSubjects, sortBy
          );
        } else {
          this.loadAndSetUnauthBricks(
            0, state.filterLevels, state.filterLength,
            this.state.filterCompetition, sortBy, state.subjectGroup
          );
        }
      } catch { }
    }, ViewAllPage.animationTimeout);
  };

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
    const { state } = this;

    toggleSubject(this.state.subjects, id);
    toggleSubject(state.userSubjects, id);

    if (state.subjectGroup) {
      this.loadAndSetUnauthBricks(
        0, state.filterLevels, state.filterLength,
        state.filterCompetition, state.sortBy, state.subjectGroup
      );
    } else if (this.props.user) {
      if (this.state.isSearching) {
        this.loadAndSetSearchBricks(
          state.searchString, 0, state.pageSize, state.isCore, this.getSubjectIds(), state.isKeywordSearch
        );
      } else {
        this.loadAndSetBricks(
          0, state.isCore, state.filterLevels, state.filterLength,
          state.filterCompetition, state.isAllSubjects, state.sortBy
        );
      }
    } else {
      // not logged in but subjects
      if (this.state.isSearching) {
        this.loadAndSetSearchBricks(
          state.searchString, 0, state.pageSize, state.isCore, this.getSubjectIds(), state.isKeywordSearch
        );
      } else {
        this.loadAndSetUnauthBricks(
          0, state.filterLevels, state.filterLength,
          state.filterCompetition, state.sortBy
        );
      }
    }

    this.setState({ ...state, isViewAll: false, shown: false });
    setTimeout(() => {
      try {
        this.setState({
          ...this.state,
          isClearFilter: this.isFilterClear(),
          shown: true,
        });
      } catch { }
    }, ViewAllPage.animationTimeout);
  }

  filterByLevel(filterLevels: AcademicLevel[]) {
    this.setState({ filterLevels, shown: false });
    setTimeout(() => {
      const { state } = this;
      try {
        if (this.props.user) {
          this.loadAndSetBricks(
            0, state.isCore, filterLevels, state.filterLength,
            state.filterCompetition, state.isAllSubjects, state.sortBy
          );
        } else {
          this.loadAndSetUnauthBricks(
            0, filterLevels, state.filterLength, state.filterCompetition, state.sortBy, state.subjectGroup
          );
        }
      } catch { }
    }, ViewAllPage.animationTimeout);
  }

  filterByCompetition() {
    let filterCompetition = !this.state.filterCompetition;
    this.setState({ filterCompetition, shown: false });
    setTimeout(() => {
      const { state } = this;
      try {
        if (this.props.user) {
          this.loadAndSetBricks(
            0, state.isCore, state.filterLevels, state.filterLength,
            filterCompetition, state.isAllSubjects, state.sortBy
          );
        } else {
          this.loadAndSetUnauthBricks(
            0, state.filterLevels, state.filterLength, filterCompetition, state.sortBy, state.subjectGroup
          );
        }
      } catch { }
    }, ViewAllPage.animationTimeout);
  }

  filterByLength(filterLength: BrickLengthEnum[]) {
    this.setState({ filterLength, shown: false });
    setTimeout(() => {
      const { state } = this;
      try {
        if (this.props.user) {
          this.loadAndSetBricks(
            0, state.isCore, state.filterLevels, filterLength,
            state.filterCompetition, state.isAllSubjects, state.sortBy
          );
        } else {
          this.loadAndSetUnauthBricks(
            0, state.filterLevels, filterLength, state.filterCompetition, state.sortBy, state.subjectGroup
          );
        }
      } catch { }
    }, ViewAllPage.animationTimeout);
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
        this.checkUserSubject(s);
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
    const { state } = this;
    if (this.state.subjectGroup) {
      checkAllSubjects(this.state.subjects, state.isCore);
      this.loadAndSetUnauthBricks(
        0, state.filterLevels, state.filterLength, state.filterCompetition, state.sortBy, state.subjectGroup
      );
    }
    if (this.props.user) {
      checkAllSubjects(this.state.subjects, state.isCore);
      this.loadAndSetBricks(
        0, state.isCore, state.filterLevels, state.filterLength,
        state.filterCompetition, true, state.sortBy
      );
    } else {
      for (let s of this.state.subjects) {
        s.checked = false;
      }
      this.loadAndSetBricks(
        0, true, state.filterLevels, state.filterLength,
        state.filterCompetition, true, state.sortBy
      );
    }
    this.setState({
      isViewAll,
      isClearFilter: this.isFilterClear(),
    });
  }

  selectUserSubjects(isViewAll: boolean) {
    if (this.props.user) {
      const { state } = this;

      if (state.subjectGroup) {
        this.checkUserSubjects();
        this.loadAndSetUnauthBricks(
          0, state.filterLevels, state.filterLength, state.filterCompetition, state.sortBy, state.subjectGroup
        );
        this.setState({
          isViewAll,
          isClearFilter: this.isFilterClear(),
        });
      } else {
        if (isViewAll === false) {
          this.checkUserSubjects();
        } else {
          for (let subject of this.state.subjects) {
            subject.checked = false;
          }
        }

        this.loadAndSetBricks(
          0, state.isCore, state.filterLevels, state.filterLength,
          state.filterCompetition, state.isAllSubjects, state.sortBy
        );

        this.setState({
          isViewAll,
          isClearFilter: this.isFilterClear(),
        });
      }
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

    this.loadAndSetBricks(
      0, this.state.isCore, this.state.filterLevels, this.state.filterLength,
      this.state.filterCompetition, this.state.isAllSubjects, this.state.sortBy
    );

    this.setState({
      ...this.state,
      isClearFilter: this.isFilterClear(),
      searchString: subject.name,
      isSearching: true,
    });
  }

  filterSuggestionKeyword(keyword: KeyWord) {
    this.loadAndSetSearchBricks(keyword.name, 0, this.state.pageSize, this.state.isCore, this.getSubjectIds(), true);

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
    this.props.clearSearch();
    try {
      if (this.props.user) {
        this.loadAndSetBricks(
          0, this.state.isCore, this.state.filterLevels, this.state.filterLength,
          this.state.filterCompetition, this.state.isAllSubjects, this.state.sortBy
        );
      } else {
        this.loadAndSetUnauthBricks(
          0, this.state.filterLevels, this.state.filterLength, this.state.filterCompetition, this.state.sortBy, this.state.subjectGroup
        );
      }
    } catch { }
  }

  viewAll() {
    this.setState({ isViewAll: true });
  }

  clearSubjects = () => {
    const { state } = this;
    const { userSubjects, subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    userSubjects.forEach((r: any) => (r.checked = false));

    if (this.state.isSearching) {
      this.loadAndSetSearchBricks(
        state.searchString, 0, state.pageSize, state.isCore, [], state.isKeywordSearch
      );
    } else {
      this.loadAndSetBricks(
        0, this.state.isCore, this.state.filterLevels, this.state.filterLength,
        this.state.filterCompetition, this.state.isAllSubjects, this.state.sortBy
      );
    }
  };

  historyUpdate(
    isAllSubjects: boolean, page: number, searchString: string,
    filterLevel: AcademicLevel[], filterLength: BrickLengthEnum[],
    sortBy: SortBy, subjectIds: number[], isCore: boolean,
    subjectGroup?: SubjectGroup | null, stopAssignBrick?: boolean
  ) {
    let link = map.ViewAllPage + '?page=' + page;

    if (isAllSubjects === true) {
      link += '&mySubject=false'
    } else {
      link += '&mySubject=true'
    }

    if (searchString) {
      link += '&searchString=' + searchString;
    }

    if (filterLevel && filterLevel.length > 0) {
      link += '&level=' + filterLevel.join(',');
    }

    if (filterLength && filterLength.length > 0) {
      link += '&length=' + filterLength.join(',');
    }

    if (sortBy) {
      link += '&sortBy=' + sortBy;
    }

    if (subjectIds) {
      link += '&subjectIds=' + subjectIds.join(',');
    }

    if (isCore === false) {
      link += '&personal=true'
    }

    if (subjectGroup) {
      link += '&subjectGroup=' + subjectGroup;
    }

    if (!stopAssignBrick) {
      const values = queryString.parse(this.props.location.search);
      if (values["assigning-bricks"]) {
        link += '&assigning-bricks=' + values["assigning-bricks"];
      }

      if (values["only-bricks"]) {
        link += '&only-bricks=true';
      }
    }

    this.props.history.push(link);
  }

  moveAllBack() {
    const { state } = this;
    let index = state.page * state.pageSize;

    if (index >= state.pageSize) {
      let page = state.page - 1;

      const subjectIds = this.getSubjectIds();

      if (state.isSearching) {
        this.loadAndSetSearchBricks(
          state.searchString, page, state.pageSize, state.isCore,
          subjectIds, state.isKeywordSearch
        );
      } else {
        if (this.props.user) {
          this.loadAndSetBricks(
            page, state.isCore, state.filterLevels,
            state.filterLength, state.filterCompetition, state.isAllSubjects, state.sortBy
          );
        } else {
          this.loadAndSetUnauthBricks(
            page, state.filterLevels, state.filterLength, state.filterCompetition, state.sortBy, state.subjectGroup
          );
        }
      }

      this.historyUpdate(
        state.isAllSubjects, page, state.searchString,
        state.filterLevels, state.filterLength, state.sortBy,
        subjectIds, state.isCore, state.subjectGroup
      );
    }
  }

  moveAllNext() {
    const { state } = this;
    let index = state.page * state.pageSize;
    const { pageSize, bricksCount } = state;

    if (index + pageSize <= bricksCount - 1) {
      const page = state.page + 1;
      const subjectIds = this.getSubjectIds();

      if (state.isSearching) {
        this.loadAndSetSearchBricks(
          state.searchString, page, state.pageSize, state.isCore, subjectIds, state.isKeywordSearch
        );
      } else {
        if (this.props.user) {
          this.loadAndSetBricks(
            page, state.isCore, state.filterLevels,
            state.filterLength, state.filterCompetition, state.isAllSubjects, state.sortBy
          );
        } else {
          this.loadAndSetUnauthBricks(
            page, state.filterLevels, state.filterLength, state.filterCompetition, state.sortBy, state.subjectGroup
          );
        }
      }

      this.historyUpdate(
        state.isAllSubjects, page, state.searchString,
        state.filterLevels, state.filterLength, state.sortBy,
        subjectIds, state.isCore, state.subjectGroup
      );
    }
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({
        ...this.state,
        searchString,
        searchTyping: false,
        isKeywordSearch: false,
        isSearching: false,
      });
      const { state } = this;
      if (this.props.user) {
        this.loadAndSetBricks(
          0, state.isCore, state.filterLevels, state.filterLength,
          state.filterCompetition, state.isAllSubjects, state.sortBy
        );
      } else {
        this.loadAndSetUnauthBricks(
          0, state.filterLevels, state.filterLength,
          this.state.filterCompetition, state.sortBy, state.subjectGroup
        );
      }
    } else {
      this.setState({ ...this.state, searchTyping: true, searchString });
    }
  }

  async loadAndSetSearchBricks(searchString: string, page: number, pageSize: number, isCore: boolean, subjectIds: number[], isKeyword?: boolean) {
    const pageBricks = await searchPaginateBricks(searchString, page, pageSize, isCore, [], [], subjectIds, isKeyword ? isKeyword : false);

    const { state } = this;

    if (pageBricks && pageBricks.bricks.length >= 0) {

      const values = queryString.parse(this.props.location.search);

      if (values) {
        await this.setStateAndAssignClassroom(state, values);
      }

      this.setState({
        ...this.state,
        page,
        bricks: pageBricks.bricks,
        bricksCount: pageBricks.pageCount,
        searchBricks: pageBricks.bricks,
        isKeywordSearch: isKeyword ? isKeyword : false,
        shown: true,
        isLoading: false,
        isSearchBLoading: false,
        isSearching: true,
      });

      this.historyUpdate(
        state.isAllSubjects, page, state.searchString,
        state.filterLevels, state.filterLength, state.sortBy,
        subjectIds, state.isCore, state.subjectGroup
      );
    } else {
      this.setState({
        ...this.state,
        isLoading: false,
        isSearchBLoading: false,
        failedRequest: true,
      });
    }
  }

  async search(page: number) {
    const { searchString } = this.state;
    if (searchString.length < 1) {
      return;
    }
    this.setState({ shown: false, searchTyping: false, isSearchBLoading: true });

    setTimeout(() => {
      try {
        const { state } = this;
        let subjectIds = this.getSubjectIds();
        this.loadAndSetSearchBricks(
          searchString, page, state.pageSize,
          state.isCore, subjectIds, state.isKeywordSearch
        );
        this.historyUpdate(
          state.isAllSubjects, page, searchString,
          state.filterLevels, state.filterLength,
          state.sortBy, subjectIds, state.isCore, state.subjectGroup
        );
      } catch {
        this.setState({ isLoading: false, isSearchBLoading: false, failedRequest: true });
      }
    }, ViewAllPage.animationTimeout);
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
          assignClassroom={this.state.assignClassroom}
          onlyAssignBricks={this.state.onlyAssignBricks}
          isPlay={true}
        />
      );
    });
  }

  toggleCore() {
    const isCore = !this.state.isCore;
    this.setState({ isCore, shown: false, page: 0 });
    setTimeout(() => {
      const { state } = this;
      if (state.isSearching) {
        const subjectIds = this.getSubjectIds();
        this.loadAndSetSearchBricks(
          state.searchString, 0, state.pageSize, state.isCore,
          subjectIds, state.isKeywordSearch
        );
        this.historyUpdate(
          state.isAllSubjects, 0, state.searchString,
          state.filterLevels, state.filterLength, state.sortBy,
          subjectIds, isCore, state.subjectGroup
        );
      } else {
        this.loadAndSetBricks(
          0, isCore, state.filterLevels, state.filterLength,
          state.filterCompetition, state.isAllSubjects, state.sortBy
        );
      }
    }, 200);
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
      return "All Subjects";
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
      <div className="bricks-list-container desktop-no-bricks desktop-no-bricks-v2">
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
            {this.state.isCore === false && <SharePersonalBrickButton history={this.props.history} />}
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
          isSearching={this.state.isSearching}
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
            const { state } = this;
            if (state.subjectGroup) {
              this.loadAndSetUnauthBricks(
                0, state.filterLevels, state.filterLength, state.filterCompetition, state.sortBy, state.subjectGroup
              );
            } else {
              this.loadAndSetBricks(
                0, state.isCore, state.filterLevels, state.filterLength,
                state.filterCompetition, isAllSubjects, state.sortBy
              );
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
    const { user, history } = this.props;

    if (isPhone()) {
      return (
        <React.Suspense fallback={<></>}>
          <MobileTheme />
          <div className="main-listing dashboard-page">
            <Switch>
              <Route path={map.SubjectCategories}>
                <SubjectCategoriesComponent
                  user={user}
                  subjects={this.state.subjects}
                  history={history}
                  location={this.props.location}
                  filterByOneSubject={this.filterByOneSubject.bind(this)}
                  setViewAll={() => this.setState({ isViewAll: true })}
                  setSubjectGroup={this.setSubjectGroup.bind(this)}
                  checkSubjectsWithBricks={() => { }}
                />
              </Route>
              <Route path={map.SearchPublishBrickPage}>
                <React.Suspense fallback={<></>}>
                  {isPhone() && <MobileTheme />}
                  <PhoneSearchPage
                    user={user} subjects={this.state.subjects}
                    history={history}
                    requestFailed={() => this.setState({ failedRequest: true })}
                  />
                </React.Suspense>
              </Route>
              <Route path={map.ViewAllPage}>
                <MobileCategory
                  history={history}
                  location={this.props.location}
                />
              </Route>
            </Switch>
            {this.state.failedRequest &&
              <FailedRequestDialog
                isOpen={this.state.failedRequest}
                close={() => {
                  this.setState({ ...this.state, failedRequest: false })
                }}
              />}
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
    if (this.state.isLoading) {
      return <PageLoader content="...Getting Bricks..." />;
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
              initialSearchString={this.state.searchString}
              placeholder="Subjects, Topics, Titles & more"
              history={history}
              search={() => this.search(0)}
              searching={this.searching.bind(this)}
            />
            <Switch>
              <Route path={map.SubjectCategories}>
                <SubjectCategoriesComponent
                  user={user}
                  subjects={this.state.subjects}
                  history={history}
                  location={this.props.location}
                  filterByOneSubject={this.filterByOneSubject.bind(this)}
                  setViewAll={() => this.setState({ isViewAll: true })}
                  setSubjectGroup={this.setSubjectGroup.bind(this)}
                  checkSubjectsWithBricks={() => { }
                  }
                />
              </Route>
              <Route path={map.ViewAllPage}>
                {this.renderDesktopViewAllPage()}
              </Route>
            </Switch>
          </div>
          {this.state.failedRequest &&
            <FailedRequestDialog
              isOpen={this.state.failedRequest}
              close={() => {
                this.setState({ ...this.state, failedRequest: false })
              }}
            />}
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
        <PersonalBrickInvitationDialog />
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
        {this.state.assignPopupOpen && <AssignPopupHint
          label={this.state.assignClassroom?.name}
          cancel={() => this.setState({ assignPopupOpen: false })}
          click={() => this.setState({ assignPopupOpen: false, assigningBricks: true })} />
        }
        {this.state.assigningBricks && <BottomAssignmentPopup
          history={this.props.history}
          onlyAssignBricks={this.state.onlyAssignBricks}
          assignClass={this.state.assignClassroom} click={() => {
            const { state } = this;
            this.setState({ assigningBricks: false });
            this.historyUpdate(
              state.isAllSubjects, state.page, state.searchString,
              state.filterLevels, state.filterLength, state.sortBy,
              this.getSubjectIds(), state.isCore, state.subjectGroup, true
            );
          }}
        />
        }
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  subjects: state.subjects.subjects,
  notifications: state.notifications.notifications,
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
  getSubjects: () => dispatch(subjectActions.fetchSubjects()),
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  clearSearch: () => dispatch(searchActions.clearSearch()),
});

export default connect(mapState, mapDispatch)(ViewAllPage);

