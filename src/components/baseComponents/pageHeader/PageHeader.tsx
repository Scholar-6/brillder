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
import { getKeywords } from "services/axios/brick";
import { Brick, KeyWord, Subject } from 'model/brick';
import SearchSuggestions from 'components/viewAllPage/components/SearchSuggestions';
import { getSubjects } from 'services/axios/subject';
import { User } from 'model/user';
import VolumeButton from '../VolumeButton';
import BrillIconAnimated from '../BrillIconAnimated';
import ReactiveUserCredits from 'components/userProfilePage/ReactiveUserCredits';
import { JoinPage, LibraryLoginPage, LibraryRegisterPage } from 'components/loginPage/desktop/routes';
import { SetAuthBrickCash } from 'localStorage/play';


const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user.user,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  getNotifications: () => dispatch(notificationActions.getNotifications())
});

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });


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
}

interface State {
  value: string;
  searchVisible: boolean;
  searchAnimation: string;
  bricks: Brick[];
  keywords: KeyWord[];
  subjects: Subject[];
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
      value,
      bricks: [],
      keywords: [],
      subjects: [],
      searchAnimation: 'slideInLeft'
    };

    if (props.suggestions) {
      this.prepareSuggestions();
    }

    if (this.props.isAuthenticated === isAuthenticated.True && !this.props.notifications) {
      this.props.getNotifications();
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
    const keywords = await getKeywords() || [];
    const subjects = await getSubjects() || [];
    this.setState({bricks: [], subjects, keywords });
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
    let { searchVisible } = this.state
    let notificationCount = this.props.notifications ? this.props.notifications.length : 0;
    let link = this.props.link ? this.props.link : map.MainPage;

    let className = 'search-container 44';
    if (searchVisible) {
      className += 'active animated slideInRight '
    }

    if (this.state.value.length >= 1) {
      className += ' no-bottom-border';
    }

    // page loaded by library shared link
    if (this.props.onForbiddenClick) {
      return (
        <div className="upper-part">
          <div className={!searchVisible ? "page-header" : "page-header active"}>
            <HomeButton onClick={this.props.onForbiddenClick} history={this.props.history} />
            <div className="logout-container">
              <div className={`search-container ${this.state.value.length >= 1 ? 'no-bottom-border' : ''}`}>
                <div className="header-btn search-button svgOnHover" onClick={this.props.onForbiddenClick}>
                  <SpriteIcon name="search" className="active" />
                </div>
                <div className="search-area">
                  <input
                    className="search-input"
                    value={this.state.value}
                    onKeyUp={this.props.onForbiddenClick}
                    onChange={this.props.onForbiddenClick}
                    placeholder={this.props.searchPlaceholder}
                  />
                </div>
              </div>
              {this.props.isAuthenticated === isAuthenticated.True &&
                <Grid container direction="row" className="action-container">
                  <VolumeButton />
                  <BrillIconAnimated onClick={() => console.log(444)} />
                  {(this.props.user.isFromInstitution || this.props.user.library) ? <div /> :
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
          {this.props.suggestions && this.state.value.length >= 1 && <SearchSuggestions
            history={this.props.history} subjects={this.state.subjects}
            searchString={this.state.value} bricks={this.state.bricks}
            filterByAuthor={a => this.props.history.push(map.ViewAllPageB + '&searchString=' + a.firstName)}
            filterBySubject={s => this.props.history.push(map.ViewAllPageB + '&searchString=' + s.name)}
            filterByKeyword={k => this.props.history.push(map.ViewAllPageB + '&searchString=' + k.name)}
          />}
        </div>
      );
    }

    return (
      <div className="upper-part">
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
                        this.setState({ ...this.state, value: e.target.value });
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
            <HomeButton link={link} history={this.props.history} />
            <div className="logout-container">
              <div className={`search-container ${this.state.value.length >= 1 ? 'no-bottom-border' : ''}`}>
                {!this.props.searchHidden &&
                <div className="header-btn search-button svgOnHover" onClick={() => this.props.search()}>
                  <SpriteIcon name="search" className="active" />
                </div>}
                <div className="search-area">
                  {!this.props.searchHidden &&
                  <input
                    className="search-input"
                    value={this.state.value}
                    onKeyUp={(e) => this.keySearch(e)}
                    onChange={(e) => {
                      this.setState({ ...this.state, value: e.target.value });
                      this.props.searching(e.target.value);
                    }}
                    placeholder={this.props.searchPlaceholder}
                  />}
                </div>
              </div>
              {this.props.isAuthenticated === isAuthenticated.True &&
                <Grid container direction="row" className="action-container">
                  <VolumeButton />
                  <BrillIconAnimated onClick={() => console.log(443)} />
                  {(this.props.user.isFromInstitution || this.props.user.library) ? <div /> :
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
        {this.props.suggestions && this.state.value.length >= 1 && <SearchSuggestions
          history={this.props.history} subjects={this.state.subjects}
          searchString={this.state.value} bricks={this.state.bricks}
          filterByAuthor={a => this.props.history.push(map.ViewAllPageB + '&searchString=' + a.firstName)}
          filterBySubject={s => this.props.history.push(map.ViewAllPageB + '&searchString=' + s.name)}
          filterByKeyword={k => this.props.history.push(map.ViewAllPageB + '&searchString=' + k.name)}
        />}
      </div>
    );
  }
}

export default connector(PageHeader);
