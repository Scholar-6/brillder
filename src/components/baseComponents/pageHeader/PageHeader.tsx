import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
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


class PageHeader extends Component<UsersListProps> {
  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.props.search();
    }
  }

  render() {
    let notificationCount = 0;
    if(!this.props.notifications) {
      this.props.getNotifications();
    } else {
      notificationCount = this.props.notifications.length;
    }

    return (
      <Grid container direction="row" className="page-header">
        <HomeButton link="/build" />
        <Grid container className="logout-container">
          <Grid container  direction="row" className="search-container">
            <Grid item>
              <div className="search-button svgOnHover" onClick={() => this.props.search()}>
								<svg className="svg svg-default">
									<use href={sprite + "#search-thin"}/>
								</svg>
								<svg className="svg colored">
									<use href={sprite + "#search-thick"}/>
								</svg>
							</div>
            </Grid>
            <Grid item>
              <input
                className="search-input"
                onKeyUp={(e) => this.keySearch(e)}
                onChange={(e) => this.props.searching(e.target.value)}
                placeholder={this.props.searchPlaceholder}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" className="action-container">
            <Grid item>
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
									<use href={sprite + "#more-thin"}/>
								</svg>
								<svg className="svg colored">
									<use href={sprite + "#more-thick"}/>
								</svg>
							</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default connector(PageHeader);
