import React from "react";

import { getHours, getMinutes, getFormattedDate } from "components/services/brickService";
import { PlayAttempt } from "model/attempt";
import { BookState } from "../PostPlay";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface AnswersPageProps {
  i: number;
  mode: boolean;
  questionIndex: number;
  activeAttempt: PlayAttempt | null;
  bookHovered: boolean;
  bookState: BookState;
  setMode(mode: boolean): void;
  nextQuestion(): void;
}

const AnswersPage: React.FC<AnswersPageProps> = ({
  i, mode, activeAttempt, questionIndex, bookHovered, bookState, nextQuestion, setMode
}) => {
  const getResultStyle = (index: number) => {
    const scale = 1.15;
    if (bookHovered && bookState === BookState.QuestionPage) {
      if (index === questionIndex) {
        return { transform: `rotateY(-4deg) scale(${scale})` }
      } else if (index < questionIndex) {
        return { transform: `rotateY(-178.3deg) scale(${scale})` };
      } else if (index > questionIndex) {
        return { transform: `rotateY(-3deg) scale(${scale})` };
      }
    }
    return {};
  }

  const timestamp = activeAttempt ? activeAttempt.timestamp : '';

  return (
    <div
      className={`page4 result-page ${i === 0 ? 'first' : ''}`}
      style={getResultStyle(i)}
      onClick={nextQuestion}
    >
      <h2>My Answer(s)</h2>
      <div style={{ display: "flex" }}>
        <div className="col">
          <h3>Attempt1</h3>
          <div className="bold">{getFormattedDate(timestamp)}</div>
          <div>{getHours(timestamp)}:{getMinutes(timestamp)}</div>
        </div>
        <div className="col">
          <h3 className="centered">Investigation</h3>
          <div className="centered">
            {activeAttempt?.liveAnswers[i].correct
              ? <SpriteIcon name="ok" className="text-theme-green" />
              : <SpriteIcon name="cancel" className="text-theme-orange" />
            }
            {
              mode
                ? <SpriteIcon name="eye-off" className="text-tab-gray active" onClick={e => {
                    e.stopPropagation();
                    setMode(false);
                  }} />
                : <SpriteIcon name="eye-on" className="text-theme-dark-blue" />
            }
          </div>
        </div>
        <div className="col">
          <h3 className="centered">Review</h3>
          <div className="centered">
            {activeAttempt?.answers[i].correct
              ? <SpriteIcon name="ok" className="text-theme-green" />
              : <SpriteIcon name="cancel" className="text-theme-orange" />
            }
            {
              mode
                ? <SpriteIcon name="eye-on" className="text-theme-dark-blue" />
                : <SpriteIcon name="eye-off" className="text-tab-gray active" onClick={e => {
                    e.stopPropagation();
                    setMode(true);
                  }} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnswersPage;
