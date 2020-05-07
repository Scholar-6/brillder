import React from "react";
import { Grid, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";

import './Subject.scss';
import { ProposalStep } from "../../model";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
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
    const subjectId = parseInt(event.target.value) as number;
    setSubject(subjectId);
  };

  return (
    <div className="tutorial-page subject-page">
      <HomeButton link="/build" />
      <Grid container direction="row" style={{ height: '100%' }}>
        <Grid container justify="flex-start" item xs={12}>
          <Grid justify="flex-start" container item xs={9}>
            <div className="subject-container">
              <h1 className="only-tutorial-header">Choose Subject</h1>
              <Grid container justify="flex-start" item xs={12}>
                <RadioGroup
                  className="subjects-group"
                  value={subject}
                  onChange={onSubjectChange}
                >
                  {
                    subjects.map((subject, i) => {
                      return (
                        <FormControlLabel
                          key={i}
                          value={subject.id}
                          control={<Radio className="sortBy" />}
                          label={subject.name}
                        />
                      )
                    })
                  }
                </RadioGroup>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Grid style={{width: '60vw'}}>
          {
            subject ? (
              <NextButton isActive={true} step={ProposalStep.Subject} canSubmit={true} onSubmit={saveSubject} data={subject} />
            ) : ""
          }
        </Grid>
        <div className="subject-name">
          <div>Subject 1</div>
        </div>
        <ProposalPhonePreview />
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default SubjectPage
