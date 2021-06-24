import React from "react";

import { PlayAttempt } from "model/attempt";
import { Question } from "model/question";

import QuestionPlay from "components/play/questionPlay/QuestionPlay";

interface QuestionPageProps {
  i: number;
  mode?: boolean;
  question: Question;
  activeAttempt: PlayAttempt;
  prevQuestion(): void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  i, mode, activeAttempt, question, prevQuestion
}) => {
  let parsedAnswers = null;

  let answers:any[] = [];
  if (mode) {
    answers = activeAttempt.answers;
  } else if (mode === false) {
    answers = activeAttempt.liveAnswers;
  }

  try {
    parsedAnswers = JSON.parse(JSON.parse(answers[i].answer));
  } catch {}

  let attempt = Object.assign({}, activeAttempt) as any;
  attempt.answer = parsedAnswers;

  return (
    <div className="page3" onClick={prevQuestion}>
      <div className="flipped-page question-page">
        <div style={{ display: "flex" }}>
          <div className="question-number desktop">
            <div>{i + 1}</div>
          </div>
          <div className="question-scrollable">
            {mode === undefined
              ? <QuestionPlay question={question} isPhonePreview={true} isDefaultBook={true} answers={[]} />
              : 
              <QuestionPlay
                question={question}
                attempt={attempt}
                isReview={mode}
                isBookPreview={true}
                answers={parsedAnswers}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionPage;
