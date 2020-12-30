import React from "react";
import { useHistory } from "react-router-dom";

import "./previousButton.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface PrevButtonProps {
  to: string;
  isActive: boolean;
  onHover(): void;
  onOut(): void;
}

const PreviousButton: React.FC<PrevButtonProps> = ({
  to,
  isActive,
  onHover,
  onOut,
}) => {
  const history = useHistory();

  const prev = () => history.push(to);

  return (
    <button
      className="btn btn-transparent tut-prev svgOnHover"
      onMouseEnter={onHover}
      onMouseLeave={onOut}
      onClick={prev}
    >
      <SpriteIcon
        name="arrow-left"
        className={`active h100 w100 ${
          isActive ? "text-theme-orange" : "text-gray"
        }`}
      />
    </button>
  );
};

export default PreviousButton;
