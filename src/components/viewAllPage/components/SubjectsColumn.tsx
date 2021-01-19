import React from "react";

import './SubjectsColumn.scss';
import { Subject } from "model/brick";
import { GENERAL_SUBJECT } from "components/services/subject";

interface Props {
  subjects: Subject[];
  onClick(subjectId: number): void;
}

const SubjectsColumn: React.FC<Props> = ({ subjects, onClick }) => {
  let list = [];
  let isOdd = false;
  let row = [];

  for (let subject of subjects) {
    if (subject.name === GENERAL_SUBJECT) {
      continue;
    }
    row.push(subject);
    if (isOdd && row.length >= 3) {
      isOdd = false;
      list.push(row);
      row = [];
    } else if (!isOdd && row.length >= 4) {
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
      <div key={key} className="subject-item" onClick={() => onClick(s.id)}>
        <div className="round-circle-container">
          <div className="round-circle" style={{ ["background" as any]: s.color }} />
        </div>
        <div className="subject-name">{s.name}</div>
      </div>
    )
  }

  return (
    <div className="subjects-column">
      <div style={{width: '100%'}}>
        {list.map((row, i) =>
          <div key={i} className="subject-row">
            {row.map((s, j) => renderSubject(s, j))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsColumn;
