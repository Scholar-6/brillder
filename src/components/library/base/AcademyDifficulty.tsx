import React from "react";
import "./AcademyDifficulty.scss";
import { AcademicLevel, Brick } from "model/brick";
import { User } from "model/user";

interface Props {
  a: AcademicLevel;
  brick?: Brick;
  noTopLines?: boolean;
  className?: string;
}

export const AcademyDifficulty: React.FC<Props> = ({ a, brick, className, noTopLines }) => {
  let resClassName = "academic-lines ";
  if (className) {
    resClassName += className;
  }

  const getInitials = (user: User) =>
    user.firstName.slice(0, 1) + user.lastName.slice(0, 1);

  const renderLines = () => {
    const levels = [];
    for (let i = AcademicLevel.First; i <= a; i++) {
      levels.push(<div key={i} className="level"></div>);
    }
    return levels;
  };

  return (
    <div className={resClassName}>
      {!noTopLines &&
      <div className="start-lines">
        <div>{renderLines()}</div>
      </div>}
      <div className="end-lines">
        {brick && brick.author && (
          <div className="lib-author">
            {brick.adaptedFrom && (
              <div className="lib-circle">
                {getInitials(brick.author as any)}
              </div>
            )}
          </div>
        )}
        <div>{renderLines()}</div>
      </div>
    </div>
  );
};

export default AcademyDifficulty;
