import React from "react";

import sprite from "assets/img/icons-sprite.svg";

interface SpriteIconProps {
  name: string;
  className?: string;
  onClick?(e: React.MouseEvent<SVGSVGElement, MouseEvent>): void;
}

const SpriteIcon:React.FC<SpriteIconProps> = ({name, className, onClick}) => {
  const onSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    }
  }
  return (
    <svg className={`svg ${className ? className : ''}`} onClick={onSvgClick}>
      {/*eslint-disable-next-line*/}
      <use href={sprite + "#" + name} />
    </svg>
  );
};

export default SpriteIcon;
