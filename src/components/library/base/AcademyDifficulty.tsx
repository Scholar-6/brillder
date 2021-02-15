import React from "react";
import { AcademicLevel } from "model/brick";

interface LibrarySubjectsProps {
  a: AcademicLevel;
  className?: string;
}

export const AcademyDifficulty: React.FC<LibrarySubjectsProps> = ({a, className}) => {
  let resClassName = "academic-lines ";
  if (className) {
    resClassName += className;
  }
  const renderLines = () => {
    const levels = [];
    for (let i = AcademicLevel.First; i <= a; i++) {
      levels.push(<div key={i} className="level"></div>)
    }
    return levels;
  }

  return (
    <div className={resClassName}>
      <div className="start-lines">
        <div>
          {renderLines()}
        </div>
      </div>
      <div className="end-lines">
        <div>
          {renderLines()}
        </div>
      </div>
    </div>
  );
}

export default AcademyDifficulty;
