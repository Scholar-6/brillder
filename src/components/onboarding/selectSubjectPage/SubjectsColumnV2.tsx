import React from "react";

import { Subject } from "model/brick";
import { GENERAL_SUBJECT, CURRENT_AFFAIRS_SUBJECT } from "components/services/subject";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isIPad13, isMobile, isTablet } from "react-device-detect";

interface Props {
  subjects: Subject[];
  next(): void;
  onClick(subjectId: number): void;
}

const SubjectsColumn: React.FC<Props> = ({ subjects, next, onClick }) => {
  let list = [];
  let isOdd = false;
  let row = [];

  let max1 = 3;
  let max2 = 4;

  if (!(isIPad13 || isTablet) && isMobile) {
    max1 = 2;
    max2 = 3;
  }
  for (let subject of subjects) {
    if (subject.name === GENERAL_SUBJECT || subject.name === CURRENT_AFFAIRS_SUBJECT) {
      continue;
    }
    row.push(subject);
    if (isOdd && row.length >= max1) {
      isOdd = false;
      list.push(row);
      row = [];
    } else if (!isOdd && row.length >= max2) {
      isOdd = true;
      list.push(row);
      row = [];
    }
  }

  if (row.length > 0) {
    list.push(row);
  }

  const renderSubject = (s: Subject, key: number) => {
    return (
      <div key={key} className={s.checked ? "subject-item checked" : "subject-item"} onClick={() => onClick(s.id)}>
        <div className="round-circle-container">
          <div className="round-circle" style={{ ["background" as any]: s.color }} />
        </div>
        <div className="subject-name">{s.name}</div>
      </div>
    )
  }

  const renderNextButton = () => {
    return (
      <div className="subject-item next-button" onClick={next}>
        <div className="subject-name">Next</div>
        <div className="icon right">
          <SpriteIcon name="arrow-right" />
        </div>
      </div>
    )
  }

  return (
    <div className="subjects-column-v2">
      <div style={{ width: '100%' }}>
        {list.map((row, i) =>
          <div key={i} className="subject-row">
            {row.map((s, j) => renderSubject(s, j))}
          </div>
        )}
        <div className="subject-row">
          {renderNextButton()}
        </div>
      </div>
    </div>
  );
};

export default SubjectsColumn;
