import React from 'react';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import './StopTrackingButton.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { getCookies, clearCookiePolicy, acceptCookies } from 'localStorage/cookies';
import CookiePolicyDialog from 'components/baseComponents/policyDialog/CookiePolicyDialog';

interface StudentRouteProps {
  isOpen: boolean;
  closeDropdown(): void;
}

const UnauthorizedMenu: React.FC<StudentRouteProps> = (props) => {
  let isInitCookieOpen = false;

  if (!getCookies()) {
    isInitCookieOpen = true;
  }

  const [cookieOpen, setCookiePopup] = React.useState(isInitCookieOpen);
  const [cookieReOpen, setCookieReOpen] = React.useState(false);
  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    clearCookiePolicy();
    setCookiePopup(true);
  }

  return (
    <div>
      <Menu
        className="menu-dropdown"
        open={props.isOpen}
        onClose={props.closeDropdown}
      >
        <MenuItem className="menu-item" onClick={deleteAllCookies}>
          <span className="menu-text">Stop Tracking</span>
          <div className="btn btn-transparent flex flex-center">
            <SpriteIcon name="feather-x-octagon" />
          </div>
        </MenuItem>
      </Menu>
      <CookiePolicyDialog isOpen={cookieOpen} isReOpened={cookieReOpen} close={() => {
        acceptCookies();
        setCookiePopup(false);
      }}
      />
    </div>
  );
}


export default UnauthorizedMenu;
