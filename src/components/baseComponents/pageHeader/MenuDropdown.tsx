import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import sprite from "assets/img/icons-sprite.svg";
import { User, UserType } from "model/user";
import { PageEnum } from "./PageHeadWithMenu";
import { clearProposal } from 'components/localStorage/proposal';

import { ProposalSubject } from "components/map"

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
  const creatingBrick = () => {
    clearProposal();
    props.forgetBrick();
    props.history.push(ProposalSubject);
  };

  const renderViewAllItem = () => {
    if (page !== PageEnum.ViewAll && page !== PageEnum.MainPage) {
      return (
        <MenuItem
          className="first-item menu-item"
          onClick={() => props.history.push("/play/dashboard")}
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

  const renderBackToWorkItem = () => {
    if (page !== PageEnum.BackToWork && page !== PageEnum.MainPage) {
      return (
        <MenuItem
          className="menu-item"
          onClick={() => props.history.push("/back-to-work")}
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
    let isAdmin = props.user.roles.some(
      (role) => role.roleId === UserType.Admin
    );

    if (isAdmin && props.page !== PageEnum.ManageUsers) {
      return (
        <MenuItem
          className="menu-item"
          onClick={() => props.history.push("/users")}
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
      <MenuItem
        className="view-profile menu-item"
        onClick={() => props.history.push("/user-profile")}
      >
        <span className="menu-text">View Profile</span>
        <div className="btn btn-transparent svgOnHover">
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#user"} className="text-white" />
          </svg>
        </div>
      </MenuItem>
      <MenuItem className="menu-item" onClick={props.onLogout}>
        <span className="menu-text">Logout</span>
        <div className="btn btn-transparent svgOnHover">
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#logout-thick"} className="text-white" />
          </svg>
        </div>
      </MenuItem>
    </Menu>
  );
};

export default MenuDropdown;
