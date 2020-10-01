import React from "react";

import sprite from "assets/img/icons-sprite.svg";

interface SpriteIconProps {
  name: string;
  className?: string;
  onClick?(): void;
}

const SpriteIcon:React.FC<SpriteIconProps> = ({name, className, onClick}) => {
  const onSvgClick = () => {
    if (onClick) {
      onClick();
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
