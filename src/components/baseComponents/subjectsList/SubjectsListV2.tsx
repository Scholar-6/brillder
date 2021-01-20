import React, { Component } from "react";
import { Grid, FormControlLabel } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import "./SubjectsList.scss";
import { Subject } from "model/brick";

interface PublishedSubjectsProps {
  filterHeight: string;
  subjects: Subject[];
  isPublic: boolean;
  filterBySubject(index: number): void;
}

class SubjectsListV2 extends Component<PublishedSubjectsProps> {
  renderCircle(color: string) {
    return <div className="filter-circle" style={{ ["background" as any]: color }} />
  }

  renderChecked(color: string) {
    return (
      <div className="subject-border" style={{ ["border" as any]: "0.15vw solid " + color }}>
        {this.renderCircle(color)}
      </div>
    )
  }

  renderDefault(color: string) {
    return (
      <div className="subject-no-border">
        {this.renderCircle(color)}
      </div>
    )
  }

  renderSubjectItem(subject: Subject, i: number) {
    let count = this.props.isPublic ? subject.publicCount : subject.personalCount;

    return (
      <Grid key={i} container direction="row" className="subject-list-v2">
        <Grid item xs={11} className="filter-container subjects-indexes-box">
          <FormControlLabel
            checked={subject.checked}
            onClick={() => this.props.filterBySubject(i)}
            control={
              <div>
                {subject.checked
                  ? this.renderChecked(subject.color)
                  : this.renderDefault(subject.color)
                }
              </div>
            }
            label={subject.name}
          />
        </Grid>
        <Grid item xs={1} className="published-count">
          <Grid
            container
            alignContent="center"
            justify="center"
            style={{ height: "100%", margin: "0 0" }}
          >
            {count && count > 0 ? count : ''}
          </Grid>
        </Grid>
      </Grid>
    )
  }

  render() {
    return (
      <Grid container direction="row" className="filter-container subjects-filter">
        <AnimateHeight
          duration={500}
          height={this.props.filterHeight}
          style={{ width: "100%" }}
        >
          {this.props.subjects.map(this.renderSubjectItem.bind(this))}
        </AnimateHeight>
      </Grid>
    );
  }
}

export default SubjectsListV2;
