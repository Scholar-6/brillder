import React, { Component } from 'react';
import { Grid, Hidden } from '@material-ui/core';
import sprite from "../../../assets/img/icons-sprite.svg";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import './PageHeader.scss';
import { ReduxCombinedState } from 'redux/reducers';
import notificationActions from 'redux/actions/notifications';
// @ts-ignore
import { connect } from 'react-redux'
import { Notification } from 'model/notifications';


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
  renderBellButton(notificationCount: any) {
    return (
      <div className="header-btn bell-button svgOnHover" onClick={(evt) => this.props.showNotifications(evt)}>
        <svg id="bell" viewBox="0 0 24 24">
          <path className="bell-cup" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {(notificationCount !== 0) && <span className="bell-text">{notificationCount}</span>}
      </div>
    )
  }
  renderMoreButton() {
    return (
      <div className="header-btn more-button svgOnHover" onClick={() => this.props.showDropdown()}>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#more"} />
        </svg>
      </div>
    )
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
                  <svg className="svg svg-default">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#help-thin"} />
                  </svg>
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
                    <svg className="svg w100 h100">
                      {/*eslint-disable-next-line*/}
                      <use href={sprite + "#arrow-right"} className="text-tab-gray" />
                    </svg>
                  </div>
                  :
                  <div className="btn btn-transparent open-search svgOnHover" onClick={() => this.renderSearch()}>
                    <svg className="svg w100 h100 svg-default">
                      {/*eslint-disable-next-line*/}
                      <use href={sprite + "#search-thin"} className="text-theme-orange" />
                    </svg>
                    <svg className="svg w100 h100 colored">
                      {/*eslint-disable-next-line*/}
                      <use href={sprite + "#search-thick"} className="text-theme-orange" />
                    </svg>
                  </div>
                }
              </div>
              {
                !searchVisible &&
                this.renderBellButton(notificationCount)
              }
              {
                !searchVisible &&
                this.renderMoreButton()
              }
            </div>
          </Hidden>
          <Hidden only={['xs']} >
            <HomeButton link="/home" />
            <div className="logout-container">
              <div className="search-container">
                <div className="header-btn search-button svgOnHover" onClick={() => this.props.search()}>
                  <svg className="svg active">
                    <use href={sprite + "#search"} />
                  </svg>
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
                {this.renderBellButton(notificationCount)}
                {this.renderMoreButton()}
              </Grid>
            </div >
          </Hidden>
        </div>
      </div>
    );
  }
}

export default connector(PageHeader);
