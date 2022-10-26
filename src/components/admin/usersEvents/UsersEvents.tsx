import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './UsersEvents.scss';
import { User, UserPreferenceType, UserType } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import UsersSidebar from "./UsersEventsSidebar";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getUsers } from "services/axios/user";
import { getDateString } from "components/services/brickService";
import UsersPagination from "components/teach/manageClassrooms/components/UsersPagination";
import ExportBtn from "../components/ExportBtn";
import { exportToCSV } from "services/excel";
import { exportToPDF } from "services/pdf";


interface UsersProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface UsersState {
  users: User[];
  page: number,
  pageSize: number;
  totalUsersCount: number;
  userPreference: UserPreferenceType | null;

  downloadClicked: boolean;
}

class UsersPage extends Component<UsersProps, UsersState> {
  constructor(props: UsersProps) {
    super(props);

    this.state = {
      users: [],
      page: 0,
      pageSize: 14,
      totalUsersCount: 0,
      userPreference: null,

      downloadClicked: false
    };

    this.getUsers(null, 0);
  }

  async getUsers(userPreference: UserPreferenceType | null, page: number) {
    let roleFilters = [];
    if (userPreference !== null) {
      roleFilters.push(userPreference);
    }
    const res = await getUsers({
      pageSize: this.state.pageSize,
      page: page.toString(),
      searchString: '',
      subjectFilters: [],
      roleFilters,
      orderBy: "user.created",
      isAscending: false
    });
    if (res) {
      this.setState({
        userPreference,
        page,
        users: res.pageData,
        totalUsersCount: res.totalCount
      });
    }
  }

  search() { }
  searching() { }

  renderUserType(u: User) {
    if (u.roles.find(r => r.roleId === UserType.Admin)) {
      return 'Admin';
    } else if (u.roles.find(r => r.roleId === UserType.Publisher)) {
      return 'Publisher';
    } else if (u.roles.find(r => r.roleId === UserType.Institution)) {
      return 'Institution';
    } else if (u.userPreference) {
      const { preferenceId } = u.userPreference;
      if (preferenceId === UserType.Student) {
        return 'Learner';
      } else if (preferenceId === UserType.Builder) {
        return 'Builder';
      } else if (preferenceId === UserType.Teacher) {
        return 'Educator';
      }
    }
    return '';
  }

  renderBody() {
    const { users } = this.state;
    if (users.length == 0) {
      return <div className="table-body">
        <div className="table-row">
          <div className="publish-column">No Users</div>
        </div>
      </div>;
    }

    return <div className="table-body">
      {users.map(u => {
        return (<div className="table-row">
          <div className="publish-column">{u.created && getDateString(u.created)}</div>
          <div className="author-column">{u.firstName} {u.lastName}</div>
          <div className="second-column">{u.email}</div>
          <div className="third-column">{this.renderUserType(u)}</div>
        </div>);
      })}
    </div>
  }

  moveToPage(page: number) {
    this.getUsers(this.state.userPreference, page);
  }

  renderPagination() {
    return (
      <UsersPagination
        users={this.state.users}
        page={this.state.page}
        totalCount={this.state.totalUsersCount}
        pageSize={this.state.pageSize}
        moveToPage={page => this.moveToPage(page)}
      />
    );
  }

  renderTable() {
    return (
      <div className="table users-table-d34">
        <div className="table-head bold">
          <div className="publish-column header">
            <div>Joined</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
            }} /></div>
          </div>
          <div className="author-column header">
            <div>Name</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
            }} /></div>
          </div>
          <div className="second-column header">
            <div>Email</div>
          </div>
          <div className="third-column header">
            <div>User Type</div>
          </div>
          <div className="second-column header">
            <div>Activity</div>
          </div>
          <div className="actions-column header"></div>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  render() {
    return (
      <div className="main-listing bricks-played-page user-list-page manage-classrooms-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={this.props.history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <UsersSidebar isLoaded={true} userPreference={this.state.userPreference} setUserPreference={userPreference => {
            this.getUsers(userPreference, 0);
          }} />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Users} history={this.props.history} />
            <div className="tab-content">
              <ExportBtn onClick={() => this.setState({ downloadClicked: true })} />
              {this.state.downloadClicked && <Dialog
                className="sort-dialog-classes export-dialog-ew35"
                open={this.state.downloadClicked}
                onClose={() => this.setState({ downloadClicked: false })}
              >
                <div className="popup-3rfw bold">
                  <div className="btn-sort" onClick={() => {
                    let data: any[] = [];

                    for (const user of this.state.users) {
                      data.push({
                        Joined: user.created?.toString(),
                        Name: user.firstName + ' ' + user.lastName,
                        Email: user.email,
                        UserType: this.renderUserType(user)
                      });
                    }

                    exportToCSV(data, "table");

                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to Excel</div>
                    <SpriteIcon name="excel-icon" />
                  </div>
                  <div className="btn-sort" onClick={() => {
                    exportToPDF(
                      [['Joined', 'Name', 'Email', 'User Type']],
                      this.state.users.map(u => {
                        return [u.created?.toString(), u.firstName + ' ' + u.lastName, u.email, this.renderUserType(u)]
                      }),
                      'table.pdf'
                    );
                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to PDF</div>
                    <img alt="brill" src="/images/PDF_icon.png" />
                  </div>
                </div>
              </Dialog>}
              {this.renderTable()}
              {this.renderPagination()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(UsersPage);
