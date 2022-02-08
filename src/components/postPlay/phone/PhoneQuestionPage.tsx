import React from "react";

import { PlayAttempt } from "model/attempt";
import { Question } from "model/question";

import QuestionPlay from "components/play/questionPlay/QuestionPlay";

interface QuestionPageProps {
  i: number;
  mode?: boolean;
  question: Question;
  activeAttempt: PlayAttempt;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  i, mode, activeAttempt, question
}) => {
  let parsedAnswers = null;

  let answers: any[] = [];
  if (mode) {
    answers = activeAttempt.answers;
  } else if (mode === false) {
    answers = activeAttempt.liveAnswers;
  }

  try {
    parsedAnswers = JSON.parse(JSON.parse(answers[i].answer));
  } catch { }

  let attempt = Object.assign({}, activeAttempt) as any;
  attempt.answer = parsedAnswers;

  const renderTitle = () => {
    if (mode === undefined) {
      return "Investigation";
    } else if (mode === true) {
      if (activeAttempt.answers[i].correct) {
        return "Correct!"
      }
      return "Not quite - try again!";
    } else if (mode === false) {
      if (activeAttempt.liveAnswers[i].correct) {
        return "Correct!"
      }
      return "Not quite - try again!";
    }
  }

  const renderMarks = () => {
    if (answers && answers[i]) {
      return (
        <div className="marks-container">
          <div>Marks</div>
          <div>{answers[i].marks}/{answers[i].maxMarks}</div>
        </div>
      )
    }
  }

  return (
    <div className="page3">
      <div className="flipped-page question-page">
        <div style={{ display: "flex" }}>
          <div className="question-scrollable">
            <div className="question-title">
              {renderTitle()}
              {renderMarks()}
            </div>
            {mode === undefined
              ? <QuestionPlay question={question} isPhonePreview={true} isDefaultBook={true} isBookPreview={true} answers={[]} />
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
