import React from "react";

import "./PlanPreview.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import KeyWordsPlay from "components/build/proposal/questionnaire/brickTitle/components/KeywordsPlay";
import { User } from "model/user";
import BrickCircle from "components/baseComponents/BrickCircle";
import { AcademicLevelLabels, Brick } from "model/brick";
import YoutubeAndMathQuote from "components/play/baseComponents/YoutubeAndMathQuote";

interface PlanPreviewProps {
  data: {
    currentBrick: Brick;
    user: User;
  }
}

const PlanPreviewComponent: React.FC<PlanPreviewProps> = ({ data }) => {
  const { currentBrick } = data;

  return (
    <div className="phone-preview-component plan-preview">
      <BrickCircle color={currentBrick.subject ? currentBrick.subject.color : ''} label={AcademicLevelLabels[currentBrick.academicLevel]} onClick={() => {}} />
      <div className="title" style={{ textAlign: "center" }}>
        <div className='q-brick-title'>
          <YoutubeAndMathQuote value={currentBrick.title} />
        </div>
      </div>
      <KeyWordsPlay keywords={currentBrick.keywords} />
      <div className="pl-open-question">
        <YoutubeAndMathQuote value={currentBrick.openQuestion} />
      </div>
      <div className="expand-title brief-title" style={{ marginTop: '4vh' }}>
        <span>Brief</span>
        <div className="centered text-white">
          <div className="round-icon b-green">
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
      </div>
      <div className="base-font">
        <YoutubeAndMathQuote value={currentBrick.brief} />
      </div>
      <div className="expand-title prep-title" style={{ marginTop: '4vh' }}>
        <span>Prep</span>
        <div className="centered text-white">
          <div className="round-icon b-green">
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
      </div>
      <div className="base-font">
        <YoutubeAndMathQuote value={currentBrick.prep} />
      </div>
    </div>
  );
};

export default PlanPreviewComponent;
