import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';
import { Pages, SubjectType } from '../../SixthformChoices';
import { SixthformSubject, UserSubjectChoice } from 'services/axios/sixthformChoices';

enum ChoiceEnum {
  Never = 1,
  Sometimes,
  ALot
}

interface Props {
  page: Pages;
  firstAnswer: any;
  subjects: SixthformSubject[];
  subjectType: SubjectType;
  saveFirstAnswer(answer: any): void;
}

const PhoneBottomMenu: React.FC<Props> = (props) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const renderSidebarCheckbox = (currentSubjectType: SubjectType, label: string) => {
    return (
      <label className="checkbox-m-r43 font-16" onClick={() => {
        let answer = props.firstAnswer;
        if (!answer) {
          answer = { answer: { subjectType: currentSubjectType } };
        } else {
          answer.answer.subjectType = currentSubjectType;
        }
        props.saveFirstAnswer(answer.answer);
      }}>
        {currentSubjectType === props.subjectType ?
          <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6.5" cy="6.5" r="6" fill="#193266" stroke="#C43C30" />
            <circle cx="6.5" cy="6.5" r="4.5" fill="#C43C30" />
          </svg> : <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6.5" cy="6.5" r="6" fill="#193266" stroke="white" />
          </svg>}
        {label}
      </label>
    );
  }

  const renderCircle = (subject: SixthformSubject) => {
    let colorClass = 'subject-circle yellow-circle';
    if (subject.userChoice === UserSubjectChoice.Definetly) {
      colorClass = 'subject-circle green-circle';
    } else if (subject.userChoice === UserSubjectChoice.NotForMe) {
      colorClass = 'subject-circle red-circle';
    }
    return <SpriteIcon name="circle-filled" className={colorClass} />
  }

  const renderSubjectGroup = (subject: SixthformSubject) => {
    if (subject.isTLevel) {
      return "T-level";
    } else if (subject.isALevel) {
      return "A-level";
    } else {
      return "VAP";
    }
  }

  return (
    <div className={`sixthform-bottom-menu ${expanded ? 'expanded' : ''}`}>
      <div className="flex-center top-part-r54">
        <div className="label-r323 bold">{expanded ? 'Show me:' : 'Your subject rankings'}</div>
        <SpriteIcon name="double-arrows-r342" className={expanded ? 'expanded' : ''} onClick={() => setExpanded(!expanded)} />
      </div>
      {expanded && <div className="bottom-part-r54">
        <div className="subjects-select-box">
          {renderSidebarCheckbox(SubjectType.ALevels, 'A-levels Only')}
          {renderSidebarCheckbox(SubjectType.VocationalSubjects, 'Vocational Subjects Only')}
          {renderSidebarCheckbox(SubjectType.AllSubjects, 'All Subjects')}
        </div>
        <div className="label-r323 bold">Your subject rankings</div>
        <div className={`subjects-scrollbar font-16 ${props.page > Pages.Question1 ? 'big-subjects-sidebar' : ''}`}>
          {props.subjects.map((subject, i) => {
            return <div key={i} className="subject-box-r1" onMouseEnter={(event) => {
            }} onMouseLeave={(e) => {
            }}>
              {renderCircle(subject)}
              <div className="subject-name">{subject.name}</div>
              <div className="level-round font-12">{renderSubjectGroup(subject)}</div>
              <div className="score-container">{subject.score}</div>
            </div>
          })}
        </div>
      </div>}
    </div>
  );
}


export default PhoneBottomMenu;
