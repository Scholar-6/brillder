import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import SpriteIcon from "../../baseComponents/SpriteIcon";
import { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

interface MenuDropdownProps {
  dropdownShown: boolean;
  hideDropdown(): void;
  page: PageEnum;
  className?: string;
  moveToProfilePage(): void;
  onLogout(): void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = (props) => {
  const { page } = props;
  
  const renderProfileItem = () => {
    if (page !== PageEnum.Profile) {
      return (
        <MenuItem className="view-profile menu-item" onClick={props.moveToProfilePage}>
          <span className="menu-text">View Profile</span>
          <div className="btn btn-transparent svgOnHover">
            <SpriteIcon name="user" className="active text-white" />
          </div>
        </MenuItem>
      );
    }
  };

  return (
    <Menu
      className={"menu-dropdown " + props.className}
      open={props.dropdownShown}
      onClose={props.hideDropdown}
    >
      {renderProfileItem()}
      <MenuItem className="menu-item" onClick={props.onLogout}>
        <span className="menu-text">Logout</span>
        <div className="btn btn-transparent svgOnHover">
          <SpriteIcon name="logout" className="active logout-icon text-white" />
        </div>
      </MenuItem>
    </Menu>
  );
};

export default MenuDropdown;
