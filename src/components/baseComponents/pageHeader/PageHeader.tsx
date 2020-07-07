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

const connector = connect(mapState, mapDispatch);


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
      <div className="bell-button svgOnHover" onClick={(evt) => this.props.showNotifications(evt)}>
        <svg className="svg svg-default">
          <use href={sprite + "#bell-empty"} />
          {(notificationCount !== 0) &&
            <text className="bell-text-default" x="50%" y="50%" textAnchor="middle">{notificationCount}</text>}
        </svg>
        <svg className="svg colored">
          <use href={sprite + "#bell-filled"} />
          {(notificationCount !== 0) &&
            <text className="bell-text-filled" x="50%" y="50%" textAnchor="middle">{notificationCount}</text>}
        </svg>
      </div>
    )
  }
  renderMoreButton() {
    return (
      <div className="more-button svgOnHover" onClick={() => this.props.showDropdown()}>
        <svg className="svg svg-default">
          <use href={sprite + "#more-thin"} />
        </svg>
        <svg className="svg colored">
          <use href={sprite + "#more-thick"} />
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
      <Grid container direction="row" className={!searchVisible ? "page-header" : "page-header active"}>
        <Hidden only={['sm', 'md', 'lg', 'xl',]}>
          <div className="logout-container">

            {!searchVisible &&
              <div className="help-button svgOnHover">
                <svg className="svg svg-default">
                  <use href={sprite + "#help"} />
                </svg>
              </div>
            }
            {
              !searchVisible &&
              <HomeButton link="/home" />
            }
            <div className={searchVisible ? "search-container active animated slideInLeft" : "search-container"}>
              {searchVisible ?
                <svg className="svg svg-default close-search" onClick={() => this.toggleSearch()}>
                  <use href={sprite + "#arrow-up"} />
                </svg>
                :
                <div className="search-button svgOnHover" onClick={() => this.renderSearch()}>
                  <svg className="svg svg-default">
                    <use href={sprite + "#search-thin"} />
                  </svg>
                  <svg className="svg colored">
                    <use href={sprite + "#search-thick"} />
                  </svg>
                </div>
              }
              <div className="search-area"
                style={searchVisible ? { display: "block", } : {}}
              >
                <input
                  className="search-input"
                  onKeyUp={(e) => this.keySearch(e)}
                  onChange={(e) => this.props.searching(e.target.value)}
                  placeholder={this.props.searchPlaceholder}
                />
              </div>
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
          <Grid container className="logout-container">
            <div className="search-container">
              <div className="search-button svgOnHover" onClick={() => this.props.search()}>
                <svg className="svg svg-default">
                  <use href={sprite + "#search-thin"} />
                </svg>
                <svg className="svg colored">
                  <use href={sprite + "#search-thick"} />
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
          </Grid >
        </Hidden>
      </Grid >
    );
  }
}

export default connector(PageHeader);
