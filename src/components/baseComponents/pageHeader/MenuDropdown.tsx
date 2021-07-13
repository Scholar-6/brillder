import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from 'react-redux';

import actions from "redux/actions/brickActions";

import { RolePreference, User, UserType } from "model/user";
import { PageEnum } from "./PageHeadWithMenu";
import { clearProposal } from 'localStorage/proposal';


import map, { ProposalSubjectLink } from "components/map";
import { checkAdmin, checkTeacherOrAdmin } from "components/services/brickService";
import SpriteIcon from "../SpriteIcon";
import FullScreenButton from "./fullScreenButton/FullScreen";
import { isIPad13, isMobile, isTablet } from "react-device-detect";
import PlaySkipDialog from "../dialogs/PlaySkipDialog";
import { isPhone } from "services/phone";

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
  const {hasPlayedBrick} = props.user;
  const [playSkip, setPlaySkip] = React.useState({
    isOpen: false,
    label: '',
    link: ''
  });

  let isStudent = false;
  if (props.user.rolePreference?.roleId === UserType.Student) {
    isStudent = true;
  }

  const checkPlay = () => {
    const {pathname} = props.history.location;
    if (pathname.slice(0, 12) === '/play/brick/') {
      return true;
    }
    return false;
  }

  const move = (link: string, label: string) => {
    let isPlay = checkPlay();
    if (isPlay) {
      setPlaySkip({ isOpen: true, link, label });
    } else {
      props.history.push(link);
    }
  }

  const creatingBrick = () => {
    let isPlay = checkPlay();
    if (isPlay) {
      setPlaySkip({ isOpen: true, link: ProposalSubjectLink, label: 'Start Building' });
    } else {
      clearProposal();
      props.forgetBrick();
      move(ProposalSubjectLink, '');
    }
  };

  const renderViewAllItem = () => {
    if (page !== PageEnum.ViewAll && page !== PageEnum.MainPage) {
      return (
        <MenuItem
          className="first-item menu-item"
          onClick={() => {
            if (isMobile) {
              move("/play/dashboard/1", 'View All Bricks');
            } else {
              move("/play/dashboard", 'View All Bricks');
            }
          }}
        >
          <span className="menu-text">View All Bricks</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="glasses" className="active text-white" />
          </div>
        </MenuItem>
      );
    }
  };

  const renderBuildingButton = () => {
    return (
      <MenuItem className="menu-item" onClick={creatingBrick}>
        <span className="menu-text">Start Building</span>
        <div className="btn btn-transparent svgOnHover">
          <SpriteIcon name="trowel" className="active text-white" />
        </div>
      </MenuItem>
    );
  }

  const renderStartBuildItem = () => {
    if (isIPad13 || isTablet) { return <div/>; }

    if (page !== PageEnum.MainPage) {
      if (isStudent) {
        if (hasPlayedBrick) {
          return renderBuildingButton();
        } else {
          return "";
        }
      }
      return renderBuildingButton();
    }
    return '';
  };

  const renderManageClassesItem = () => {
    if (isIPad13 || isTablet) { return <div/>; }
    const {user} = props;
    if (page !== PageEnum.ManageClasses && page !== PageEnum.MainPage && user) {
      let canSee = checkTeacherOrAdmin(user);
      if (!canSee && user.rolePreference) {
        if (user.rolePreference.roleId === RolePreference.Teacher) {
          canSee = true
        }
      }
      if (canSee) {
        return (
          <MenuItem className="menu-item" onClick={() => move(map.ManageClassroomsTab, 'Manage Classes')}>
            <span className="menu-text">Manage Classes</span>
            <div className="btn btn-transparent svgOnHover">
              <SpriteIcon name="manage-class" className="active text-white" />
            </div>
          </MenuItem>
        );
      }
    }
  };

  const renderBackToWorkItem = () => {
    if (isMobile || isIPad13 || isTablet) { return <div/>; }
    if (page !== PageEnum.BackToWork && page !== PageEnum.MainPage) {
      return (
        <MenuItem className="menu-item" onClick={() => move(map.backToWorkUserBased(props.user), 'Back To Work')}>
          <span className="menu-text">Back To Work</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="student-back-to-work" className="active text-white" />
          </div>
        </MenuItem>
      );
    }
  };

  const renderAssignmentsItem = () => {
    if (!isMobile) { return <div/>; }
    if (page !== PageEnum.BackToWork && page !== PageEnum.MainPage) {
      return (
        <MenuItem className="menu-item" onClick={() => move(map.AssignmentsPage, 'Assignments')}>
          <span className="menu-text">Assignments</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="student-back-to-work" className="active text-white" />
          </div>
        </MenuItem>
      );
    }
  };

  const renderManageUsersItem = () => {
    if (isIPad13 || isTablet) { return <div/>; }
    if (props.user && checkAdmin(props.user.roles) && props.page !== PageEnum.ManageUsers) {
      return (
        <MenuItem className="menu-item" onClick={() => move("/users", 'Manage Users')}>
          <span className="menu-text">Manage Users</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="users" className="active text-white" />
          </div>
        </MenuItem>
      );
    }
  };

  const renderProfileItem = () => {
    if (page !== PageEnum.Profile) {
      return (
        <MenuItem className="view-profile menu-item" onClick={() => move(map.UserProfile, 'View Profile')}>
          <span className="menu-text">View Profile</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="user" className="active text-white" />
          </div>
        </MenuItem>
      );
    }
  };

  const renderMyLibraryItem = () => {
    if (page !== PageEnum.MainPage && page !== PageEnum.MyLibrary) {
      return (
        <MenuItem className="view-profile menu-item" onClick={() => move("/my-library", 'My Library')}>
          <span className="menu-text">My Library</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="book-open" className="active text-white stroke-2" />
          </div>
        </MenuItem>
      );
    }
  }

  return (
    <Menu
      className="menu-dropdown"
      open={props.dropdownShown}
      onClose={props.hideDropdown}
    >
      {renderViewAllItem()}
      {!isMobile && renderStartBuildItem()}
      {isPhone() ? renderAssignmentsItem() : renderBackToWorkItem()}
      {renderManageUsersItem()}
      {renderManageClassesItem()}
      {renderMyLibraryItem()}
      {isPhone() && <FullScreenButton />}
      {renderProfileItem()}
      <MenuItem className="menu-item" onClick={props.onLogout}>
        <span className="menu-text">Logout</span>
        <div className="btn btn-transparent svgOnHover">
          <SpriteIcon name="logout" className="active logout-icon text-white" />
        </div>
      </MenuItem>
      <PlaySkipDialog
        isOpen={playSkip.isOpen}
        label={playSkip.label}
        submit={() => {
          if (playSkip.link === ProposalSubjectLink) {
            clearProposal();
            props.forgetBrick();
          }
          props.history.push(playSkip.link)
        }}
        close={() => setPlaySkip({ isOpen: false, link: '', label: '' })}
      />
    </Menu>
  );
};

export default connector(MenuDropdown);
