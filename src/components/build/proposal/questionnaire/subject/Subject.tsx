import React from "react";
import { Grid, RadioGroup, FormControlLabel, Radio, Hidden } from "@material-ui/core";
import queryString from 'query-string';

import './Subject.scss';
import { ProposalStep } from "../../model";
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import NextButton from '../../components/nextButton'
import { Redirect } from "react-router-dom";
import map from 'components/map';
import { GENERAL_SUBJECT } from "components/services/subject";
import TypingLabel from "components/baseComponents/TypingLabel";


interface SubjectProps {
  history: any;
  baseUrl: string;
  location: any;
  subjectId: any;
  subjects: any[];
  saveSubject(subjectId: number): void;
}

const FrenchComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);

  return (
    <div className="french-preview subject-preview">
      <div>
        <div>
          <TypingLabel label="“Revenons" onEnd={() => setFirstEnd(true)} />
        </div>
        <div>
          {firstFinished && <TypingLabel label="à nos" onEnd={() => setSecondEnd(true)} />}
        </div>
        <div>
          {secondFinished && <TypingLabel label="moutons”" onEnd={() => setThirdEnd(true)} />}
        </div>
      </div>
      {thirdFinished && <div className="absolute-bottom">Anon.</div>}
    </div>
  );
}

const ArtComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);

  return (
    <div className="art-preview subject-preview">
      <div>
        <TypingLabel label="“A work of" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="art is a" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="confession”" onEnd={() => setThirdEnd(true)} />}
      </div>
      {thirdFinished && <div className="absolute-bottom">Albert Camus</div>}
    </div>
  );
}

const GeneralComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourthFinished, setFourthEnd] = React.useState(false);

  return (
    <div className="art-preview spanish-preview subject-preview">
      <div>
        <TypingLabel label="“You cannot" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="shake hands" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="with a" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="clenched fist”" onEnd={() => setFourthEnd(true)} />}
      </div>
      {fourthFinished && <div className="absolute-bottom">Indira Gandhi</div>}
    </div>
  );
}

const ReligionComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);
  const [fifthFinished, setFifthEnd] = React.useState(false);

  return (
    <div className="art-preview religion-preview subject-preview">
      <div>
        <TypingLabel label="“Everything" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="has been" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="figured out," onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="except how to" onEnd={() => setFourEnd(true)} />}
      </div>
      <div>
        {fourFinished && <TypingLabel label="live”" onEnd={() => setFifthEnd(true)} />}
      </div>
      {fifthFinished && <div className="absolute-bottom">Jean-Paul Sartre</div>}
    </div>
  );
}

const SpanishComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);

  return (
    <div className="art-preview spanish-preview subject-preview">
      <div>
        <TypingLabel label="“Haciendo y" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="deshaciendo" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="se va" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="aprendiendo”" onEnd={() => setFourEnd(true)} />}
      </div>
      {fourFinished && <div className="absolute-bottom">Anon</div>}
    </div>
  );
}

const EnglishLComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);
  const [fifthFinished, setFifthEnd] = React.useState(false);

  return (
    <div className="art-preview religion-preview subject-preview">
      <div>
        <TypingLabel label="“The limits of" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="my language" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="mean the" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="limits of my" onEnd={() => setFourEnd(true)} />}
      </div>
      <div>
        {fourFinished && <TypingLabel label="world”" onEnd={() => setFifthEnd(true)} />}
      </div>
      {fifthFinished && <div className="absolute-bottom">Wittgenstein</div>}
    </div>
  );
}

const HistoryPComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);

  return (
    <div className="history-preview subject-preview">
      <div>
        <TypingLabel label="“Time the" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="destroyer is" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="time the" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="preserver”" onEnd={() => setFourEnd(true)} />}
      </div>
      {fourFinished && <div className="absolute-bottom">T. S. Eliot</div>}
    </div>
  );
}

const HistoryAComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);

  return (
    <div className="art-preview history-art-preview subject-preview">
      <div>
        <TypingLabel label="“I paint" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="flowers so" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="they will" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="not die”" onEnd={() => setFourEnd(true)} />}
      </div>
      {fourFinished && <div className="absolute-bottom">Frida Kahlo</div>}
    </div>
  );
}

const SociologyComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);
  const [fifthFinished, setFifthEnd] = React.useState(false);

  return (
    <div className="art-preview religion-preview subject-preview">
      <div>
        <TypingLabel label="“The eyes of" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="others our" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="prisons; their" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="thoughts our" onEnd={() => setFourEnd(true)} />}
      </div>
      <div>
        {fourFinished && <TypingLabel label="cages”" onEnd={() => setFifthEnd(true)} />}
      </div>
      {fifthFinished && <div className="absolute-bottom">Virginia Woolf</div>}
    </div>
  );
}

const MusicComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);

  return (
    <div className="art-preview religion-preview subject-preview">
      <div>
        <TypingLabel label="“Where" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="words fail," onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="music" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="speaks”" onEnd={() => setFourEnd(true)} />}
      </div>
      {fourFinished && <div className="absolute-bottom">H. C. Andersen</div>}
    </div>
  );
}

const BiologyComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);

  return (
    <div className="biology-preview subject-preview">
      <div>
        <TypingLabel label="“Life is," onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="after all, not" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="a product of" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="morality.”" onEnd={() => setFourEnd(true)} />}
      </div>
      {fourFinished && <div className="absolute-bottom">Nietzsche</div>}
    </div>
  );
}

const ChineseComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);

  return (
    <div className="chinese-preview subject-preview">
      <div>
        <TypingLabel label="字值千金" onEnd={() => setFirstEnd(true)} />
      </div>
      {firstFinished && <div className="absolute-bottom">Proverb</div>}
    </div>
  );
}

const ClassicsComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);

  return (
    <div className="classics-preview subject-preview">
      <div>
        <TypingLabel label="“Dis aliter" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="visum”" onEnd={() => setSecondEnd(true)} />}
      </div>
      {secondFinished && <div className="absolute-bottom">Virgil</div>}
    </div>
  );
}


const EconomicsComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);
  const [fifthFinished, setFifthEnd] = React.useState(false);

  return (
    <div className="economics-preview subject-preview">
      <div>
        <TypingLabel label="“Share it" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="fairly but" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="don’t take a" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="slice of" onEnd={() => setFourEnd(true)} />}
      </div>
      <div>
        {fourFinished && <TypingLabel label="my pie…”" onEnd={() => setFifthEnd(true)} />}
      </div>
      {fifthFinished && <div className="absolute-bottom">Pink Floyd</div>}
    </div>
  );
}

const EnglishComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);

  return (
    <div className="english-preview subject-preview">
      <div>
        <TypingLabel label="“What’s in a" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="name?”" onEnd={() => setSecondEnd(true)} />}
      </div>
      {secondFinished && <div className="absolute-bottom">Shakespeare</div>}
    </div>
  );
}

const GeographyComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);
  const [fifthFinished, setFifthEnd] = React.useState(false);
  const [sixFinished, setSixEnd] = React.useState(false);

  return (
    <div className="geography-preview subject-preview">
      <div>
        <TypingLabel label="“Planet" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="Earth is" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="blue, and" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="there’s" onEnd={() => setFourEnd(true)} />}
      </div>
      <div>
        {fourFinished && <TypingLabel label="nothing I" onEnd={() => setFifthEnd(true)} />}
      </div>
      <div>
        {fifthFinished && <TypingLabel label="can do.”" onEnd={() => setSixEnd(true)} />}
      </div>
      {sixFinished && <div className="absolute-bottom">David Bowie</div>}
    </div>
  );
}



const MathsComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);

  return (
    <div className="maths-preview subject-preview">
      <div>
        <TypingLabel label="“Number is" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="the ruler of" onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="forms and" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="ideas”" onEnd={() => setFourEnd(true)} />}
      </div>
      {fourFinished && <div className="absolute-bottom">Pythagoras</div>}
    </div>
  );
}

const PhysicsComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);
  const [fourFinished, setFourEnd] = React.useState(false);

  return (
    <div className="physics-preview subject-preview">
      <div>
        <TypingLabel label="“Everything" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="by number," onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="weight, and" onEnd={() => setThirdEnd(true)} />}
      </div>
      <div>
        {thirdFinished && <TypingLabel label="measure”" onEnd={() => setFourEnd(true)} />}
      </div>
      {fourFinished && <div className="absolute-bottom">Newton</div>}
    </div>
  );
}

