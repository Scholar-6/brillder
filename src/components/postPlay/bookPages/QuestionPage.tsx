import React from "react";

import { AttemptAnswer, PlayAttempt } from "model/attempt";
import { Question } from "model/question";
import { BookState } from "../PostPlay";

import QuestionPlay from "components/play/questionPlay/QuestionPlay";

interface QuestionPageProps {
  i: number;
  questionIndex: number;
  question: Question;
  activeAttempt: PlayAttempt | null;
  answers: AttemptAnswer[];
  bookHovered: boolean;
  bookState: BookState;
  prevQuestion(): void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  i, answers, activeAttempt, questionIndex, question, bookHovered, bookState, prevQuestion
}) => {
  let parsedAnswers = null;
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
          <div>
            <h2>Investigation</h2>
            <QuestionPlay
              question={question}
              attempt={attempt}
              isBookPreview={true}
              answers={parsedAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionPage;
