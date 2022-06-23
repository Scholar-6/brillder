import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface Props {
  onClick(): void;
}

const UKlibraryButton: React.FC<Props> = (props) => {
  return (
    <a className="google-button library-button" onClick={props.onClick}>
      <SpriteIcon name="library-icon" className="active" />
      <span>UK library user</span>
      <SpriteIcon name="help-library" className="help-library" />
    </a>
  );
};

export default UKlibraryButton;
