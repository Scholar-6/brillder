import React from "react";

interface Props {
  i: number;
  title: string;
}

const PhoneQuestionHeader: React.FC<Props> = ({ i, title }) => {
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
