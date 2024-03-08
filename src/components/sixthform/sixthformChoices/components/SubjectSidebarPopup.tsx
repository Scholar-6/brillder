import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { SixthformSubject, UserSubjectChoice } from "services/axios/sixthformChoices";
import { fileUrl } from "components/services/uploadFile";

interface Props {
  subject: any;
  popupSubject: any;
  subjectPosition: any;
  showPopup(): void;
  updateSubject(subject: SixthformSubject): void;
}

const SubjectSidebarPopup: React.FC<Props> = (props) => {
  const {subject} = props;

  const renderCircle = (subject: SixthformSubject) => {
    let colorClass = 'subject-circle yellow-circle';
    if (subject.userChoice === UserSubjectChoice.Definetly) {
      colorClass = 'subject-circle green-circle';
    } else if (subject.userChoice === UserSubjectChoice.NotForMe) {
      colorClass = 'subject-circle red-circle';
    }
    return <SpriteIcon name="circle-filled" className={colorClass} />
  }

  const renderBrick = (subject: SixthformSubject) => {
    if (subject.brick) {
      return (
        <div className="brick-container">
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

  const renderSwitchButton = (subject: SixthformSubject) => {
    return (
      <div className="switch-button font-12 bold">
        <div
          className={`${subject.userChoice === UserSubjectChoice.Definetly ? 'active active-green' : ''}`}
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
            subject.userChoice = UserSubjectChoice.Definetly;
            props.updateSubject(subject);
          }}>Definitely!</div>
        <div
          className={`${subject.userChoice === UserSubjectChoice.Maybe || !subject.userChoice ? 'active active-yellow' : ''}`}
          onClick={() => {
            if (!subject.score) {
              subject.score = 0;
            }

            if (subject.userChoice === UserSubjectChoice.Definetly) {
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
          className={`${subject.userChoice === UserSubjectChoice.NotForMe ? 'active active-red' : ''}`}
          onClick={() => {
            if (!subject.score) {
              subject.score = 0;
            }

            if (subject.userChoice === UserSubjectChoice.Definetly) {
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

  if (props.popupSubject && props.popupSubject === subject) {
    const { popupSubject, subjectPosition } = props;
    const windowHeight = window.innerHeight;
    let style = { top: '11vw', bottom: 'unset' };

    if (subjectPosition && (subjectPosition.bottom > (windowHeight / 1.5))) {
      // popup should be based on bottom
      style.top = 'unset';
      style.bottom = '5vw';
    } else if (subjectPosition && (subjectPosition.bottom > (windowHeight / 1.7))) {
      // popup should be based on bottom
      style.top = 'unset';
      style.bottom = '11vw';
    }
    return (
      <div style={style} className={`subject-sixth-popup ${subject.isTLevel ? 'big-T-level' : ''}`}>
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
            {popupSubject.name} {/*popupSubject.score*/}
          </span>
        </div>
        <div className="font-14">
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
              props.showPopup();
            }
          }}>
            <div className="label-container">
              <div>
                <div className="bold font-18">Try a taster topic</div>
                <div className="font-14">Try out a Brick for this subject to see if it’s a good fit for you.</div>
              </div>
            </div>
            <div>
              {renderBrick(subject)}
            </div>
          </div>}
      </div>
    );
  }
  return <div />;
}

export default SubjectSidebarPopup;
