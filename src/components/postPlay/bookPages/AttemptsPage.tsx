import React from "react";
import { PlayAttempt } from "model/attempt";
import { getDateString, getTime } from "components/services/brickService";

interface AttemptsPageProps {
  index: number;
  attempts: PlayAttempt[];
  setActiveAttempt(attempt: PlayAttempt, index: number): void;
  onClick(): void;
}

const AttemptsPage: React.FC<AttemptsPageProps> = (props) => {
  return (
    <div className="page4-attempts" onClick={props.onClick}>
      {props.attempts.map((a, i) =>
        {
          const percentages = Math.round(a.score * 100 / a.maxScore);
          return (
            <div
              key={i}
              className={`attempt-info ${i === props.index ? 'active' : ''}`}
              onClick={e => {
                e.stopPropagation();
                props.setActiveAttempt(a, i);
              }}
            >
              <div className="percentage">{percentages}</div>
              {i === 0
                ? <span>Your latest attempt on {getDateString(a.timestamp)} at {getTime(a.timestamp)}</span>
                : <span>Attempt on {getDateString(a.timestamp)} at {getTime(a.timestamp)}</span>
              }
            </div>
          );
        }
      )}
    </div>
  );
}

export default AttemptsPage;
