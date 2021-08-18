import React, { Component } from "react";
import { Grid, FormControlLabel } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import "./SubjectsList.scss";
import { Subject } from "model/brick";
import RadioButton from "../buttons/RadioButton";

interface PublishedSubjectsProps {
  filterHeight: string;
  subjects: Subject[];
  filterBySubject(index: number): void;
  showUserCount?: boolean;
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
            <Grid key={i} container direction="row" className={`subject-list-v2 ${subject.checked ? 'checked' : ''}`} onClick={() => this.props.filterBySubject(i)}>
              <Grid item xs={11} className="filter-container subjects-indexes-box">
                <FormControlLabel
                  className="index-box custom-color"
                  style={{ ["color" as any]: subject.color }}
                  checked={subject.checked}
                  control={<RadioButton checked={subject.checked} name={subject.name} color={subject.color} />}
                  label={subject.name}
                />
              </Grid>
              <Grid item xs={1} className="published-count">
                <Grid
                  container
                  alignContent="center"
                  justify="center"
                  style={{ height: "100%",margin:"0 0" }}
                >
                  {this.props.showUserCount ? subject.userCount : subject.publishedBricksCount}
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
