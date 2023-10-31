import React, { Component } from 'react';
import { Grid, Hidden } from '@material-ui/core';
import { connect } from 'react-redux'

import './PageHeader.scss';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import { ReduxCombinedState } from 'redux/reducers';
import notificationActions from 'redux/actions/notifications';
import { Notification } from 'model/notifications';
import BellButton from './bellButton/BellButton';
import MoreButton from './MoreButton';
import SpriteIcon from '../SpriteIcon';
import { isAuthenticated } from 'model/assignment';
import map from 'components/map';
import UnauthorizedMenu from 'components/app/unauthorized/UnauthorizedMenu';
import { PageEnum } from './PageHeadWithMenu';
import { isPhone } from 'services/phone';
import { Brick, KeyWord, Subject } from 'model/brick';
import SearchSuggestions from 'components/viewAllPage/components/SearchSuggestions';
import { User } from 'model/user';
import VolumeButton from '../VolumeButton';
import BrillIconAnimated from '../BrillIconAnimated';
import ReactiveUserCredits from 'components/userProfilePage/ReactiveUserCredits';
import { JoinPage, LibraryLoginPage, LibraryRegisterPage } from 'components/loginPage/desktop/routes';
import { SetAuthBrickCash } from 'localStorage/play';
import subjectActions from "redux/actions/subject";
import searchActions from "redux/actions/search";


interface Props {
  searchPlaceholder: string;
  link?: string;
  page: PageEnum;
  brick?: Brick;
  competitionId?: number;
  suggestions?: boolean;

  initialSearchString?: string;

  user: User;
  history: any;
  search(): void;
  searching(value: string): void;
  showDropdown(): void;
  showNotifications(event: any): void;

  searchHidden?: boolean;

  toggleSearch?(value: boolean): void;
  onForbiddenClick?(): void;

  // redux
  notifications: Notification[];
  isAuthenticated: isAuthenticated;
  getNotifications(): void

  subjects: Subject[];
  getSubjects(): Promise<Subject[]>;

  searchString: string;
  searchClassString: string;
  setSearchString(value: string, page: PageEnum): void;
  clearSearch(): void;
}

interface State {
  searchVisible: boolean;
  searchAnimation: string;
  bricks: Brick[];
  subjects: Subject[];
  suggestionsLoaded: boolean;
  // mobile
  dropdownShown: boolean;
}


