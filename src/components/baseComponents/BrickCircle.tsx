import React, { Component } from "react";
import './BrickCircle.scss';
import SpriteIcon from "./SpriteIcon";

interface BrickCircleProps {
  color: string;
  circleIcon?: string;
  circleClass?: string;
  iconColor?: string;
  canHover?: boolean;

  onClick(): void;
}

interface State {
  circleHovered: boolean;
}

class BrickCircle extends Component<BrickCircleProps, State> {
  constructor(props: BrickCircleProps) {
    super(props);
    this.state = {
      circleHovered: false
    };
  }

  showCircle() {
    if (this.props.canHover) {
      this.setState({circleHovered: true});
    }
  }

  hideCircle() {
    if (this.props.canHover) {
      this.setState({circleHovered: false});
    } 
  }

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
          <SpriteIcon name={circleIcon} className={svgClass} />
        </div>
      );
    }
    return "";
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

    if (this.state.circleHovered) {
        className += ' circle-hovered';
    }

    function lightenDarkenColor(colstr: string, amt: number) {
      let col = parseInt(colstr, 16);
      console.log(colstr, col);
      return (((col & 0x0000FF) + amt) | ((((col >> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16);
    }

    let realColor = '';
    if (this.state.circleHovered) {
      realColor = color;
      if (color === 'color1') {
        realColor = "#C43C30";
      } else if (color === 'color3') {
        realColor = "#ff9d00";
      } else if (color === 'color4') {
        realColor = '#30c474';
      }
      //realColor = '#' + lightenDarkenColor(realColor.substring(1), 50);
      //console.log(realColor)
    }

    return (
      <div className={className}>
        {this.state.circleHovered && <div className="hover-brick-circle" style={{ background: realColor }} />}
        <div className="round-button" style={{ background: `${color}` }}>
          {this.renderIcon()}
        </div>
        {this.props.canHover &&
          <div className="play-button" onMouseEnter={() => this.showCircle()} onMouseLeave={() => this.hideCircle()}>
            <SpriteIcon name="play-thick" onClick={() => this.props.onClick ? this.props.onClick() : {}} />
          </div>
        }
      </div>
    );
  }
}

export default BrickCircle;
