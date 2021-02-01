import React, { Component } from "react";
import { Grid, FormControlLabel } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import "./SubjectsList.scss";
import { Subject } from "model/brick";
import RadioButton from "../buttons/RadioButton";

interface PublishedSubjectsProps {
  filterHeight: string;
  subjects: Subject[];
  ref?: React.RefObject<any>;
  filterBySubject(id: number): void;
}

class SubjectsListV2 extends Component<PublishedSubjectsProps> {
  renderSubjectItem(subject: Subject, i: number) {
    let count = 0;
    if (subject.publicCount) {
      count += subject.publicCount;
    }
    if (subject.personalCount) {
      count += subject.personalCount;
    }

    let className = "subject-list-v2";
    if (subject.checked) {
      className += ' checked';
    }

    return (
      <Grid key={i} container direction="row" className={className} onClick={() => this.props.filterBySubject(subject.id)}>
        <Grid item xs={11} className="filter-container subjects-indexes-box">
          <FormControlLabel
            checked={subject.checked}
            control={
              <RadioButton checked={subject.checked} name={subject.name} color={subject.color} />
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
    const {subjects} = this.props;
    let checkedSubjects = subjects.filter(s => s.checked);
    let otherSubjects = subjects.filter(s => !s.checked);

    return (
      <Grid container direction="row" className="filter-container subjects-filter subjects-filter-v2" ref={this.props.ref}>
        <AnimateHeight
          duration={500}
          height={this.props.filterHeight}
          style={{ width: "100%" }}
        >
          {checkedSubjects.map(this.renderSubjectItem.bind(this))}
          {otherSubjects.map(this.renderSubjectItem.bind(this))}
        </AnimateHeight>
      </Grid>
    );
  }
}

export default SubjectsListV2;
