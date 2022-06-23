import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface Props {
  onClick(): void;
}

const MicrosoftButton: React.FC<Props> = (props) => {
  return (
    <a className="google-button library-button svgOnHover" onClick={props.onClick}>
      <SpriteIcon name="library-icon" className="active" />
      <span>UK library user</span>
    </a>
  );
};

export default MicrosoftButton;
