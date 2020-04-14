import React from "react";
import { Grid, Select, FormControl, MenuItem, InputLabel } from "@material-ui/core";

import './Subject.scss';
import { NewBrickStep } from "../../model";
import ExitButton from '../../components/ExitButton';
import NextButton from '../../components/nextButton'
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
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
    console.log(event.target.value);
    setSubject(event.target.value as number);
  };

  console.log(subject);

  return (
    <div className="tutorial-page subject-page">
      <ExitButton />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={7} lg={7}>
            <div className="left-card">
              <h1 className="only-tutorial-header">Choose subject</h1>
              <Grid container justify="center" item xs={12}>
              <FormControl>
                <InputLabel id="demo-simple-select-label" style={{fontFamily: 'Brandon Grotesque Regular'}}>Subject</InputLabel>
                <Select
                  value={subject}
                  onChange={(e) => onSubjectChange(e)}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{minWidth: '10vw', fontFamily: 'Brandon Grotesque Regular'}}
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
                  <NextButton step={NewBrickStep.Subject} canSubmit={true} onSubmit={saveSubject} data={subject} />
                ) : ""
              }
              
            </div>
          </Grid>
        </Grid>
        <PhonePreview link="/logo-page" />
      </Grid>
    </div>
  );
}

export default SubjectPage
