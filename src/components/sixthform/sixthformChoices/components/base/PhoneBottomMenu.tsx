import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';
import { Pages, SubjectType } from '../../SixthformChoices';
import { SixthformSubject, UserSubjectChoice } from 'services/axios/sixthformChoices';
import { fileUrl } from 'components/services/uploadFile';

enum ChoiceEnum {
  Never = 1,
  Sometimes,
  ALot
}

interface Props {
  page: Pages;
  firstAnswer: any;
  showPopup(subject: any): void;
  subjects: SixthformSubject[];
  subjectType: SubjectType;
  updateSubject(subject: SixthformSubject): void;
  saveFirstAnswer(answer: any): void;
}

const PhoneBottomMenu: React.FC<Props> = (props) => {
  const [expandedSubject, setExpandedSubject] = React.useState(null as any);
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
    if (subject.userChoice === UserSubjectChoice.Favourite) {
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

  const renderSubjectList = () => {
    return (
      <div className={`subjects-scrollbar font-16 ${props.page > Pages.Question1 ? 'big-subjects-sidebar' : ''}`}>
        {props.subjects.map((subject, i) => {
          return <div key={i} className="subject-box-r1" onMouseEnter={(event) => {
          }} onMouseLeave={(e) => {
          }}>
            {renderCircle(subject)}
            <div className="subject-name">{subject.name}</div>
            <div className="level-round font-12">{renderSubjectGroup(subject)}</div>
            <SpriteIcon name="arrow-right" className="arrow-right" onClick={() => {
              setExpandedSubject(subject);
            }} />
          </div>
        })}
      </div>
    );
  }

  const renderSwitchButton = (subject: SixthformSubject) => {
    return (
      <div className="switch-button font-12 bold">
        <div
          className={`${subject.userChoice === UserSubjectChoice.Favourite ? 'active active-green green-switch' : 'green-switch'}`}
          onClick={() => {
            if (!subject.score) {
              subject.score = 0;
            }
            if (subject.userChoice === UserSubjectChoice.Maybe) {
              subject.score += 2;
            } else if (subject.userChoice === UserSubjectChoice.NotForMe) {
              subject.score += 15;
            } else {
              subject.score += 5;
            }
            subject.userChoice = UserSubjectChoice.Favourite;
            props.updateSubject(subject);
          }}>Favorite</div>
        <div
          className={`${subject.userChoice === UserSubjectChoice.Maybe || !subject.userChoice ? 'active active-yellow yellow-switch' : 'yellow-switch'}`}
          onClick={() => {
            if (!subject.score) {
              subject.score = 0;
            }

            if (subject.userChoice === UserSubjectChoice.Favourite) {
              subject.score -= 2;
            } else if (subject.userChoice === UserSubjectChoice.NotForMe) {
              subject.score += 13;
            } else {
              subject.score += 3;
            }
            subject.userChoice = UserSubjectChoice.Maybe;
            props.updateSubject(subject);
          }}>Maybe</div>
        <div
          className={`${subject.userChoice === UserSubjectChoice.NotForMe ? 'active active-red red-switch' : 'red-switch'}`}
          onClick={() => {
            if (!subject.score) {
              subject.score = 0;
            }

            if (subject.userChoice === UserSubjectChoice.Favourite) {
              subject.score -= 15;
            } else if (subject.userChoice === UserSubjectChoice.Maybe) {
              subject.score -= 13;
            } else {
              subject.score -= 10;
            }
            subject.userChoice = UserSubjectChoice.NotForMe;
            props.updateSubject(subject);
          }}>Not for me</div>
      </div>
    );
  }

  const renderBrick = (subject: SixthformSubject) => {
    if (subject.brick) {
      return (
        <div className="brick-container">
          <div className="try-taster-btn">Try a taster topic</div>
          <div className="scroll-block" style={{ backgroundImage: `url(${fileUrl(subject.brick.coverImage)})` }}></div>
          <div className="bottom-description-color" />
          <div className="bottom-description font-8 bold" dangerouslySetInnerHTML={{ __html: subject.brick.title }} />
        </div>
      );
    }
    return (
      <div className="brick-container">
        <div className="scroll-block" style={{ backgroundImage: `url(https://s3.eu-west-2.amazonaws.com/app.brillder.files.com/files/6c5bb9cb-28f0-4bb4-acc6-0169ef9ce9aa.png)` }}></div>
        <div className="bottom-description-color" />
        <div className="bottom-description font-8 bold">Introduction to Advanced Mathemathics</div>
      </div>
    );
  }

  const renderExpandedSubject = () => {
    let subject = expandedSubject;
    return (
      <div className={`subject-sixth-popup ${subject.isTLevel ? 'big-T-level' : ''}`}>
        {subject.facilitatingSubject &&
          <div className="facilitation-container font-12">
            <div>
              <SpriteIcon name="facilitating-badge" />
              <span>Facilitating Subject</span>
            </div>
          </div>}
        <div className="subject-name font-24 bold">
          {renderCircle(subject)}
          <span className="subject-name-only">
            {subject.name}
          </span>
        </div>
        <div className="font-14 text-justify">
          {subject.description && subject.description}
        </div>
        <div className="second-row">
          <div className="box-v32 m-r">
            <div>
              <SpriteIcon name="user-custom-v3" />
            </div>
            <div className="font-12">Candidates</div>
            <div className="bold font-15">{subject.candidates > 0 ? subject.candidates : 1000}</div>
          </div>
          <div className="box-v32">
            <div>
              <SpriteIcon name="facility-icon-hat" />
            </div>
            <div className="font-12">Subject Group</div>
            <div className="bold font-12">{subject.subjectGroup ? subject.subjectGroup : 'STEM'}</div>
          </div>
          <div className="box-v32 m-l">
            <div>
              <SpriteIcon name="bricks-icon-v3" />
            </div>
            <div className="font-12">Often taken with</div>
            <div className="bold font-11">{subject.oftenWith ? subject.oftenWith : 'Accounting, Business'}</div>
          </div>
        </div>
        {renderSwitchButton(subject)}
        {subject.brick &&
          <div className="taste-container" onClick={() => {
            if (subject.brick) {
              props.showPopup(subject);
            }
          }}>
            {renderBrick(subject)}
          </div>}
      </div>
    );
  }

  if (expanded && expandedSubject) {
    return (
      <div className="sixthform-bottom-menu expanded ">
        <div className="flex-center top-part-r54 top-part-r55">
          <SpriteIcon name="arrow-left" onClick={() => setExpandedSubject(null)} />
          <div className="label-r323 bold" onClick={() => setExpandedSubject(null)}> Back to subject rankings</div>
          <SpriteIcon name="double-arrows-r342" className={expanded ? 'expanded' : ''} onClick={() => setExpanded(!expanded)} />
        </div>
        <div className="bottom-part-r54 bottom-part-r55">
          {renderExpandedSubject()}
        </div>
      </div>
    );
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
        {renderSubjectList()}
      </div>}
    </div>
  );
}


export default PhoneBottomMenu;
