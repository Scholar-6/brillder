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

const FrenchComponent:React.FC = () => {
  return (
    <div className="french-preview">
      <div>
        <div>“Revenons</div>
        <div>à nos</div>
        <div>moutons”</div>
      </div>
      <div>Anon.</div>
    </div>
  )
}

const ArtComponent:React.FC = () => {
  return (
    <div className="art-preview">
      <div>“A work of art is a confession”</div>
      <div>Albert Camus</div>
    </div>
  )
}

const BiologyComponent:React.FC = () => {
  return (
    <div className="biology-preview">
      <div>“Life is, after all, not a product of morality.”</div>
      <div>Nietzsche</div>
    </div>
  )
}

const ChineseComponent:React.FC = () => {
  return (
    <div className="chinese-preview">
      <div>字值千金</div>
      <div>Proverb</div>
    </div>
  )
}

const ClassicsComponent:React.FC = () => {
  return (
    <div className="classics-preview">
      <div>“Dis aliter visum”</div>
      <div>Virgil</div>
    </div>
  )
}

const EconomicsComponent:React.FC = () => {
  return (
    <div className="economics-preview">
      <div>
        <div>“Share it</div>
        <div>fairly but</div>
        <div>don’t take a</div>
        <div>slice of</div>
        <div>my pie…”</div>
      </div>
      <div>Pink Floyd</div>
    </div>
  )
}

const EnglishComponent:React.FC = () => {
  return (
    <div className="english-preview">
      <div>“What’s in a name?”</div>
      <div>Shakespeare</div>
    </div>
  )
}

const DramaComponent:React.FC = () => {
  return (
    <div className="drama-preview">
    </div>
  )
}

const GeographyComponent:React.FC = () => {
  return (
    <div className="geography-preview">
      <div>
        <div>“Planet</div>
        <div>Earth is</div>
        <div>blue, and</div>
        <div>there’s</div>
        <div>nothing I</div>
        <div>can do.”</div>
      </div>
      <div>David Bowie</div>
    </div>
  )
}

const HistoryComponent:React.FC = () => {
  return (
    <div className="history-preview">
      <div>
        <div>“Time the</div>
        <div>destroyer is</div>
        <div>time the</div>
        <div>preserver”</div>
      </div>
      <div>T. S. Eliot</div>
    </div>
  )
}

const MathsComponent:React.FC = () => {
  return (
    <div className="maths-preview">
      <div>
        <div>“Number is</div>
        <div>the ruler of</div>
        <div>forms and</div>
        <div>ideas”</div>
      </div>
      <div>Pythagoras</div>
    </div>
  )
}

const PhysicsComponent:React.FC = () => {
  return (
    <div className="physics-preview">
      <div>
        <div>“Everything</div>
        <div>by number, </div>
        <div>weight, and </div>
        <div>measure”</div>
      </div>
      <div>Newton</div>
    </div>
  )
}

const PsychologyComponent:React.FC = () => {
  return (
    <div className="psychology-preview">
      <div>
        <div>“Who looks</div>
        <div> inside,</div>
        <div>awakes”</div>
      </div>
      <div>Carl Jung</div>
    </div>
  )
}

const GermanComponent:React.FC = () => {
  return (
    <div className="german-preview">
      <div>
        <div>“Ohne Hast,</div>
        <div>aber ohne</div>
        <div>Rast”</div>
      </div>
      <div>Goethe</div>
    </div>
  )
}

const TheologyComponent:React.FC = () => {
  return (
    <div className="philosophy-preview">
      <div>
        <div>“Everything</div>
        <div>has been</div>
        <div>figured out,</div>
        <div>except how</div>
        <div>to live.”</div>
      </div>
      <div>Jean-Paul Sartre</div>
    </div>
  )
}

const SubjectPage:React.FC<SubjectProps> = ({ subjectId, subjects, saveSubject }) => {
  const getSubjectName = (subjectId: number) => {
    if (subjectId) {
      const subject = subjects.find(s => s.id === subjectId);
      if (subject) {
        return subject.name;
      }
    }
    return "";
  }

  let initSubjectName = getSubjectName(subjectId);

  const [subject, setSubject] = React.useState(subjectId);
  const [subjectName, setSubjectName] = React.useState(initSubjectName);

  if (subjects.length === 1) {
    saveSubject(subjects[0].id);
    return <Redirect to="/build/new-brick/brick-title" />
  }

  const onSubjectChange = (event: any) => {
    const subjectId = parseInt(event.target.value) as number;
    setSubject(subjectId);
    const currentName = getSubjectName(subjectId);
    setSubjectName(currentName);
  };

  const getInnerComponent = () => {
    if (subjectName === 'French') {
      return FrenchComponent;
    } else if (subjectName === 'Art & Design') {
      return ArtComponent;
    } else if (subjectName === 'Biology') {
      return BiologyComponent;
    } else if (subjectName === 'Chinese') {
      return ChineseComponent;
    } else if (subjectName === 'Classics') {
      return ClassicsComponent;
    } else if (subjectName === 'Economics') {
      return EconomicsComponent;
    } else if (subjectName === 'English Literature') {
      return EnglishComponent;
    } else if (subjectName === 'Drama & Theatre') {
        return DramaComponent;
    } else if (subjectName === 'Geography') {
      return GeographyComponent;
    } else if (subjectName === 'German') {
      return GermanComponent;
    } else if (subjectName === 'History') {
      return HistoryComponent;
    } else if (subjectName === 'Maths') {
      return MathsComponent;
    } else if (subjectName === 'Physics') {
      return PhysicsComponent;
    } else if (subjectName === 'Psychology') {
      return PsychologyComponent;
    } else if (subjectName === 'Theology & Philosophy') {
      return TheologyComponent;
    }
  }

  let innerComponent = getInnerComponent();

  return (
    <div className="tutorial-page subject-page">
      <HomeButton link="/build" />
      <Grid container direction="row" style={{ height: '100%' }}>
        <Grid container justify="flex-start" item xs={10}>
          <Grid justify="flex-start" container item xs={8}>
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
          <div>{subjectName}</div>
        </div>
        <ProposalPhonePreview Component={innerComponent} />
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default SubjectPage
