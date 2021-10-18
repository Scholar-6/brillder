import React, { useEffect } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from 'react-redux';

import actions from "redux/actions/brickActions";

import { User } from "model/user";
import { PageEnum } from "./PageHeadWithMenu";
import { clearProposal } from 'localStorage/proposal';


import map, { ProposalSubjectLink } from "components/map";
import { checkAdmin, checkTeacherOrAdmin } from "components/services/brickService";
import SpriteIcon from "../SpriteIcon";
import FullScreenButton from "./fullScreenButton/FullScreen";
import { isIPad13, isMobile, isTablet } from "react-device-detect";
import PlaySkipDialog from "../dialogs/PlaySkipDialog";
import { isPhone } from "services/phone";
import { getAssignedBricks, getLibraryBricks } from "services/axios/brick";
import LockedDialog from "../dialogs/LockedDialog";
import { isBuilderPreference, isStudentPreference } from "components/services/preferenceService";

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
  className?: string;
  onLogout(): void;
  forgetBrick(): void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = (props) => {
  const { page } = props;
  const {hasPlayedBrick} = props.user;
  
  const [assignedCount, setAssignedCount] = React.useState(0);
  const [noAassignmentsOpen, setNoAssignments] = React.useState(false);

  const [libraryCount, setLibraryCount] = React.useState(0);
  const [noBooksOpen, setNoBooks] = React.useState(false);

  const [playSkip, setPlaySkip] = React.useState({
    isOpen: false,
    label: '',
    link: ''
  });

  const prepare = async () => {
    const bricks = await getAssignedBricks();
    if (bricks && bricks.length > 0) {
      setAssignedCount(bricks.length);
    }
    const lbricks = await getLibraryBricks();
    if (lbricks && lbricks.length > 0) {
      setLibraryCount(lbricks.length);
    }
  }

  useEffect(() => { prepare() }, []);

  const isStudent = isStudentPreference(props.user);

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
    // I think we should be able to see this from the main page
    if (page !== PageEnum.ManageClasses && user) {
      let canSee = checkTeacherOrAdmin(user);
      // There is no need to check for teacher, institution, admin twice it already does so in previous line
      // I added the manage classrooms just in the menu for the builder preference
      if (isBuilderPreference(user)) {
        canSee = true;
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
        <MenuItem className="menu-item" onClick={() => {
          if (assignedCount > 0) {
            move(map.AssignmentsPage, 'My Assignments')
          } else {
            setNoAssignments(true);
          }
        }}>
          <span className={`menu-text ${assignedCount === 0 ? 'text-theme-dark-blue' : ''}`}>My Assignments</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="student-back-to-work" className={`active ${assignedCount > 0 ? 'text-white' : 'text-theme-dark-blue'}`} />
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
    if (page !== PageEnum.MyLibrary) {
      return (
        <MenuItem className="view-profile menu-item" onClick={() => {
          if (libraryCount > 0) {
            move("/my-library", 'My Library')
          } else {
            setNoBooks(true);
          }
        }}>
          <span className={`menu-text ${libraryCount > 0 ? '' : 'text-theme-dark-blue'}`}>My Library</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="book-open" className={`active stroke-2 ${libraryCount > 0 ? 'text-white' : 'text-theme-dark-blue'}`} />
          </div>
        </MenuItem>
      );
    }
  }

  return (
    <Menu
      className={"menu-dropdown " + props.className}
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
      <LockedDialog
          label="To unlock this, a brick needs to have been assigned to you"
          isOpen={noAassignmentsOpen}
          close={() => setNoAssignments(false)} />
      <LockedDialog
          label="Play a brick to unlock this feature"
          isOpen={noBooksOpen}
          close={() => setNoBooks(false)} />
    </Menu>
  );
};

export default connector(MenuDropdown);
