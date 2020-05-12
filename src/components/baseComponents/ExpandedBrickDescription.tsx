import React, { Component } from "react";

import { getAuthorRow } from "components/services/brickService";
import { Brick } from "model/brick";
import { Grid } from "@material-ui/core";
import './ExpandedBrickDescription.scss';


interface ExpandedDescriptionProps {
  isAdmin: boolean;
  brick: Brick;
  color: string;
  move(brickId: number): void;
  onDelete(brickId: number): void;
}

class ExpandedBrickDescription extends Component<ExpandedDescriptionProps> {
  getSubjectRow(brick: Brick) {
    return `${brick.subject ? brick.subject.name : "SUBJECT Code"} | No. ${
      brick.attemptsCount
    } of Plays`;
  }

  render() {
    const { color, isAdmin, brick } = this.props;

    return (
      <div className="expended-brick-info">
        <div className="hover-text">
          <div className="link-description">{brick.title}</div>
          <div className="link-info">
            {brick.subTopic} | {brick.alternativeTopics}
          </div>
          <div className="link-info">{getAuthorRow(brick)}</div>
          <div className="hovered-open-question link-info">
            {brick.openQuestion}
          </div>
          <div className="link-info">{this.getSubjectRow(brick)}</div>
          <div className="link-info">Editor: Name Surname</div>
        </div>
        <Grid
          container
          direction="row"
          className="hover-icons-row"
          alignContent="flex-end"
        >
          <Grid item xs={4} container justify="flex-start">
            <div
              className="round-button"
              style={{ background: `${color}` }}
            ></div>
          </Grid>
          <Grid item xs={4} container justify="flex-start">
            {isAdmin ? (
              <img
                alt="bin"
                onClick={() => this.props.onDelete(brick.id)}
                className="bin-button"
                src="/images/brick-list/bin.png"
              />
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={4} container justify="flex-end">
            <img
              alt="play"
              className="play-button"
              onClick={() => this.props.move(brick.id)}
              src="/images/brick-list/play.png"
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ExpandedBrickDescription;
