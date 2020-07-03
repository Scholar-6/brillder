import './UsersList.scss';
import React, { Component } from 'react';
import { Grid, FormControlLabel, Radio, Button, RadioGroup } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
// @ts-ignore
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import grey from '@material-ui/core/colors/grey';

import authActions from 'redux/actions/auth';
import brickActions from 'redux/actions/brickActions';
import PageHeader from 'components/baseComponents/pageHeader/PageHeader';
import SubjectsList from 'components/baseComponents/subjectsList/SubjectsList';
import AddUserButton from './AddUserButton';

import { User, UserType, UserStatus } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
})

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  logout: () => dispatch(authActions.logout()),
})

const connector = connect(mapState, mapDispatch);

interface UsersListProps {
  user: User,
  history: any;
  logout(): void;
  forgetBrick(): void;
}

enum UserSortBy {
  None,
  Name,
  Role,
  Status
}

interface UsersListState {
  users: User[];
  page: number;
  pageSize: number;
  totalCount: number;

  searchString: string;
  isSearching: boolean;

  subjects: any[];
  roles: any[];

  filterExpanded: boolean;
  logoutDialogOpen: boolean;
  dropdownShown: boolean;
  filterHeight: string;

  sortBy: UserSortBy;
  isAscending: boolean;
  isClearFilter: boolean
}

let anyStyles = withStyles as any;

