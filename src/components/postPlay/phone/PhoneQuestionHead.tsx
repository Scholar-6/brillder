import React from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import ReviewEye from "../components/ReviewEye";
import LiveEye from "../components/LiveEye";

interface Props {
  i: number;
  title: string;
  activeAttempt: any;
  mode: boolean | undefined;
  setMode(value: boolean | undefined): void;
}

const PhoneQuestionHeader: React.FC<Props> = ({mode, i, activeAttempt, title, setMode}) => {
  return (
    <div className="header">
      <div className="question-header">
        <div className="round-question-num">{i + 1}</div>
        <span className="title" dangerouslySetInnerHTML={{__html: title}} />
      </div>
      <div className="switch-container">
        <div className="col">
          Investigation
          <div>
            <LiveEye mode={mode} setMode={setMode} />
            {activeAttempt?.liveAnswers[i].correct
              ? <SpriteIcon name="ok" className="text-theme-green" />
              : <SpriteIcon name="cancel" className="text-theme-orange" />
            }
          </div>
        </div>
        <div className="col">
          Review Answer
          <div>
            <ReviewEye mode={mode} setMode={setMode} />
            {activeAttempt?.answers[i].correct
              ? <SpriteIcon name="ok" className="text-theme-green" />
              : <SpriteIcon name="cancel" className="text-theme-orange" />
            }
          </div>
        </div>
      </div>
      <div className="text">
        Click the eye icons to see your answer
      </div>
    </div>
  );
}

export default PhoneQuestionHeader;
