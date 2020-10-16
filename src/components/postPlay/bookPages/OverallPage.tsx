import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface OverallPageProps {
  onClick(): void;
}

const OverallPage: React.FC<OverallPageProps> = (props) => {
  return (
    <div className="page2" onClick={props.onClick}>
      <div className="normal-page">
        <div className="normal-page-container">
          <h2>OVERALL</h2>
          <h2>STATS, AVGs</h2>
          <h2>etc.</h2>
          <div className="bottom-button">
            View Questions
            <SpriteIcon name="arrow-right" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverallPage;
