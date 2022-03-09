import React from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Brick } from "model/brick";
import { User } from "model/user";
import { stripHtml } from "components/build/questionService/ConvertService";

interface FrontPageProps {
  brick: Brick;
  color: string;
  student: User;
  onClick?(): void;
}

const FrontPage: React.FC<FrontPageProps> = ({brick, student, color, onClick}) => {
  const renderUserRow = () => {
    const { firstName, lastName } = student;
    return (
      <div className="names-row">
        {firstName ? firstName + " " : ""}
        {lastName ? lastName : ""}
      </div>
    );
  };

  return (
    <div className="front" onClick={() => onClick?.()}>
      <div className="page-stitch" style={{ background: color }}>
        <div className="vertical-line"></div>
        <div className="horizontal-line top-line-1"></div>
        <div className="horizontal-line top-line-2"></div>
        <div className="horizontal-line bottom-line-1"></div>
        <div className="horizontal-line bottom-line-2"></div>
      </div>
      <div className="page-cover">
        <div className="image-background-container" style={{ color: color }}>
          <SpriteIcon name="brick-icon" className={"active"} />
        </div>
        <div className="brick-title">{stripHtml(brick.title)}</div>
        {renderUserRow()}
      </div>
    </div>
  );
}

export default FrontPage;
