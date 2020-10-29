import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import "./SubjectsList.scss";
import { Subject } from "model/brick";

interface PublishedSubjectsProps {
  filterHeight: string;
  subjects: Subject[];
  filterBySubject(index: number): void;
}

class SubjectsList extends Component<PublishedSubjectsProps, any> {
  render() {
    return (
      <Grid container direction="row" className="filter-container subjects-filter">
        <AnimateHeight
          duration={500}
          height={this.props.filterHeight}
          style={{ width: "100%" }}
        >
          {this.props.subjects.map((subject, i) => (
            <Grid key={i} container direction="row">
              <Grid item xs={11} className="filter-container subjects-indexes-box">
                <FormControlLabel
                  className="index-box custom-color"
                  style={{ ["color" as any]: subject.color }}
                  checked={subject.checked}
                  control={<Radio onClick={() => this.props.filterBySubject(i)} className={"filter-radio"} />}
                  label={subject.name}
                />
              </Grid>
              <Grid item xs={1} className="published-count">
                <Grid
                  container
                  alignContent="center"
                  justify="center"
                  style={{ height: "100%",margin:"0 0.7vw" }}
                >
                  {subject.publishedBricksCount}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </AnimateHeight>
      </Grid>
    );
  }
}

export default SubjectsList;