class PageHeader extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    let value = '';
    if (props.initialSearchString) {
      value = props.initialSearchString;
    }

    this.state = {
      searchVisible: false,
      dropdownShown: false,
      suggestionsLoaded: false,
      bricks: [],
      subjects: [],
      searchAnimation: 'slideInLeft'
    };

    if (this.props.isAuthenticated === isAuthenticated.True && !this.props.notifications) {
      this.props.getNotifications();
    }

    if (this.props.page === PageEnum.Play) {
      this.props.clearSearch();
    }

    if (value) {
      this.props.setSearchString(value, props.page);
    }
  }

  componentWillUnmount(): void {
    console.log('destroy');
    if (this.props.page !== PageEnum.ViewAll) {
      this.props.clearSearch();
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

  async prepareSuggestions() {
    if (this.state.suggestionsLoaded === false) {
      this.setState({suggestionsLoaded: true})
      if (this.props.subjects.length === 0) {
        await this.props.getSubjects();
      }
      this.setState({bricks: [] });
    }
  }

  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.props.search();
    }
  }


  toggleSearch() {
    if (this.props.toggleSearch) {
      this.props.toggleSearch(!this.state.searchVisible);
    }
    this.setState(prevState => ({
      searchVisible: !prevState.searchVisible
    }));
  }

  renderSearch() {
    this.props.search()
    this.toggleSearch()
  }

  hideDropdown() {
    this.setState({ dropdownShown: false });
  }

  renderMiddleButton() {
    if (this.props.page === PageEnum.Book && isPhone()) {
      return (
        <div
          className="btn btn-transparent m-footer-book-icon svgOnHover"
          onClick={() => this.props.history.push(map.MyLibrary)}
        >
          <SpriteIcon name="book-open" className="w100 h100 active text-theme-orange" />
          <div className="gh-phone-background" />
        </div>
      )
    }
    if (this.state.searchVisible) {
      return (
        <div className="btn btn-transparent close-search svgOnHover" onClick={() => this.toggleSearch()}>
          <SpriteIcon name="arrow-right" className="w100 h100 text-tab-gray" />
        </div>
      );
    }
    return (
      <div className="btn btn-transparent open-search svgOnHover" onClick={() => {
        this.props.page !== PageEnum.Book && this.renderSearch()
      }}>
        <SpriteIcon name="search" className="w100 h100 active text-theme-orange" />
        <div className="gh-phone-background" />
      </div>
    );
  }

  renderMiddleForbiddenButton() {
    if (this.props.page === PageEnum.Book && isPhone()) {
      return (
        <div
          className="btn btn-transparent m-footer-book-icon svgOnHover"
          onClick={this.props.onForbiddenClick}
        >
          <SpriteIcon name="book-open" className="w100 h100 active text-theme-orange" />
          <div className="gh-phone-background" />
        </div>
      )
    }
    if (this.state.searchVisible) {
      return (
        <div className="btn btn-transparent close-search svgOnHover" onClick={this.props.onForbiddenClick}>
          <SpriteIcon name="arrow-right" className="w100 h100 text-tab-gray" />
        </div>
      );
    }
    return (
      <div className="btn btn-transparent open-search svgOnHover" onClick={this.props.onForbiddenClick}>
        <SpriteIcon name="search" className="w100 h100 active text-theme-orange" />
        <div className="gh-phone-background" />
      </div>
    );
  }

  render() {
    let searchString = this.props.searchString;
    if (this.props.page === PageEnum.ManageClasses) {
      searchString = this.props.searchClassString;
    }

    let { searchVisible } = this.state
    let notificationCount = this.props.notifications ? this.props.notifications.length : 0;
    let link = this.props.link ? this.props.link : map.MainPage;

    let className = 'search-container';
    if (searchVisible) {
      className += 'active animated slideInRight '
    }

    if (searchString.length >= 1) {
      className += ' no-bottom-border';
    }

    // page loaded by library shared link
    if (this.props.onForbiddenClick) {
      return (
        <div className="upper-part" onClick={() => this.prepareSuggestions()}>
          <div className={!searchVisible ? "page-header" : "page-header active"}>
            <HomeButton page={this.props.page} onClick={this.props.onForbiddenClick} history={this.props.history} />
            <div className="logout-container">
              <div className={`search-container ${searchString.length >= 1 ? 'no-bottom-border' : ''}`}>
                <div className="header-btn search-button svgOnHover" onClick={this.props.onForbiddenClick}>
                  <SpriteIcon name="search" className="active" />
                </div>
                <div className="search-area">
                  <input
                    className="search-input"
                    value={searchString}
                    onKeyUp={this.props.onForbiddenClick}
                    onChange={this.props.onForbiddenClick}
                    placeholder={this.props.searchPlaceholder}
                  />
                </div>
              </div>
              {this.props.isAuthenticated === isAuthenticated.True &&
                <Grid container direction="row" className="action-container">
                  <VolumeButton />
                  <BrillIconAnimated />
                  {(this.props.user && (this.props.user.isFromInstitution || this.props.user.library)) ? <div /> :
                    <div className="header-credits-container">
                      <ReactiveUserCredits className="desktop-credit-coins" history={this.props.history} />
                    </div>}
                  <BellButton
                    notificationCount={notificationCount}
                    onClick={evt => this.props.showNotifications(evt)}
                  />
                  <MoreButton onClick={this.props.onForbiddenClick} />
                </Grid>
              }
              {this.props.isAuthenticated === isAuthenticated.False &&
                <Grid container direction="row" className="action-container">
                  <div className="login-button">
                    <span onClick={() => {
                      if (this.props.brick) {
                        SetAuthBrickCash(this.props.brick, this.props.competitionId ? this.props.competitionId : -1);
                      }
                      this.props.history.push(LibraryLoginPage)
                    }}>Login</span> | <span onClick={() => {
                      if (this.props.brick) {
                        SetAuthBrickCash(this.props.brick, this.props.competitionId ? this.props.competitionId : -1);
                      }
                      this.props.history.push(LibraryRegisterPage)
                    }}>Register</span>
                  </div>
                </Grid>
              }
            </div>
          </div>
          {this.props.suggestions && searchString.length >= 1 && <SearchSuggestions
            history={this.props.history} subjects={this.props.subjects}
            searchString={searchString} bricks={this.state.bricks}
            filterByAuthor={a => this.props.history.push(map.ViewAllPageB + '&searchString=' + a.firstName)}
            filterBySubject={s => this.props.history.push(map.ViewAllPageB + '&searchString=' + s.name)}
            filterByKeyword={k => this.props.history.push(map.ViewAllPageB + '&searchString=' + k.name)}
          />}
        </div>
      );
    }

    return (
      <div className="upper-part" onClick={() => this.prepareSuggestions()}>
        <div className={!searchVisible ? "page-header" : "page-header active"}>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <div className="logout-container">
              {!searchVisible && this.props.page !== PageEnum.Book &&
                <div className="header-btn help-button svgOnHover">
                  <SpriteIcon name="help-thin" className="svg-default" />
                </div>
              }
              {!searchVisible && <HomeButton history={this.props.history} link={link} />}
              <div className={className}>
                {this.props.page !== PageEnum.Book &&
                  <div className={searchVisible ? 'search-area active' : 'search-area'}>
                    <input
                      className="search-input"
                      onKeyUp={(e) => this.keySearch(e)}
                      onChange={(e) => {
                        this.props.setSearchString(e.target.value, this.props.page);
                        this.setState({ ...this.state });
                        this.props.searching(e.target.value);
                      }}
                      placeholder={this.props.searchPlaceholder}
                    />
                  </div>
                }
                {this.renderMiddleButton()}
                {!this.props.isAuthenticated &&
                  <div className="btn btn-transparent tracking-button" onClick={() => this.setState({ dropdownShown: true })}>
                    <SpriteIcon name="settings" className="w80 h80 text-theme-orange" />
                  </div>
                }
                {(!this.props.isAuthenticated || this.props.isAuthenticated === isAuthenticated.False) &&
                  <UnauthorizedMenu isOpen={this.state.dropdownShown} closeDropdown={this.hideDropdown.bind(this)} />
                }
              </div>

              {
                !searchVisible && this.props.isAuthenticated === isAuthenticated.True &&
                <BellButton
                  notificationCount={notificationCount}
                  onClick={evt => this.props.showNotifications(evt)}
                />
              }
              {
                !searchVisible && this.props.isAuthenticated === isAuthenticated.True &&
                <MoreButton onClick={() => this.props.showDropdown()} />
              }
            </div>
          </Hidden>
          <Hidden only={['xs']} >
            <HomeButton page={this.props.page} link={link} history={this.props.history} />
            <div className="logout-container">
              <div className={`search-container ${searchString.length >= 1 ? 'no-bottom-border' : ''}`}>
                {!this.props.searchHidden &&
                <div className="header-btn search-button svgOnHover" onClick={() => this.props.search()}>
                  <SpriteIcon name="search" className="active" />
                </div>}
                <div className="search-area">
                  {!this.props.searchHidden &&
                  <input
                    className="search-input"
                    value={searchString}
                    onKeyUp={(e) => this.keySearch(e)}
                    onChange={(e) => {
                      this.props.setSearchString(e.target.value, this.props.page);
                      this.setState({ ...this.state });
                      this.props.searching(e.target.value);
                    }}
                    placeholder={this.props.searchPlaceholder}
                  />}
                </div>
              </div>
              {this.props.isAuthenticated === isAuthenticated.True &&
                <Grid container direction="row" className="action-container">
                  <VolumeButton />
                  <BrillIconAnimated />
                  {(this.props.user && (this.props.user.isFromInstitution || this.props.user.library)) ? <div /> :
                    <div className="header-credits-container">
                      <ReactiveUserCredits className="desktop-credit-coins" history={this.props.history} />
                    </div>}
                  <BellButton
                    notificationCount={notificationCount}
                    onClick={evt => this.props.showNotifications(evt)}
                  />
                  <MoreButton onClick={() => this.props.showDropdown()} />
                </Grid>
              }
              {this.props.isAuthenticated === isAuthenticated.False &&
                <Grid container direction="row" className="action-container">
                  <div className="login-button">
                    <span onClick={() => {
                      const {pathname} = this.props.history.location;
                      const isPlay = pathname.search('/play/brick/') !== -1;
                      if (isPlay) {
                        const brickId = pathname.split('/')[3];
                        SetAuthBrickCash({id: brickId} as Brick, -1);
                      }
                      this.props.history.push(map.Login);
                    }}>Login</span> | <span onClick={() => {
                      const {pathname} = this.props.history.location;
                      const isPlay = pathname.search('/play/brick/') !== -1;
                      if (isPlay) {
                        const brickId = pathname.split('/')[3];
                        SetAuthBrickCash({id: brickId} as Brick, -1);
                      }
                      this.props.history.push(JoinPage);
                    }}>Register</span>
                  </div>
                </Grid>
              }
            </div>
          </Hidden>
        </div>
        {this.props.suggestions && searchString.length >= 1 && <SearchSuggestions
          history={this.props.history} subjects={this.props.subjects}
          searchString={searchString} bricks={this.state.bricks}
          filterByAuthor={a => this.props.history.push(map.ViewAllPageB + '&searchString=' + a.firstName)}
          filterBySubject={s => this.props.history.push(map.ViewAllPageB + '&searchString=' + s.name)}
          filterByKeyword={k => this.props.history.push(map.ViewAllPageB + '&searchString=' + k.name)}
        />}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user.user,
  notifications: state.notifications.notifications,
  subjects: state.subjects.subjects,
  searchString: state.search.value,
  searchClassString: state.search.classesValue
});

const mapDispatch = (dispatch: any) => ({
  getNotifications: () => dispatch(notificationActions.getNotifications()),
  getSubjects: () => dispatch(subjectActions.fetchSubjects()),
  setSearchString: (value: string, page: PageEnum) => dispatch(searchActions.setSearchString(value, page)),
  clearSearch: () => dispatch(searchActions.clearSearch()),
});

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });

export default connector(PageHeader);
