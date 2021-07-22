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

const PhoneQuestionHeader: React.FC<Props> = ({ mode, i, activeAttempt, title, setMode }) => {
  return (
    <div className="header">
      <div className="header-absolute">
        <div className="question-header">
          <div className="round-question-num">{i + 1}</div>
          <span className="title" dangerouslySetInnerHTML={{ __html: title }} />
        </div>
      </div>
    </div>
  );
}

export default PhoneQuestionHeader;