const PsychologyComponent: React.FC = () => {
  const [firstFinished, setFirstEnd] = React.useState(false);
  const [secondFinished, setSecondEnd] = React.useState(false);
  const [thirdFinished, setThirdEnd] = React.useState(false);

  return (
    <div className="psychology-preview subject-preview">
      <div>
        <TypingLabel label="“Who looks" onEnd={() => setFirstEnd(true)} />
      </div>
      <div>
        {firstFinished && <TypingLabel label="inside," onEnd={() => setSecondEnd(true)} />}
      </div>
      <div>
        {secondFinished && <TypingLabel label="awakes”" onEnd={() => setThirdEnd(true)} />}
      </div>
      {thirdFinished &&     <div className="absolute-bottom">Carl Jung</div>}
    </div>
  );
}

const GermanComponent: React.FC = () => {
  return (
    <div className="german-preview">
      <div>
        <div>“Ohne Hast,</div>
        <div>aber ohne</div>
        <div>Rast”</div>
      </div>
      <div>Goethe</div>
    </div>
  );
}

const TheologyComponent: React.FC = () => {
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
  );
}


const DefaultComponent: React.FC = () => {
  return (
    <div className="logo-page subject-default-preview b-dark-blue">
      <img src="/images/choose-login/logo.png" className="brick-logo-image" alt="brix-logo" />
      <img alt="Logo" src="/images/choose-user/brillder-white-text.svg" className="logo-mobile-text-image" />
    </div>
  );
}

const SubjectPage: React.FC<SubjectProps> = ({
  history, subjectId, subjects, baseUrl, location, saveSubject
}) => {
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

  const onSubjectChange = (event: any) => {
    const subjectId = parseInt(event.target.value) as number;
    setSubject(subjectId);
    const currentName = getSubjectName(subjectId);
    setSubjectName(currentName);
    saveSubject(subjectId);
  };

  const values = queryString.parse(location.search);

  if (subjects.length === 1) {
    saveSubject(subjects[0].id);
    return <Redirect to={map.ProposalTitleLink} />
  }

  if (values.selectedSubject) {
    try {
      let subjectId = parseInt(values.selectedSubject as string);
      let res = subjects.find(s => s.id === subjectId);
      if (res) {
        saveSubject(res.id);
        return <Redirect to={map.ProposalTitleLink} />
      }
    } catch { }
  }

  const getInnerComponent = () => {
    if (subjectName === 'French') {
      return FrenchComponent;
    } else if (subjectName === 'Art & Design') {
      return ArtComponent;
    } else if (subjectName === GENERAL_SUBJECT) {
      return GeneralComponent;
    } else if (subjectName === 'Religion & Philosophy') {
      return ReligionComponent;
    } else if (subjectName === 'Spanish') {
      return SpanishComponent;
    } else if (subjectName === 'English Language') {
      return EnglishLComponent;
    } else if (subjectName === 'History & Politics') {
      return HistoryPComponent;
    } else if (subjectName === 'History of Art') {
      return HistoryAComponent;
    } else if (subjectName === 'Sociology') {
      return SociologyComponent;
    } else if (subjectName === 'Music') {
      return MusicComponent;
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
    } else if (subjectName === 'Geography') {
      return GeographyComponent;
    } else if (subjectName === 'German') {
      return GermanComponent;
    } else if (subjectName === 'Maths') {
      return MathsComponent;
    } else if (subjectName === 'Physics') {
      return PhysicsComponent;
    } else if (subjectName === 'Psychology') {
      return PsychologyComponent;
    } else if (subjectName === 'Theology & Philosophy') {
      return TheologyComponent;
    } else {
      return DefaultComponent;
    }
  }

  let innerComponent = getInnerComponent();

  return (
    <div className="tutorial-page subject-page">
      <Grid container direction="row" style={{ height: '100%' }}>
        <Grid container justify="flex-start" className="subject-box" item md={10} xs={12}>
          <Grid justify="flex-start" container item md={8} xs={12}>
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
        {subject &&
          <Grid className='tutorial-pagination'>
            <div className="centered text-theme-dark-blue bold" style={{ fontSize: '2vw', marginRight: '2vw' }}
              onClick={() => { saveSubject(subject); history.push(map.ProposalTitleLink) }}>
              Next
            </div>
            <NextButton
              isActive={true} step={ProposalStep.Subject}
              baseUrl={baseUrl} canSubmit={true} onSubmit={saveSubject} data={subject}
            />
          </Grid>
        }
        <Hidden only={['xs', 'sm']}>
          <div className="subject-name">
            <div>{subjectName}</div>
          </div>
        </Hidden>
        <ProposalPhonePreview Component={innerComponent} />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default SubjectPage
