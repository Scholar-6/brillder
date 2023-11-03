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
  isAllSubjects: boolean;
  subjects: Subject[];
  isPublic: boolean;
  isSelected: boolean;
  isAll: boolean;
  subjectGroup?: SubjectGroup | null;
  selectAll(v: boolean): void;
  openSubjectPopup(): void;
  filterBySubject(id: number): void;
}

class SubjectsListV3 extends Component<PublishedSubjectsProps> {
  renderSubjectItem(subject: Subject, i: number) {
    let className = "subject-list-v2";
    if (subject.checked) {
      className += " checked";
    }

    if (subject.viewAllCount == 0) {
      return '';
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
                count={subject.viewAllCount}
              />
            }
            label={subject.name}
          />
        </Grid>
      </Grid>
    );
  }

  render() {
    const { subjects } = this.props;

    let checkedSubjects = subjects.filter((s) => s.checked);
    let otherSubjects = subjects.filter((s) => !s.checked);

    if (!this.props.user && this.props.subjectGroup) {
      const groupSubjects = subjects.filter(s => s.group === this.props.subjectGroup);
      checkedSubjects = groupSubjects.filter((s) => s.checked);
      otherSubjects = groupSubjects.filter((s) => !s.checked);
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
          {!this.props.isAllSubjects && 
            <div className="create-subject-button" onClick={this.props.openSubjectPopup}>
              <SpriteIcon name="plus-circle" />
              <span>Add a subject</span>
            </div>
          }
        </AnimateHeight>
      </Grid>
    );
  }
}

export default SubjectsListV3;
