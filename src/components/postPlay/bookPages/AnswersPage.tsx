import React from "react";

import { getFormattedDate, getTime } from "components/services/brickService";
import { PlayAttempt } from "model/attempt";
import { BookState } from "../PostPlay";

import './AnswersPage.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface AnswersPageProps {
  i: number;
  isLast: boolean;
  mode?: boolean;
  questionIndex: number;
  activeAttempt: PlayAttempt | null;
  bookHovered: boolean;
  bookState: BookState;
  setMode(mode: boolean | undefined): void;
  nextQuestion(): void;
}

const AnswersPage: React.FC<AnswersPageProps> = ({
  i, isLast, mode, activeAttempt, questionIndex, bookHovered, bookState, nextQuestion, setMode
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

  let className = 'page4 result-page';
  if (i === 0) {
    className += ' first';
  }
  if (isLast) {
    className += ' last-question-result';
  }

  return (
    <div className={className} style={getResultStyle(i)} onClick={nextQuestion}>
      <h2>My Answer(s)</h2>
      <div className="eye-text">
        Click the eye icons to see your answers in the Review or Investigation
      </div>
      <div style={{ display: "flex" }}>
        <div className="col">
          <h3>Attempt</h3>
          <div className="bold">{getFormattedDate(timestamp)}</div>
          <div>{getTime(timestamp)}</div>
        </div>
        <div className="col">
          <h3 className="centered">Investigation</h3>
          <div className="centered">
            {activeAttempt?.liveAnswers[i].correct
              ? <SpriteIcon name="ok" className="text-theme-green" />
              : <SpriteIcon name="cancel" className="text-theme-orange" />
            }
            {
              mode === true || mode === undefined
                ? <SpriteIcon name="eye-off" className="text-dark-gray eye active" onClick={e => {
                    e.stopPropagation();
                    setMode(false);
                  }} />
                : <SpriteIcon name="eye-on" className="text-theme-dark-blue eye active" onClick={e => {
                  e.stopPropagation();
                  setMode(undefined);
                }} />
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
              mode === true
                ? <SpriteIcon name="eye-on" className="text-theme-dark-blue eye active" onClick={e => {
                  e.stopPropagation();
                  setMode(undefined);
                }} />
                : <SpriteIcon name="eye-off" className="text-dark-gray eye active" onClick={e => {
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
