import SpriteIcon from "components/baseComponents/SpriteIcon";
import React from "react";

import './StartBuilding.scss';

interface Props {
}

const StartBuildingPage: React.FC<Props> = ({
}) => {
  return (
    <div className="start-building">
      <div>
        <h1>Always keep the learner in mind.</h1>
        <div className="icon-container">
          <SpriteIcon name="feather-map-custom" />
        </div>
        <p>Before starting the Investigation (questions), some framework helps learners get in the right headplace.</p>
        <div className="button-container">
          <button className="btn btn-gray">
            See an example
          </button>
          <button className="btn blue">
            Start Building
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartBuildingPage;
