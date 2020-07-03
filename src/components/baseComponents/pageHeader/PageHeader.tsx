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
    if(!this.props.notifications) {
      this.props.getNotifications();
    } else {
      notificationCount = this.props.notifications.length;
    }

    return (
      <Grid container direction="row" className="page-header">
        {!searchVisible &&
          <svg className="help-icon" width="40" height="35" viewBox="0 0 20 20" fill="#c43c30" aria-hidden="true"><title></title><g id="Layer_4"><path d="M11,12.3V13c0,0-1.8,0-2,0v-0.6c0-0.6,0.1-1.4,0.8-2.1c0.7-0.7,1.6-1.2,1.6-2.1c0-0.9-0.7-1.4-1.4-1.4 c-1.3,0-1.4,1.4-1.5,1.7H6.6C6.6,7.1,7.2,5,10,5c2.4,0,3.4,1.6,3.4,3C13.4,10.4,11,10.8,11,12.3z"></path><circle cx="10" cy="15" r="1"></circle><path d="M10,2c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8S5.6,2,10,2 M10,0C4.5,0,0,4.5,0,10s4.5,10,10,10s10-4.5,10-10S15.5,0,10,0 L10,0z"></path></g></svg>
        }
        {!searchVisible &&
          <HomeButton link="/home" />
        }
        <Grid container className="logout-container">
          <div className={searchVisible ? "search-container active animated slideInLeft" : "search-container"}>
            {searchVisible ?
              <svg className="svg svg-default close-search" onClick={() => this.toggleSearch()}>
                <use href={sprite + "#arrow-up"} />
              </svg>
              :
              <div>
                <Hidden only={['sm', 'md', 'lg', 'xl']}>
                  <div className="search-button svgOnHover" onClick={() => this.renderSearch()}>

                    <svg className="svg svg-default">
                      <use href={sprite + "#search-thin"} />
                    </svg>
                    <svg className="svg colored">
                      <use href={sprite + "#search-thick"} />
                    </svg>
                  </div>
                </Hidden>
                <Hidden only={['xs']}>
                  <div className="search-button svgOnHover" onClick={() => this.props.search()}>
                    <svg className="svg svg-default">
                      <use href={sprite + "#search-thin"} />
                    </svg>
                    <svg className="svg colored">
                      <use href={sprite + "#search-thick"} />
                    </svg>
                  </div>
                </Hidden>
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
          {!searchVisible &&

            <Grid container direction="row" className="action-container">
              {/* <Grid item> */}
              <div className="bell-button svgOnHover">
                <svg className="svg svg-default">
                  <use href={sprite + "#bell-empty"}/>
                  {(notificationCount !== 0) &&
                  <text className="bell-text-default" x="50%" y ="50%" textAnchor="middle">{notificationCount}</text>}
                </svg>
                <svg className="svg colored">
                  <use href={sprite + "#bell-filled"}/>
                  {(notificationCount !== 0) &&
                  <text className="bell-text-filled" x="50%" y ="50%" textAnchor="middle">{notificationCount}</text>}
                </svg>
              </div>
              <div className="more-button svgOnHover" onClick={() => this.props.showDropdown()}>
                <svg className="svg svg-default">
                  <use href={sprite + "#more-thin"} />
                </svg>
                <svg className="svg colored">
                  <use href={sprite + "#more-thick"} />
                </svg>
              </div>
              {/* </Grid> */}
            </Grid>
          }
        </Grid>
      </Grid >
    );
  }
}

export default connector(PageHeader);
