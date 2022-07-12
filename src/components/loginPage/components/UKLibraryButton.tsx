import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface Props {
  onClick(): void;
}

const UKlibraryButton: React.FC<Props> = (props) => {
  return (
    <div className="google-button library-button" onClick={props.onClick}>
      <SpriteIcon name="library-user-icon" className="active library-user-icon" />
      <span>UK library user</span>
      <SpriteIcon name="library-help" className="help-library" />
    </div>
  );
};

export default UKlibraryButton;
