import React, { Component } from 'react';
import { Grid, Hidden } from '@material-ui/core';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import './PageHeader.scss';
import { ReduxCombinedState } from 'redux/reducers';
import notificationActions from 'redux/actions/notifications';
import { connect } from 'react-redux'
import { Notification } from 'model/notifications';
import BellButton from './bellButton/BellButton';
import MoreButton from './MoreButton';
import SpriteIcon from '../SpriteIcon';


const mapState = (state: ReduxCombinedState) => ({
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  getNotifications: () => dispatch(notificationActions.getNotifications())
});

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });


interface UsersListProps {
  searchPlaceholder: string;
  search(): void;
  searching(value: string): void;
  notifications: Notification[];
  showDropdown(): void;
  showNotifications(event: any): void;
  getNotifications(): void
}
interface MyState {
  searchVisible: boolean;
  searchAnimation: string;
}


class PageHeader extends Component<UsersListProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = { searchVisible: false, searchAnimation: 'slideInLeft' };
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

  render() {
    let { searchVisible } = this.state
    let notificationCount = 0;
    if (!this.props.notifications) {
      this.props.getNotifications();
    } else {
      notificationCount = this.props.notifications.length;
    }

    return (
      <div className="upper-part">
        <div className={!searchVisible ? "page-header" : "page-header active"}>
          <Hidden only={['sm', 'md', 'lg', 'xl',]}>
            <div className="logout-container">

              {!searchVisible &&
                <div className="header-btn help-button svgOnHover">
                  <SpriteIcon name="help-thin" className="svg-default" />
                </div>
              }
              {
                !searchVisible &&
                <HomeButton link="/home" />
              }
              <div className={searchVisible ? "search-container active animated slideInLeft" : "search-container"}>
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
              </div>
              {
                !searchVisible &&
                <BellButton
                  notificationCount={notificationCount}
                  onClick={evt => this.props.showNotifications(evt)}
                />
              }
              {
                !searchVisible &&
                <MoreButton onClick={() => this.props.showDropdown()} />
              }
            </div>
          </Hidden>
          <Hidden only={['xs']} >
            <HomeButton link="/home" />
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
              <Grid container direction="row" className="action-container">
                <BellButton
                  notificationCount={notificationCount}
                  onClick={evt => this.props.showNotifications(evt)}
                />
                <MoreButton onClick={() => this.props.showDropdown()} />
              </Grid>
            </div >
          </Hidden>
        </div>
      </div>
    );
  }
}

export default connector(PageHeader);
