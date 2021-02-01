import React from "react";

import { PlayAttempt } from "model/attempt";
import { Question } from "model/question";
import { BookState } from "../PostPlay";

import './QuestionPage.scss';
import QuestionPlay from "components/play/questionPlay/QuestionPlay";

interface QuestionPageProps {
  i: number;
  mode?: boolean;
  questionIndex: number;
  question: Question;
  activeAttempt: PlayAttempt;
  bookHovered: boolean;
  bookState: BookState;
  prevQuestion(): void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  i, mode, activeAttempt, questionIndex, question, bookHovered, bookState, prevQuestion
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

  const getQuestionStyle = (index: number) => {
    const scale = 1.15;
    if (bookHovered && bookState === BookState.QuestionPage) {
      if (index === questionIndex) {
        return { transform: `rotateY(-178deg) scale(${scale})` }
      } else if (index < questionIndex) {
        return { transform: `rotateY(-178.2deg) scale(${scale})` };
      } else if (index > questionIndex) {
        return { transform: `rotateY(-3deg) scale(${scale})` };
      }
    }
    return {};
  }

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

  return (
    <div
      className={`page3 ${i === 0 ? 'first' : ''}`}
      style={getQuestionStyle(i)}
      onClick={prevQuestion}
    >
      <div className="flipped-page question-page">
        <div style={{ display: "flex" }}>
          <div className="question-number">
            <div>{i + 1}</div>
          </div>
          <div className="question-scrollable">
            <h2>{renderTitle()}</h2>
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
