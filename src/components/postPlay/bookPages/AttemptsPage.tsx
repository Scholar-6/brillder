import React from "react";
import { PlayAttempt } from "model/attempt";

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
              <div className="percentage">{percentages}</div> Attempt {i + 1}
            </div>
          );
        }
      )}
    </div>
  );
}

export default AttemptsPage;
