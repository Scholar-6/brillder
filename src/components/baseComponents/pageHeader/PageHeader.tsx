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


const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  getNotifications: () => dispatch(notificationActions.getNotifications())
});

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });


interface UsersListProps {
  searchPlaceholder: string;
  link?: string;
  search(): void;
  searching(value: string): void;
  showDropdown(): void;
  showNotifications(event: any): void;

  // redux
  notifications: Notification[];
  isAuthenticated: isAuthenticated;
  getNotifications(): void
}
interface MyState {
  searchVisible: boolean;
  searchAnimation: string;
  // mobile
  dropdownShown: boolean;
}


class PageHeader extends Component<UsersListProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchVisible: false,
      dropdownShown: false,
      searchAnimation: 'slideInLeft'
    };
  }

  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.props.search();
    }
  }

  toggleSearch() {
    this.setState(prevState => ({
      searchVisible: !prevState.searchVisible
    }));
  }

  renderSearch() {
    this.props.search()
    this.toggleSearch()
  }

  hideDropdown() {
    this.setState({dropdownShown: false});
  }

  render() {
    let { searchVisible } = this.state
    let notificationCount = 0;
    if (this.props.isAuthenticated === isAuthenticated.True && !this.props.notifications) {
      this.props.getNotifications();
    } else if (this.props.notifications) {
      notificationCount = this.props.notifications.length;
    }

    let link = this.props.link ? this.props.link : map.MainPage;

    return (
      <div className="upper-part">
        <div className={!searchVisible ? "page-header" : "page-header active"}>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <div className="logout-container">
              {!searchVisible &&
                <div className="header-btn help-button svgOnHover">
                  <SpriteIcon name="help-thin" className="svg-default" />
                </div>
              }
              {!searchVisible && <HomeButton link={link} />}
              <div className={searchVisible ? "search-container active animated slideInRight" : "search-container"}>
                <div className={searchVisible ? 'search-area active' : 'search-area'}>
                  <input
                    className="search-input"
                    onKeyUp={(e) => this.keySearch(e)}
                    onChange={(e) => this.props.searching(e.target.value)}
                    placeholder={this.props.searchPlaceholder}
                  />
                </div>
                {searchVisible ?
                  <div className="btn btn-transparent close-search svgOnHover" onClick={() => this.toggleSearch()}>
                    <SpriteIcon name="arrow-right" className="w100 h100 text-tab-gray" />
                  </div>
                  :
                  <div className="btn btn-transparent open-search svgOnHover" onClick={() => this.renderSearch()}>
                    <SpriteIcon name="search" className="w100 h100 active text-theme-orange" />
                  </div>
                }
                {!this.props.isAuthenticated &&
                  <div className="btn btn-transparent tracking-button" onClick={() => this.setState({dropdownShown: true})}>
                    <SpriteIcon name="settings" className="w80 h80 text-theme-orange" />
                  </div>
                }
                {!this.props.isAuthenticated &&
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
            <HomeButton link={link} />
            <div className="logout-container">
              <div className="search-container">
                <div className="header-btn search-button svgOnHover" onClick={() => this.props.search()}>
                  <SpriteIcon name="search" className="active" />
                </div>
                <div className="search-area">
                  <input
                    className="search-input"
                    onKeyUp={(e) => this.keySearch(e)}
                    onChange={(e) => this.props.searching(e.target.value)}
                    placeholder={this.props.searchPlaceholder}
                  />
                </div>
              </div>
              {this.props.isAuthenticated === isAuthenticated.True &&
                <Grid container direction="row" className="action-container">
                  <BellButton
                    notificationCount={notificationCount}
                    onClick={evt => this.props.showNotifications(evt)}
                  />
                  <MoreButton onClick={() => this.props.showDropdown()} />
                </Grid>
              }
            </div >
          </Hidden>
        </div>
      </div>
    );
  }
}

export default connector(PageHeader);
