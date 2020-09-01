import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from 'react-redux';

import actions from "redux/actions/brickActions";

import sprite from "assets/img/icons-sprite.svg";
import { User } from "model/user";
import { PageEnum } from "./PageHeadWithMenu";
import { clearProposal } from 'localStorage/proposal';


import { ProposalSubject } from "components/map";
import { checkAdmin, checkTeacherOrAdmin } from "components/services/brickService";

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(actions.forgetBrick())
});

const connector = connect(null, mapDispatch);

interface MenuDropdownProps {
  dropdownShown: boolean;
  hideDropdown(): void;
  user: User;
  page: PageEnum;
  history: any;
  onLogout(): void;
  forgetBrick(): void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = (props) => {
  const { page } = props;

  const move = (link: string) => props.history.push(link);

  const creatingBrick = () => {
    clearProposal();
    props.forgetBrick();
    move(ProposalSubject);
  };

  const renderViewAllItem = () => {
    if (page !== PageEnum.ViewAll && page !== PageEnum.MainPage) {
      return (
        <MenuItem
          className="first-item menu-item"
          onClick={() => move("/play/dashboard")}
        >
          <span className="menu-text">View All Bricks</span>
          <div className="btn btn-transparent svgOnHover">
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#glasses"} className="text-white" />
            </svg>
          </div>
        </MenuItem>
      );
    }
    return "";
  };

  const renderStartBuildItem = () => {
    if (page !== PageEnum.MainPage) {
      return (
        <MenuItem className="menu-item" onClick={creatingBrick}>
          <span className="menu-text">Start Building</span>
          <div className="btn btn-transparent svgOnHover">
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#trowel"} className="text-white" />
            </svg>
          </div>
        </MenuItem>
      );
    }
    return "";
  };

  const renderManageClassesItem = () => {
    if (page !== PageEnum.ManageClasses && page !== PageEnum.MainPage) {
      const canSee = checkTeacherOrAdmin(props.user.roles);
      if (canSee) {
        return (
          <MenuItem className="menu-item" onClick={() => move('/manage-classrooms')}>
            <span className="menu-text">Manage Classes</span>
          </MenuItem>
        );
      }
    }
    return "";
  };

  const renderBackToWorkItem = () => {
    if (page !== PageEnum.BackToWork && page !== PageEnum.MainPage) {
      return (
        <MenuItem
          className="menu-item"
          onClick={() => move("/back-to-work")}
        >
          <span className="menu-text">Back To Work</span>
          <div className="btn btn-transparent svgOnHover">
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#roller"} className="text-white" />
            </svg>
          </div>
        </MenuItem>
      );
    }
    return "";
  };

  const renderManageUsersItem = () => {
    let isAdmin = checkAdmin(props.user.roles);

    if (isAdmin && props.page !== PageEnum.ManageUsers) {
      return (
        <MenuItem
          className="menu-item"
          onClick={() => move("/users")}
        >
          <span className="menu-text">Manage Users</span>
          <div className="btn btn-transparent svgOnHover">
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#users"} className="text-white" />
            </svg>
          </div>
        </MenuItem>
      );
    }
    return "";
  };

  const renderProfileItem = () => {
    if (page !== PageEnum.Profile) {
      return (
        <MenuItem
          className="view-profile menu-item"
          onClick={() => move("/user-profile")}
        >
          <span className="menu-text">View Profile</span>
          <div className="btn btn-transparent svgOnHover">
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#user"} className="text-white" />
            </svg>
          </div>
        </MenuItem>
      );
    }
    return "";
  };

  return (
    <Menu
      className="menu-dropdown"
      open={props.dropdownShown}
      onClose={props.hideDropdown}
    >
      {renderViewAllItem()}
      {renderStartBuildItem()}
      {renderBackToWorkItem()}
      {renderManageUsersItem()}
      {renderManageClassesItem()}
      {renderProfileItem()}
      <MenuItem className="menu-item" onClick={props.onLogout}>
        <span className="menu-text">Logout</span>
        <div className="btn btn-transparent svgOnHover">
          <svg className="svg active logout-icon">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#logout"} className="text-white" />
          </svg>
        </div>
      </MenuItem>
    </Menu>
  );
};

export default connector(MenuDropdown);
