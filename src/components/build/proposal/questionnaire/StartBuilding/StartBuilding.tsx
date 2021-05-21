import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import React from "react";
import PlayDialog from "./PlayDialog";

import './StartBuilding.scss';

interface Props {
  history: any;
}

const StartBuildingPage: React.FC<Props> = ({
  history
}) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div className="start-building">
      <div>
        <h1>Always keep the learner in mind.</h1>
        <div className="icon-container">
          <SpriteIcon name="feather-map-custom" />
        </div>
        <p>Before starting the Investigation (questions), some framework helps learners get in the right headplace.</p>
        <div className="button-container">
          <button className="btn btn-gray" onClick={() => setOpen(true)}>
            See an example
          </button>
          <button className="btn blue" onClick={() => history.push(map.ProposalSubjectLink)}>
            Start Building
          </button>
        </div>
      </div>
      <PlayDialog isOpen={isOpen} close={() => setOpen(false)} />
    </div>
  );
}

export default StartBuildingPage;
