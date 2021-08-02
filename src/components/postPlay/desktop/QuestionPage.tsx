import React from "react";
import { PlayAttempt } from "model/attempt";
import { Question } from "model/question";
import QuestionPlay from "components/play/questionPlay/QuestionPlay";
import { FormControlLabel, Radio } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface QuestionPageProps {
  i: number;
  question: Question;
  activeAttempt: PlayAttempt;
  mode?: boolean;
  setMode(v: boolean): void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  i,
  mode,
  activeAttempt,
  question,
  setMode,
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
  } catch {}

  let attempt = Object.assign({}, activeAttempt) as any;
  attempt.answer = parsedAnswers;
  if (answers && answers[i]) {
    attempt.correct = answers[i].correct;
  }

  console.log(attempt, answers);

  const getMarks = () => {
    let marks = 0;
    if (mode === true) {
      marks = attempt.answers[i].marks;
    } else {
      marks = attempt.liveAnswers[i].marks;
    }
    return marks;
  }

  const renderTitle = (attempt: any) => {
    let correct = false;

    const marks = getMarks();

    if (mode === true) {
      correct = attempt.answers[i].correct;
    } else {
      correct = attempt.liveAnswers[i].correct;
    }

    let text = "Incorrect - try again!";
    if (correct) {
      text = "Correct!";
    } else if (marks > 0) {
      text = "Not quite - try again!";
    }
    if (correct) {
      return (
        <div className="ge-phone-title">
          <div className="ge-phone-circle b-green">
            <SpriteIcon name="check-icon" />
          </div>
          <div>{text}</div>
        </div>
      );
    }
    return (
      <div className="ge-phone-title">
        <div
          className={`ge-phone-circle ${
            attempt.marks > 0 ? "b-yellow" : "b-red"
          }`}
        >
          <SpriteIcon name="cancel-custom" />
        </div>
        <div>{text}</div>
      </div>
    );
  };

  const renderMarks = () => {
    const marks = getMarks();
    const maxMarks = attempt.answers[i].maxMarks;

    return (
      <div className="marks-container">
        <div>Marks</div>
        <div>
          {marks}/{maxMarks}
        </div>
      </div>
    );
  };

  return (
    <div className="book-page">
      <div className="real-content question-content brief-page real-question-b-page">
        {mode === undefined ? (
          <div>
            <QuestionPlay
              question={question}
              isPhonePreview={true}
              isDefaultBook={true}
              answers={[]}
            />
          </div>
        ) : (
          <div>
            <div className="question-title">
              {renderTitle(attempt)}
              {renderMarks()}
            </div>
            <QuestionPlay
              question={question}
              attempt={attempt}
              isReview={mode}
              isBookPreview={true}
              answers={parsedAnswers}
            />
          </div>
        )}
      </div>
      <div className="bottom-navigator">
        <div>
          <div className="blue-circle">{i + 1}</div>
          <div className="my-answers-label">My Answers</div>
          <FormControlLabel
            checked={mode === false}
            control={<Radio onClick={() => setMode(false)} />}
            label="Investigation"
          />
          <FormControlLabel
            checked={mode === true}
            control={<Radio onClick={() => setMode(true)} />}
            label="Review"
          />
        </div>
      </div>
      <div className="right-part"></div>
    </div>
  );
};

export default QuestionPage;
