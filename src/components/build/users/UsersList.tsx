import './UsersList.scss';
import React, { Component } from 'react';
import { Grid, FormControlLabel, Radio, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
// @ts-ignore
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ClearIcon from '@material-ui/icons/Clear';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import authActions from 'redux/actions/auth';
import brickActions from 'redux/actions/brickActions';

import { User, UserType } from 'model/user';


const mapState = (state: any) => {
  return {
    user: state.user.user,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    forgetBrick: () => dispatch(brickActions.forgetBrick()),
    logout: () => dispatch(authActions.logout()),
  }
}

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  user: User,
  history: any;
  logout(): void;
  forgetBrick(): void;
}

interface BricksListState {
  users: User[];
  page: number;
  searchString: string;
  isSearching: boolean;
  subjects: any[];
  roles: any[];
  sortedIndex: number;
  filterExpanded: boolean;
  logoutDialogOpen: boolean;

  deleteDialogOpen: boolean;
  deleteBrickId: number;
  dropdownShown: boolean;
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
    backgroundColor: theme.palette.grey[50],
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


class BricksListPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props)
    this.state = {
      users: [],
      page: 0,
      subjects: [],
      sortedIndex: 0,
      filterExpanded: true,
      logoutDialogOpen: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,
      roles: [
        { name: 'Student', type: UserType.Student, checked: false },
        { name: 'Teacher', type: UserType.Teacher, checked: false },
        { name: 'Builder', type: UserType.Builder, checked: false },
        { name: 'Editor', type: UserType.Editor, checked: false },
        { name: 'Admin', type: UserType.Admin, checked: false },
      ],

      searchString: '',
      isSearching: false,
      dropdownShown: false
    };

    axios.get(process.env.REACT_APP_BACKEND_HOST + '/users', {withCredentials: true, pageSize: 19, page: 0} as any)
      .then(res => {
        this.setState({...this.state, users: res.data})
      })
      .catch(error => { 
        alert('Can`t get bricks');
      });

    axios.get(process.env.REACT_APP_BACKEND_HOST + '/subjects', {withCredentials: true})
    .then(res => {
      this.setState({...this.state, subjects: res.data });
    })
    .catch(error => {
      alert('Can`t get bricks');
    });
  }

  logout() {
    this.props.logout();
    this.props.history.push('/choose-user');
  }

  move(brickId:number) {
    this.props.history.push(`/build/brick/${brickId}/build/investigation/question`)
  }

  formatTwoLastDigits(twoLastDigits: number) {
    var formatedTwoLastDigits = "";
    if (twoLastDigits < 10 ) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  getYear(date: Date) {
    var currentYear =  date.getFullYear();   
    var twoLastDigits = currentYear % 100;
    return this.formatTwoLastDigits(twoLastDigits);
  }

  getMonth(date: Date) {
    const month = date.getMonth() + 1;
    var twoLastDigits = month % 10;
    return this.formatTwoLastDigits(twoLastDigits);
  }

  getDate(date: Date) {
    const days = date.getDate();
    return this.formatTwoLastDigits(days);
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

  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  activateUser(userId: number) {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/activate/${userId}`, {}, {withCredentials: true} as any
    ).then(res => {
      console.log(res);
    }).catch(error => { 
      alert('Can`t activate user');
    });
  }

  deactivateUser(userId: number) {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/deactivate/${userId}`, {}, {withCredentials: true} as any
    ).then(res => {
      console.log(res);
    }).catch(error => { 
      alert('Can`t deactivate user');
    });
  }

  toggleUser(user: User) {
    if (user.status === 1) {
      this.deactivateUser(user.id);
    } else {
      this.activateUser(user.id);
    }
  }

  search() {
  }

  showDropdown() {
    this.setState({...this.state, dropdownShown: true});
  }

  hideDropdown() {
    this.setState({...this.state, dropdownShown: false});
  }

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box">
        <div className="role-filter-header">Filter by: role</div>
        <Grid container direction="row" className="roles-row">
          {
            this.state.roles.map((role, i) => 
              <Grid item xs={4} key={i}>
                <FormControlLabel
                  className="filter-container"
                  checked={role.checked}
                  control={<Radio className={"filter-radio"} />}
                  label={role.name}
                />
              </Grid>
            )
          }
        </Grid>
        <div className="filter-header">
          <div style={{ display: 'inline' }}>
            <span className='filter-control'>Filter by: Subject</span>
            {
              this.state.filterExpanded
                ? <ExpandLessIcon className='filter-control' style={{ fontSize: '3vw' }}
                    onClick={() => this.setState({ ...this.state, filterExpanded: false })} />
                : <ExpandMoreIcon className='filter-control' style={{ fontSize: '3vw' }}
                    onClick={() => this.setState({ ...this.state, filterExpanded: true })} />
            }
            {
              this.state.subjects.some((r: any) => r.checked)
              ? <ClearIcon className='filter-control' style={{ fontSize: '2vw' }} onClick={() => {}} />
              : ''
            }
          </div>
        </div>
        <Grid container direction="row">
        {
          this.state.filterExpanded
              ? this.state.subjects.map((subject, i) =>
                <Grid item xs={((i % 2) === 1) ? 7 : 5} key={i}>
                  <FormControlLabel
                    className="filter-container"
                    checked={subject.checked}
                    control={<Radio className={"filter-radio custom-color"} style={{['--color' as any] : subject.color}} />}
                    label={subject.name}
                  />
                </Grid>
              )
              : ''
        }
        </Grid>
      </div>
    );
  }

  renderTitle = () => {
    return "ALL USERS";
  }

  renderPagination() {
    const showPrev = this.state.sortedIndex >= 15;
    const showNext = this.state.sortedIndex + 15 <= this.state.users.length;
    
    return (
      <Grid container direction="row" className="bricks-pagination">
        <Grid item xs={4} className="left-pagination">
          <div className="first-row">
            {this.state.sortedIndex + 1}-{  
              this.state.sortedIndex + 15 > this.state.users.length
                ? this.state.users.length
                : this.state.sortedIndex + 15
            }
            <span className="grey"> &nbsp;|&nbsp; {this.state.users.length}</span>
          </div>
          <div>
            {(this.state.sortedIndex + 15) / 15}
            <span className="grey"> &nbsp;|&nbsp; {Math.ceil(this.state.users.length / 15)}</span>
          </div>
        </Grid>
        <Grid container item xs={4} justify="center" className="bottom-next-button">
          <div>
            {
              showPrev ? (
                <ExpandLessIcon
                  className={"prev-button " + (showPrev ? "active" : "")}
                />
              ) : ""
            }
            {
              showNext ? (
                <ExpandMoreIcon
                  className={"next-button " + (showNext ? "active" : "")}
                />
              ) : ""
            }
          </div>
        </Grid>
      </Grid>
    );
  }

  renderUserType(user: User) {
    let type = "";
    if (user.type === UserType.Admin) {
      type = "A";
    } else if (user.type === UserType.Builder) {
      type = "B";
    } else if (user.type === UserType.Editor) {
      type = "E";
    } else if (user.type === UserType.Student) {
      type = "S";
    } else if (user.type === UserType.Teacher) {
      type = "T";
    }
    return type;
  }

  renderUsers() {
    if (!this.state.users) { return "" }
    return (
      <table className="users-table" cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th className="subject-title">SC</th>
            <th className="user-full-name">NAME</th>
            <th className="email-column">EMAIL</th>
            <th>ROLE</th>
            <th>ACTIVE?</th>
            <th className="edit-button-column"></th>
          </tr>
        </thead>
        <tbody>
        {
          this.state.users.map((user:any, i:number) => {
            if (i > 11) { return <tr key={i}></tr>}
            return (
              <tr className="user-row" key={i}>
                <td></td>
                <td>{user.firstName} <span className="user-last-name">{user.lastName}</span></td>
                <td>{user.email}</td>
                <td>{this.renderUserType(user)}</td>
                <td className="activate-button-container">
                  <IOSSwitch checked={user.status === 1} onChange={() => this.toggleUser(user)} />
                </td>
                <td><div className="edit-button" />
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

  render() {
    const {history} = this.props;
    return (
      <div className="user-list-page">
        <div className="bricks-upper-part">
          <Grid container direction="row" className="bricks-header">
            <Grid item style={{width: '7.65vw'}}>
              <Grid container direction="row">
                <Grid item className="home-button-container">
                  <div className="home-button" onClick={() => { history.push('/build') }}>
                    <div></div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid container className="logout-container" item direction="row" style={{width: '92.35vw'}}>
              <Grid container style={{width: '60vw', height: '7vh'}}>
              <Grid item>
                <div className="search-button" onClick={() => this.search()}></div>
              </Grid>
              <Grid item>
                <input
                  className="search-input"
                  onKeyUp={(e) => this.keySearch(e)}
                  onChange={(e) => this.searching(e.target.value)}
                  placeholder="Search by Name,  Email or Subject" />
              </Grid>
              </Grid>
              <Grid item style={{width: '32.35vw'}}>
                <Grid container direction="row" justify="flex-end">
                  <div className="bell-button"><div></div></div>
                  <div className="more-button" onClick={() => this.showDropdown()}></div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
              {this.renderSortAndFilterBox()}
            </Grid>
            <Grid item xs={9} style={{position: 'relative'}}>
              <div className="brick-row-container">
                <div className="brick-row-title">
                  {this.renderTitle()}
                </div>
                <Grid container direction="row">
                  {this.renderUsers()}
                  {this.renderRoleDescription()}
                </Grid>
                {this.renderPagination()}
              </div>
            </Grid>
          </Grid>
        </div>
        <Menu
          className="users-list-redirect-dropdown"
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
          <MenuItem className="view-profile menu-item">
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

export default connector(BricksListPage);
