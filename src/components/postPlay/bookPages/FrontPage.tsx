import React from "react";
import Grid from "@material-ui/core/Grid";

import sprite from "assets/img/icons-sprite.svg";
import { Brick } from "model/brick";
import { User } from "model/user";

interface FrontPageProps {
  brick: Brick;
  color: string;
  student: User;
}

const FrontPage: React.FC<FrontPageProps> = ({brick, student, color}) => {
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
    <div className="front">
      <div className="page-stitch" style={{ background: color }}>
        <div className="vertical-line"></div>
        <div className="horizontal-line top-line-1"></div>
        <div className="horizontal-line top-line-2"></div>
        <div className="horizontal-line bottom-line-1"></div>
        <div className="horizontal-line bottom-line-2"></div>
      </div>
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{ height: "100%" }}
      >
        <div style={{ width: "100%" }}>
          <div className="image-background-container">
            <div className="book-image-container">
              <svg style={{ color: color }}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#brick-icon"} />
              </svg>
            </div>
          </div>
          <div className="brick-title">{brick.title}</div>
          {renderUserRow()}
        </div>
      </Grid>
    </div>
  );
}

export default FrontPage;
