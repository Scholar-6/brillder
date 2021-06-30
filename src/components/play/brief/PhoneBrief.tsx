import React from "react";

import { Brick } from "model/brick";
import { PlayMode } from "../model";

import HighlightHtml from '../baseComponents/HighlightHtml';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BrickTitle from "components/baseComponents/BrickTitle";

interface Props {
  brick: Brick;

  moveNext(): void;

  // only real play
  mode?: PlayMode;
}

export interface State {
  briefExpanded: boolean;
}

const PhoneBriefPage: React.FC<Props> = ({ brick, ...props }) => {
  const [state, setState] = React.useState({
    briefExpanded: true,
  } as State);

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const renderMobileBriefTitle = () => {
    return (
      <div className="brief-title" style={{ marginTop: '4vh' }}>
        <span className="bold">Brief</span>
        <div className={state.briefExpanded ? "round-icon fill-green" : "round-icon fill-yellow"} onClick={toggleBrief}>
          <SpriteIcon name="circle-filled" className="circle" />
          <SpriteIcon name="arrow-down" className="arrow" />
        </div>
        {!state.briefExpanded && <span className="italic" onClick={toggleBrief}>Click to expand</span>}
      </div>
    );
  }

  const renderBriefExpandText = () => {
    return (
      <div className="expanded-text">
        <HighlightHtml
          value={brick.brief}
          mode={props.mode}
          onHighlight={() => {}}
        />
      </div>
    );
  };

  return (
    <div className="brick-row-container play-brief-page">
      <div className="brick-container">
        <div className="introduction-page">
          <div className="fixed-upper-b-title">
            <BrickTitle title={brick.title} />
          </div>
          <div className="introduction-content">
            <div className="fe-open-question" dangerouslySetInnerHTML={{__html: brick.openQuestion}} />
            {renderMobileBriefTitle()}
            {state.briefExpanded && renderBriefExpandText()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneBriefPage;
