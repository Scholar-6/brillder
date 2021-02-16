import React from "react";

interface DescriptionProps {
  label: string;
  color: string;
  isGreen?: boolean;
  number: number;
}

const BrickColDescription: React.FC<DescriptionProps> = (props) => {
  return (
    <div className="main-brick-container description">
      <div className={"brick-container " + props.color}>
        <div className="absolute-container">
          <div className="short-description">
            <div className="brick-circle-container">
              <div className={`left-brick-circle ${props.isGreen ? 'skip-top-right-border' : ''}`}>
                <div className={`round-button ${props.isGreen ? 'text-theme-green' : ''}`}>{props.number}</div>
              </div>
            </div>
            <div className="short-brick-info centered-y-start-x" style={{ height: '3vw', width: '75%' }}>
              {props.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrickColDescription;
