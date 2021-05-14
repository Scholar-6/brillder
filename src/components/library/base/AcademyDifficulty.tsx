import React from "react";
import './AcademyDifficulty.scss';
import { AcademicLevel, Brick } from "model/brick";
import { User } from "model/user";

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

  const getInitials = (user: User) => user.firstName.slice(0, 1) + user.lastName.slice(0, 1);

  const renderAuthor = () => {
    if (brick) {
      return getInitials(brick.author as any);
      //if (brick.adaptedFrom) {
        //return getInitials(brick.adaptedFrom.author);
      //}
    }
    return '';
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
            {renderAuthor()}
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
