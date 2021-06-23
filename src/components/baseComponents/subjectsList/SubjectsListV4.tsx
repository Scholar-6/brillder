import React, { Component } from "react";
import { Grid, FormControlLabel } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import "./SubjectsList.scss";
import { Subject, SubjectGroup } from "model/brick";
import RadioButton from "../buttons/RadioButton";
import SpriteIcon from "../SpriteIcon";
import { User } from "model/user";

interface PublishedSubjectsProps {
  user: User;
  filterHeight: string;
  isAllCategory: boolean;
  subjects: Subject[];
  isSelected: boolean;
  isAll: boolean;
  subjectGroup?: SubjectGroup | null;
  selectAll(v: boolean): void;
  openSubjectPopup(): void;
  filterBySubject(id: number): void;
}

/**
 * Based on selected category
 */
class SubjectsListV4 extends Component<PublishedSubjectsProps> {
  renderViewAllItem(count: number) {
    let className = "subject-list-v2";
    if (this.props.isAll) {
      className += " checked";
    }

    return (
      <Grid
        container
        direction="row"
        className={className}
        onClick={() => this.props.selectAll(this.props.isAll)}
      >
        <Grid item xs={11} className="filter-container subjects-indexes-box view-all-subjects">
          <SpriteIcon name="glasses" />
          <span>
            All Subjects
          </span>
        </Grid>
        <Grid item xs={1} className="published-count">
          <Grid
            container
            alignContent="center"
            justify="center"
            style={{ height: "100%", margin: "0 0" }}
          >
            {count && count > 0 ? count : ""}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  renderSubjectItem(subject: Subject, i: number) {
    const count = subject.publicCount

    let className = "subject-list-v2";
    if (subject.checked) {
      className += " checked";
    }

    return (
      <Grid
        key={i}
        container
        direction="row"
        className={className}
        onClick={() => this.props.filterBySubject(subject.id)}
      >
        <Grid item xs={11} className="filter-container subjects-indexes-box">
          <FormControlLabel
            checked={subject.checked}
            control={
              <RadioButton
                checked={subject.checked}
                name={subject.name}
                color={subject.color}
              />
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
            {count && count > 0 ? count : ""}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    const { subjects } = this.props;

    let checkedSubjects = subjects.filter((s) => s.checked);
    let otherSubjects = subjects.filter((s) => !s.checked);

    let viewAllCount = 0;

    if (this.props.subjectGroup) {
      const groupSubjects = subjects.filter(s => s.group === this.props.subjectGroup);
      checkedSubjects = groupSubjects.filter((s) => s.checked);
      otherSubjects = groupSubjects.filter((s) => !s.checked);
      for (let s of subjects) {
        if (s.publicCount) {
          viewAllCount += s.publicCount;
        }
      }
    } else {
      checkedSubjects = subjects.filter((s) => s.checked);
      otherSubjects = subjects.filter((s) => !s.checked);
    }

    return (
      <Grid
        container
        direction="row"
        className="filter-container subjects-filter subjects-filter-v2 subjects-filter-v3"
      >
        <AnimateHeight
          duration={500}
          height={this.props.filterHeight}
          style={{ width: "100%" }}
        >
          {checkedSubjects.map(this.renderSubjectItem.bind(this))}
          {otherSubjects.map(this.renderSubjectItem.bind(this))}
          {this.renderViewAllItem(viewAllCount)}
        </AnimateHeight>
      </Grid>
    );
  }
}

export default SubjectsListV4;
