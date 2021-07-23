import React from "react";
import './QuestionPage.scss';
import { PlayAttempt } from "model/attempt";
import { Question } from "model/question";
import QuestionPlay from "components/play/questionPlay/QuestionPlay";
import { FormControlLabel, Radio } from "@material-ui/core";

interface QuestionPageProps {
  i: number;
  question: Question;
  activeAttempt: PlayAttempt;
  mode?: boolean;
  setMode(v: boolean): void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  i, mode, activeAttempt, question, setMode
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

  return (
    <div className="question-page">
      <div className="real-content question-content">
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
      <div className="bottom-navigator">
        <div>
          <div className="blue-circle">{i + 1}</div>
          <div className="my-answers-label">My Answers</div>
          <FormControlLabel
            checked={mode === false}
            control={<Radio onClick={() => setMode(false)} />}
            label="Investigation" />
          <FormControlLabel
            checked={mode === true}
            control={<Radio onClick={() => setMode(true)} />}
            label="Review" />
        </div>
      </div>
      <div className="right-part"></div>
    </div>
  );
}

export default QuestionPage;
