import React from "react";
import { History } from "history";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isMobile } from "react-device-detect";
import { LibraryRegisterPage } from "../desktop/routes";

interface Props {
  history?: History;
  onClick?(): void;
}


const UKlibraryButton: React.FC<Props> = (props) => {
  const onClick = () => {
    if (props.onClick) {
      props.onClick();
    } else if (props.history) {
      props.history.push(LibraryRegisterPage);
    }
  }

  return (
    <div className="google-button library-button" onClick={onClick}>
      <SpriteIcon name="library-user-icon" className="active library-user-icon" />
      <span>UK library user</span>
      {isMobile ? <SpriteIcon name="library-help" className="help-library" /> : <div className="hover-area-content">
        <div className="hover-area flex-center">
          <SpriteIcon name="library-help" />
          <div className="hover-content bold">
            Available to members of
            participating UK libraries.
          </div>
        </div>
      </div>}
    </div>
  );
};

export default UKlibraryButton;
