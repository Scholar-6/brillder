import React from "react";
import { useHistory } from 'react-router-dom';

import './previousButton.scss';
import sprite from "assets/img/icons-sprite.svg";
interface PrevButtonProps {
  to: string
  isActive: boolean
  onHover(): void
  onOut(): void
}

const PreviousButton:React.FC<PrevButtonProps> = ({
  to, isActive, onHover, onOut
}) => {
  const history = useHistory()

  const prev = () => history.push(to);

  return (
    <button className="btn btn-transparent tut-prev svgOnHover"
      onMouseEnter={onHover}
      onMouseLeave={onOut}
      onClick={prev}>
      <svg className="svg active h100 w100">
        <use href={ sprite + "#arrow-up"} className={isActive ? "text-theme-orange":"text-gray" } />
      </svg>
    </button>
  );
}

export default PreviousButton
