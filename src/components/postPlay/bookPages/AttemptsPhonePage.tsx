import React from "react";
import { PlayAttempt } from "model/attempt";
import { getAttemptDateString, getTime } from "components/services/brickService";

interface AttemptsPageProps {
  index: number;
  attempts: PlayAttempt[];
  setActiveAttempt(attempt: PlayAttempt, index: number): void;
  onClick(): void;
}

const AttemptsPage: React.FC<AttemptsPageProps> = (props) => {
  return (
    <div className="attempts" onClick={props.onClick}>
      {props.attempts.map((a, i) =>
        {
          const middleScore = (a.score + a.oldScore) / 2;
          let percentages = Math.round(middleScore * 100 / a.maxScore) ;
          percentages = percentages ? percentages : 0;
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
                ? <span className="score-text">% Score on {getAttemptDateString(a.timestamp)}<span className="clock-time">{getTime(a.timestamp)}</span></span>
                : <span className="score-text">Attempt on {getAttemptDateString(a.timestamp)}<span className="clock-time">{getTime(a.timestamp)}</span></span>
              }
            </div>
          );
        }
      )}
    </div>
  );
}

export default AttemptsPage;
