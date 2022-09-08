import React from "react";
import { History } from "history";
import { isMobile } from "react-device-detect";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { LibraryRegisterPageBack } from "../desktop/routes";
import { Brick } from "model/brick";
import { SetAuthBrickCash } from "localStorage/play";

interface Props {
  history?: History;
  label?: string;
  brick?: Brick;
  competitionId?: number;
  popupLabel?: string;
  hideHelp?: boolean;
  onClick?(): void;
}


const UKlibraryButton: React.FC<Props> = (props) => {
  const onClick = () => {
    if (props.onClick) {
      props.onClick();
    } else if (props.history) {
      if (props.brick) {
        SetAuthBrickCash(props.brick, props.competitionId ? props.competitionId : -1);
      }
      props.history.push(LibraryRegisterPageBack);
    }
  }

  const renderHelp = () => {
    if (props.hideHelp) {
      return "";
    }
    if (isMobile) {
      return <SpriteIcon name="library-help" className="help-library" />;
    }
    return (
      <div className="hover-area-content">
        <div className="hover-area flex-center">
          <SpriteIcon name="library-help" />
          <div className="hover-content bold">
            {props.popupLabel ? props.popupLabel : 'Available to members of participating UK libraries.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="google-button library-button" onClick={onClick}>
      <SpriteIcon name="library-user-icon" className="active library-user-icon" />
      <span>{props.label ? props.label : 'UK library user'}</span>
      {renderHelp()}
    </div>
  );
};

export default UKlibraryButton;
