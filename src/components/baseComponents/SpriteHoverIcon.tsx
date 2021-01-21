import React from "react";

import sprite from "assets/img/icons-sprite.svg";

interface SpriteIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?(e: React.MouseEvent<SVGSVGElement, MouseEvent>): void;
  onHover(): void;
  onBlur(): void;
}

const SpriteHoverIcon: React.FC<SpriteIconProps> = ({ name, className, style, onClick, ...props }) => {
  const onSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    }
  }
  return (
    <svg
      className={`svg ${className ? className : ''}`} style={style}
      onClick={onSvgClick} onMouseEnter={props.onHover} onMouseLeave={props.onBlur}
    >
      {/*eslint-disable-next-line*/}
      <use href={sprite + "#" + name} />
    </svg>
  );
};

export default SpriteHoverIcon;