const IOSSwitch = anyStyles((theme:any) => ({
  root: {
    width: '4.5vh',
    height: '2.8vh',
    padding: 0,
    margin: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: '#30C474',
      '& + $track': {
        borderRadius: '2vh',
        border: '0.25vh solid #001C58',
        height: '2.3vh',
        backgroundColor: '#30C474',
        opacity: 1,
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    marginTop: '0.6vh',
    marginLeft: '0.4vh',
    marginRight: '0.4vh',
    border: '0.2vh solid #001C58',
    width: '0.9vh',
    height: '0.9vh',
  },
  track: {
    borderRadius: '2vh',
    border: '0.25vh solid #001C58',
    height: '2.3vh',
    backgroundColor: grey[50],
    opacity: 1,
  },
  checked: {},
}))((props:any) => {
  return (
    <Switch
      disableRipple
      {...props}
    />
  );
});


class UsersListPage extends Component<UsersListProps, UsersListState> {
  constructor(props: UsersListProps) {
    super(props)
    this.state = {
      users: [],
      page: 0,
      pageSize: 12,
      subjects: [],
      filterExpanded: true,
      logoutDialogOpen: false,

      roles: [
        { name: 'Student', type: UserType.Student, checked: false },
        { name: 'Teacher', type: UserType.Teacher, checked: false },
        { name: 'Builder', type: UserType.Builder, checked: false },
        { name: 'Editor', type: UserType.Editor, checked: false },
        { name: 'Admin', type: UserType.Admin, checked: false },
      ],

      totalCount: 0,
      searchString: '',
      isSearching: false,
      dropdownShown: false,
      filterHeight: 'auto',

      sortBy: UserSortBy.None,
      isAscending: false,
      isClearFilter: false
    };

    this.getUsers(this.state.page);

    axios.get(
      process.env.REACT_APP_BACKEND_HOST + '/subjects', {withCredentials: true}
    ).then(res => {
      this.setState({...this.state, subjects: res.data });
    }).catch(error => {
      alert('Can`t get subjects');
    });
  }

  getUsers(
    page: number, subjects: number[] = [], sortBy: UserSortBy = UserSortBy.None,
    isAscending: any = null, search: string = ""
  ) {
    let searchString = "";
    let orderBy = null;

    if (sortBy === UserSortBy.None) {
      sortBy = this.state.sortBy;
    }

    if (isAscending === null) {
      isAscending = this.state.isAscending;
    }

    if (sortBy) {
      if (sortBy === UserSortBy.Name) {
        orderBy = "user.lastName";
      } else if (sortBy === UserSortBy.Status) {
        orderBy = "user.status";
      } else if (sortBy === UserSortBy.Role) {
        orderBy = "user.roles";
      }
    }

    if (search) {
      searchString = search;
    } else {
      if (this.state.isSearching) {
        searchString = this.state.searchString;
      }
    }

    axios.post(
      process.env.REACT_APP_BACKEND_HOST + '/users',
      {
        pageSize: this.state.pageSize,
        page: page.toString(),
        searchString,
        subjectFilters: subjects,
        roleFilters: [],
        orderBy,
        isAscending,
      },
      {withCredentials: true}
    ).then(res => {
      this.setState({...this.state, users: res.data.pageData, totalCount: res.data.totalCount})
    }).catch(error => {
      alert('Can`t get users');
    });
  }

  logout() {
    this.props.logout();
    this.props.history.push('/choose-login');
  }

  move(brickId:number) {
    this.props.history.push(`/build/brick/${brickId}/build/investigation/question`)
  }

  handleSortChange = (e: any) => {
  }

  getCheckedRoles() {
    const result = [];
    const {state} = this;
    const {roles} = state;
    for (let role of roles) {
      if (role.checked) {
        result.push(role.type);
      }
    }
    return result;
  }

  handleLogoutOpen() {
    this.setState({...this.state, logoutDialogOpen: true})
  }

  handleLogoutClose() {
    this.setState({...this.state, logoutDialogOpen: false})
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({...this.state, searchString, isSearching: false});
    } else {
      this.setState({...this.state, searchString});
    }
  }

  activateUser(userId: number) {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/activate/${userId}`, {}, {withCredentials: true} as any
    ).then(res => {
      if (res.data === 'OK') {
        const user = this.state.users.find(user => user.id === userId);
        if (user) {
          user.status = UserStatus.Active;
        }
        this.setState({...this.state});
      }
    }).catch(error => {
      alert('Can`t activate user');
    });
  }

  deactivateUser(userId: number) {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/deactivate/${userId}`, {}, {withCredentials: true} as any
    ).then(res => {
      if (res.data === 'OK') {
        const user = this.state.users.find(user => user.id === userId);
        if (user) {
          user.status = UserStatus.Disabled;
        }
        this.setState({...this.state});
      }
    }).catch(error => {
      alert('Can`t deactivate user');
    });
  }

  toggleUser(user: User) {
    if (user.status === UserStatus.Active) {
      this.deactivateUser(user.id);
    } else {
      this.activateUser(user.id);
    }
  }

  search() {
    const { searchString } = this.state;
    let filterSubjects = this.getCheckedSubjectIds();
    this.getUsers(0, filterSubjects, this.state.sortBy, this.state.isAscending, searchString);
  }

  showDropdown() {
    this.setState({...this.state, dropdownShown: true});
  }

  hideDropdown() {
    this.setState({...this.state, dropdownShown: false});
  }

  filterBySubject = (i: number) => {
    const {subjects} = this.state;
    subjects[i].checked = !subjects[i].checked
    this.filter();
	this.setState({...this.state});
	this.filterClear()
  }

  getCheckedSubjectIds() {
    const filterSubjects = [];
    const {state} = this;
    const {subjects} = state;
    for (let subject of subjects) {
      if (subject.checked) {
        filterSubjects.push(subject.id);
      }
    }
    return filterSubjects;
  }

  filter() {
    let filterSubjects = this.getCheckedSubjectIds();
    this.getUsers(0, filterSubjects);
  }


  //region Hide / Expand / Clear Filter
  clearStatus() {
    let { state } = this;
    let { subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    this.filter();
    this.filterClear()
  }
	hideFilter() {
		this.setState({ ...this.state, filterExpanded: false, filterHeight: "0" });
	}

	expandFilter() {
		this.setState({
		  ...this.state,
		  filterExpanded: true,
		  filterHeight: "auto",
		});
	}

  filterClear() {
		this.setState({ isClearFilter: this.state.subjects.some((r: any) => r.checked) ? true : false})
	}
	//endregion


  renderSortAndFilterBox = () => {
    return (
		  <div className="sort-box">
			<div className="filter-container sort-by-box">
				<div className="sort-header">Filter by: Role</div>
				<RadioGroup
					className="sort-group"
					aria-label="SortBy"
					name="SortBy"
					value={this.state.sortBy}
					onChange={this.handleSortChange}>
					<Grid container direction="row">
						{this.state.roles.map((role, i) =>
						<Grid item xs={4} key={i}>
							<FormControlLabel
							checked={role.checked}
							control={<Radio className={"filter-radio"} />}
							label={role.name}/>
						</Grid>
          				)}
					</Grid>
				</RadioGroup>
			</div>
			<div className="filter-header">
				<span>Filter by: Subject</span>
				<button className={"btn-transparent filter-icon " + (this.state.filterExpanded ? this.state.isClearFilter ? ("arrow-cancel") : ("arrow-down") : ("arrow-up")) }
					onClick={() => {this.state.filterExpanded ? this.state.isClearFilter ? this.clearStatus() : (this.hideFilter()) : (this.expandFilter())}}>
				</button>
			</div>
			<SubjectsList
				subjects = {this.state.subjects}
				filterHeight={this.state.filterHeight}
				filterBySubject={this.filterBySubject}/>
      </div>
	  );
  }

  renderPagination() {
    const {totalCount, users, page, pageSize} = this.state;
    const showPrev = page > 0;
    const currentPage = page;
    const showNext = ((totalCount / pageSize) - currentPage) > 1;
    const prevCount = currentPage * pageSize;
    const minUser = prevCount + 1;
    const maxUser = prevCount + users.length;

    const nextPage = () => {
      this.setState({...this.state, page: page + 1});
      this.getUsers(page + 1);
    }

    const previousPage = () => {
      this.setState({...this.state, page: page - 1});
      this.getUsers(page - 1);
    }

    return (
      <Grid container direction="row" className="users-pagination">
        <Grid item xs={4} className="left-pagination">
          <div className="first-row">
            {minUser}-{maxUser}
            <span className="gray"> &nbsp;|&nbsp; {totalCount}</span>
          </div>
          <div>
            {page + 1}
            <span className="gray"> &nbsp;|&nbsp; {Math.ceil(totalCount / pageSize)}</span>
          </div>
        </Grid>
        <Grid container item xs={4} justify="center" className="bottom-next-button">
          <div>
            { showPrev ? <ExpandLessIcon onClick={previousPage} className="prev-button active" /> : "" }
            { showNext ? <ExpandMoreIcon onClick={nextPage} className="next-button active" /> : "" }
          </div>
        </Grid>
      </Grid>
    );
  }

  renderUserType(user: User) {
    let type = "";

    for (let role of user.roles) {
      if (role.roleId === UserType.Admin) {
        type += "A";
      } else if (role.roleId === UserType.Builder) {
        type += "B";
      } else if (role.roleId === UserType.Editor) {
        type += "E";
      } else if (role.roleId === UserType.Student) {
        type += "S";
      } else if (role.roleId === UserType.Teacher) {
        type += "T";
      }
    }
    return type;
  }

  sortBy(sortBy: UserSortBy) {
    let isAscending = this.state.isAscending;

    if (sortBy === this.state.sortBy) {
      isAscending = !isAscending;
      this.setState({...this.state, isAscending});
    } else {
      isAscending = false;
      this.setState({...this.state, isAscending, sortBy});
    }
    let filterSubjects = this.getCheckedSubjectIds();
    this.getUsers(this.state.page, filterSubjects, sortBy, isAscending);
  }

  renderSortArrow(currentSortBy: UserSortBy) {
    const {sortBy, isAscending} = this.state;

    return (
      <img
        className="sort-button" alt=""
        src={
          sortBy === currentSortBy
            ? !isAscending ? "/feathericons/chevron-down.svg"
              : "/feathericons/chevron-up.svg"
            : "/feathericons/chevron-right.svg"
        }
        onClick={() => this.sortBy(currentSortBy)}
      />
    );
  }

  renderUserTableHead() {
    return (
      <tr>
        <th className="subject-title">SC</th>
        <th className="user-full-name">
          <Grid container>
            NAME
            {this.renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th className="email-column">EMAIL</th>
        <th>
          <Grid container>
            ROLE
            {this.renderSortArrow(UserSortBy.Role)}
          </Grid>
        </th>
        <th>
          <Grid container>
            ACTIVE?
            {this.renderSortArrow(UserSortBy.Status)}
          </Grid>
        </th>
        <th className="edit-button-column"></th>
      </tr>
    );
  }

  renderUsers() {
    if (!this.state.users) { return "" }
    return (
      <table className="users-table" cellSpacing="0" cellPadding="0">
        <thead>
          {this.renderUserTableHead()}
        </thead>
        <tbody>
        {
          this.state.users.map((user:any, i:number) => {
            return (
              <tr className="user-row" key={i}>
                <td></td>
                <td>
                  <span className="user-first-name">{user.firstName} </span>
                  <span className="user-last-name">{user.lastName}</span>
                </td>
                <td>{user.email}</td>
                <td>{this.renderUserType(user)}</td>
                <td className="activate-button-container">
                  <IOSSwitch
                    checked={user.status === UserStatus.Active}
                    onChange={() => this.toggleUser(user)}
                  />
                </td>
                <td>
                  <div className="edit-button" onClick={() => this.props.history.push(`/build/user-profile/${user.id}`)}/>
                </td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    );
  }

  renderRoleDescription() {
    return (
      <div className="role-description">
        <span className="bold">S</span>: Student,&nbsp;
        <span className="bold">T</span>: Teacher,&nbsp;
        <span className="bold">B</span>: Builder,&nbsp;
        <span className="bold">E</span>: Editor,&nbsp;
        <span className="bold">A</span>: Admin
      </div>
    );
  }

  renderTableHeader() {
    return (
      <Grid container direction="row">
        <Grid item xs={7}>
          <div className="brick-row-title">
            ALL USERS
          </div>
        </Grid>
        <Grid container item xs={5} justify="flex-end">
          <AddUserButton history={this.props.history} />
        </Grid>
      </Grid>
    );
  }

  render() {
    const {history} = this.props;
    return (
      <div className="user-list-page">
        <div className="upper-part">
          <PageHeader
            searchPlaceholder="Search by Name,  Email or Subject"
            search={() => this.search()}
            searching={(v: string) => this.searching(v)}
            showDropdown={() => this.showDropdown()}
          />
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
              {this.renderSortAndFilterBox()}
            </Grid>
            <Grid item xs={9} className="brick-row-container">
              {this.renderTableHeader()}
              <Grid container direction="row">
                {this.renderUsers()}
                {this.renderRoleDescription()}
              </Grid>
              {this.renderPagination()}
            </Grid>
          </Grid>
        </div>
        <Menu
          className="menu-dropdown"
          keepMounted
          open={this.state.dropdownShown}
          onClose={() => this.hideDropdown()}
        >
          <MenuItem className="first-item menu-item" onClick={() => history.push('/build/bricks-list')}>
            View All Bricks
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon" alt="" src="/images/main-page/glasses-white.png" />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => {}}>
            Start Building
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon" alt="" src="/images/main-page/create-white.png" />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => history.push('/build/back-to-work')}>
            Back To Work
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="back-to-work-icon" alt="" src="/images/main-page/backToWork-white.png" />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="view-profile menu-item" onClick={() => this.props.history.push('/build/user-profile')}>
            View Profile
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon svg-icon user-icon" alt="" src="/images/user.svg" />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => this.handleLogoutOpen()}>
            Logout
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon svg-icon logout-icon" alt="" src="/images/log-out.svg" />
              </div>
            </Grid>
          </MenuItem>
        </Menu>
        <Dialog
          open={this.state.logoutDialogOpen}
          onClose={() => this.handleLogoutClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="alert-dialog"
        >
          <div className="logout-dialog-header">
            <div>Are you sure you want</div>
            <div>to log out?</div>
          </div>
          <Grid container direction="row" className="logout-buttons" justify="center">
            <Button className="yes-button" onClick={() => this.logout()}>Yes</Button>
            <Button className="no-button" onClick={() => this.handleLogoutClose()}>No</Button>
          </Grid>
        </Dialog>
      </div>
    )
  }
}

export default connector(UsersListPage);
