import React, { Component } from "react";
import { Grid, FormControlLabel } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import "./SubjectsList.scss";
import { Subject, SubjectAItem } from "model/brick";
import RadioButton from "../buttons/RadioButton";

interface PublishedSubjectsProps {
  filterHeight: string;
  subjects: SubjectAItem[];
  ref?: React.RefObject<any>;
  filterBySubject(id: number): void;
}

class SubjectsListLibrary extends Component<PublishedSubjectsProps> {
  renderSubjectItem(subject: SubjectAItem, i: number) {
    let className = "subject-list-v2";
    if (subject.checked) {
      className += ' checked';
    }

    return (
      <Grid key={i} container direction="row" className={className} onClick={() => this.props.filterBySubject(subject.id)}>
        <Grid item xs={10} className="filter-container subjects-indexes-box">
          <FormControlLabel
            checked={subject.checked}
            control={
              <RadioButton checked={subject.checked} name={subject.name} color={subject.color} />
            }
            label={subject.name}
          />
        </Grid>
        <Grid item xs={2} className="published-count">
          <Grid
            container
            alignContent="center"
            justify="center"
            style={{ height: "100%", margin: "0 0" }}
          >
            {subject.playedCount} / {subject.assignedCount}
          </Grid>
        </Grid>
      </Grid>
    )
  }

  render() {
    return (
      <Grid container direction="row" className="filter-container subjects-filter subjects-filter-v2" ref={this.props.ref}>
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

export default SubjectsListLibrary;
