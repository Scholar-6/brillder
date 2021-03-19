import React from "react";

import { Subject } from "model/brick";
import { GENERAL_SUBJECT, CURRENT_AFFAIRS_SUBJECT } from "components/services/subject";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isIPad13, isMobile, isTablet } from "react-device-detect";

interface Props {
  subjects: Subject[];
  viewAll(): void;
  onClick(subjectId: number): void;
}

const SubjectsColumn: React.FC<Props> = ({ subjects, viewAll, onClick }) => {
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

  const renderViewAllButton = () => {
    return (
      <div className="subject-item" onClick={viewAll}>
        <div className="round-circle-container icon">
          <SpriteIcon name="glasses-home" />
        </div>
        <div className="subject-name">View All</div>
      </div>
    )
  }

  const renderDesktop = () => {
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

    return (
      <div className="subjects-column">
        {list.map((row, i) =>
          <div key={i} className="subject-row">
            {row.map((s, j) => renderSubject(s, j))}
          </div>
        )}
      </div>
    );
  }

  // render tablet and desktop verion
  if (!isMobile || (isIPad13 || isTablet)) {
    return renderDesktop();
  }

  // render phone version
  return (
    <div className="subjects-column">
      {renderViewAllButton()}
      {subjects.map((s, i) => renderSubject(s, i))}
    </div>
  );
};

export default SubjectsColumn;
