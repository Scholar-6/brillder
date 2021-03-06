import React, { Component } from "react";
import './BrickCircle.scss';
import SpriteIcon from "./SpriteIcon";

interface BrickCircleProps {
  color: string;
  label: string;
  circleIcon?: string;
  circleClass?: string;
  iconColor?: string;
  canHover?: boolean;

  onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

class BrickCircle extends Component<BrickCircleProps> {
  renderIcon() {
    const { circleIcon, iconColor } = this.props;
    let svgClass = 'svg active ';
    if (iconColor) {
      svgClass += iconColor;
    } else {
      svgClass += 'text-white';
    }
    if (circleIcon) {
      return (
        <div className="round-button-icon">
          {circleIcon
            ? <SpriteIcon name={circleIcon} className={svgClass} />
            : <div className="label-circle-text show-on-hover">{this.props.label}</div>}
        </div>
      );
    }
    return <div className="label-circle-text">{this.props.label}</div>;
  }

  render() {
    const {color} = this.props;
    let className = "left-brick-circle brick-status-circle";

    if (this.props.circleClass) {
      className += ' ' + this.props.circleClass;
    }

    if (color === "color2") {
      className += ' skip-top-right-border';
    }

    return (
      <div className={className} onClick={this.props.onClick?.bind(this)}>
        <div className="round-button" style={{ background: `${color}` }}>
          {this.renderIcon()}
        </div>
      </div>
    );
  }
}

export default BrickCircle;
