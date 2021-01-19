import React from "react";

import './SubjectsColumn.scss';
import { SubjectItem } from "model/brick";

interface Props {
  subjects: SubjectItem[];
  onClick(subjectId: number): void;
}

const SubjectsColumn: React.FC<Props> = ({subjects, onClick}) => {
  let list = [];
  let isOdd = false;
  let row = [];

  for (let subject of subjects) {
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

  return (
    <div className="subjects-column">
      {list.map((row, i) =>
        <div key={i} className="subject-row">
          {row.map((s, j) =>
            <div key={j} className="subject-item" onClick={() => onClick(s.id)}>
              <div className="round-circle-container"> 
                <div className="round-circle" style={{ ["background" as any]: s.color }} />
              </div>
              <div className="subject-name">{s.name}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectsColumn;
