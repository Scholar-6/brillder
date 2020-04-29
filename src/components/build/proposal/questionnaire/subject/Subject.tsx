import React from "react";
import { Grid, Select, FormControl, MenuItem, InputLabel } from "@material-ui/core";

import './Subject.scss';
import { ProposalStep } from "../../model";
import ExitButton from '../../components/ExitButton';
import NextButton from '../../components/nextButton'
import { Redirect } from "react-router-dom";


interface SubjectProps {
  subjectId: any
  subjects: any[]
  saveSubject(subjectId: number):void
}

const SubjectPage:React.FC<SubjectProps> = ({ subjectId, subjects, saveSubject }) => {
  const [subject, setSubject] = React.useState(subjectId);

  if (subjects.length === 1) {
    saveSubject(subjects[0].id);
    return <Redirect to="/build/new-brick/brick-title" />
  }

  const onSubjectChange = (event: any) => {
    setSubject(event.target.value as number);
  };

  return (
    <div className="tutorial-page subject-page">
      <ExitButton />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12}>
          <Grid justify="center" container item xs={12} sm={9} md={5} lg={4}>
            <div className="subject-container">
              <h1 className="only-tutorial-header">Choose subject</h1>
              <Grid container justify="center" item xs={12}>
              <FormControl>
                <InputLabel id="demo-simple-select-label" className="select-label" style={{fontFamily: 'Brandon Grotesque Regular'}}>Subject</InputLabel>
                <Select
                  value={subject}
                  onChange={(e) => onSubjectChange(e)}
                  labelId="demo-simple-select-label"
                  className="select-subject"
                  style={{fontFamily: 'Brandon Grotesque Regular'}}
                >
                  {
                    subjects.map((subject, i) => {
                      return (
                        <MenuItem style={{fontFamily: 'Brandon Grotesque Regular'}} key={i} value={subject.id}>
                          {subject.name}
                        </MenuItem>
                      );
                    })
                  }
                </Select>
              </FormControl>
              </Grid>
              {
                subject ? (
                  <NextButton isActive={true} step={ProposalStep.Subject} canSubmit={true} onSubmit={saveSubject} data={subject} />
                ) : ""
              }
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default SubjectPage
