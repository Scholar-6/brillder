import React from "react";
import './BrickCircle.scss';
import SpriteIcon from "./SpriteIcon";
import { ReactComponent as CircleCheck } from 'assets/img/circle-check.svg';

interface BrickCircleProps {
  color: string;
  label: string;
  isAssignment?: boolean;
  circleIcon?: string;
  circleClass?: string;
  iconColor?: string;
  canHover?: boolean;

  onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

const BrickCircle: React.FC<BrickCircleProps> = (props) => {
  const { color, circleIcon, iconColor } = props;

  const [hovered, setHovered] = React.useState(false);

  const renderIcon = () => {
    let svgClass = 'svg active ';
    if (iconColor) {
      svgClass += iconColor;
    } else {
      svgClass += 'text-white';
    }
    if (hovered) {
      return <div className="label-circle-text">{props.label}</div>;
    }
    if (props.isAssignment) {
      return (
        <div className="round-button-icon">
          <CircleCheck />
        </div>
      );
    }
    if (circleIcon) {
      return (
        <div className="round-button-icon">
          {circleIcon
            ? <SpriteIcon name={circleIcon} className={svgClass} />
            : <div className="label-circle-text show-on-hover">{props.label}</div>}
        </div>
      );
    }
    return <div className="label-circle-text">{props.label}</div>;
  }

  let className = "left-brick-circle brick-status-circle";

  if (props.circleClass) {
    className += ' ' + props.circleClass;
  }

  if (color === "color2") {
    className += ' skip-top-right-border';
  }

  return (
    <div className={className} onClick={props.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="round-button" style={{ background: `${color}` }}>
        {renderIcon()}
      </div>
    </div>
  );
}

export default BrickCircle;
