import React from "react";
import './AcademyDifficulty.scss';
import { AcademicLevel, Brick } from "model/brick";
import brick from "services/axios/brick";

interface LibrarySubjectsProps {
  a: AcademicLevel;
  brick?: Brick;
  className?: string;
}

export const AcademyDifficulty: React.FC<LibrarySubjectsProps> = ({a, brick, className}) => {
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
        {brick && brick.author && <div className="lib-author">
          <div className="lib-circle">
            <span>{brick.author.firstName.slice(0, 1) + brick.author.lastName.slice(0, 1)}</span>
          </div>
        </div>}
        <div>
          {renderLines()}
        </div>
      </div>
    </div>
  );
}

export default AcademyDifficulty;
