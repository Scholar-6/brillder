import React, { Component } from "react";
import { Dialog } from "@material-ui/core";

import { SixthformSubject } from "services/axios/sixthformChoices";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ButtonR34 from "../ButtonR34";
import NextButtonSix from "../NextButtonSix";
import { isPhone } from "services/phone";

export enum ThirdStepDChoice {
  First = 1,
  Second,
}

export enum ThirdStepDSubStep {
  Start = 1,
  TableLeaf,
}

interface ThirdProps {
  subjects: SixthformSubject[];
  answer: any;
  onChange(answer: any): void;
  saveAnswer(answer: any): void;
  moveBack(answer: any): void;
  moveNext(): void;
}

interface TLevelCourse {
  icon: string;
  name: string;
  expanded?: boolean;
  subjects: any[];
}

interface ThirdQuestionState {
  choice: ThirdStepDChoice | null;
  subStep: ThirdStepDSubStep;
  nothing: boolean;
  tLevelCoursesPart1: TLevelCourse[];
  tLevelCoursesPart2: TLevelCourse[];
  overflowOpen: boolean;
}

class ThirdStepD extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let tLevelCourses1 = [{
      icon: 'six-frame0',
      name: 'Agriculture, Environmental & Animal Care',
      subjects: [{ name: 'Agriculture, Land Management & Production' }, { name: 'Animal Care & Management' }],
    }, {
      icon: 'six-frame2',
      name: 'Creative & Design',
      subjects: [{ name: 'Craft & Design' }, { name: 'Media Broadcast & Production' }],
    }, {
      icon: 'six-frame3',
      name: 'Education and Early Years',
      subjects: [{ name: 'Education and Early Years' }],
    }, {
      icon: 'six-frame5',
      name: 'Legal, Finance & Accounting',
      subjects: [{ name: 'Accounting' }, { name: 'Finance' }, { name: 'Legal Services' }],
    }, {
      icon: 'six-frame6',
      name: 'Business & Administration',
      subjects: [{ name: 'Management and Administration' }],
    }];

    let tLevelCourses2 = [{
      icon: 'six-frame7',
      name: 'Construction',
      subjects: [
        { name: 'Building Services Engineering for Construction' },
        { name: 'Design, Surveying and Planning for Construction' },
        { name: 'Onsite Construction' }],
    }, {
      icon: 'six-frame8',
      name: 'Digital',
      subjects: [
        { name: 'Digital Business Services' },
        { name: 'Digital Production, Design and Development' },
        { name: 'Digital Support Services' }
      ],
    }, {
      icon: 'six-frame9',
      name: 'Engineering & Manufacturing',
      subjects: [
        { name: 'Design and Development for Engineering and Manufacturing' },
        { name: 'Maintenance, Installation and Repair for Engineering and Manufacturing' },
        { name: 'Engineering, Manufacturing, Processing and Control' }
      ],
    }, {
      icon: 'six-frame10',
      name: 'Health & Science',
      subjects: [{ name: 'Health' }, { name: 'Healthcare Science' }, { name: 'Science' }],
    }, {
      icon: 'six-frame11',
      name: 'Sales, Marketing & Procurement',
      subjects: [{ name: 'Marketing' }]
    }];

    let choice = null;
    if (props.answer) {
      if (props.answer.choice !== null) {
        choice = props.answer.choice;
      }

      if (props.answer.tLevelCoursesPart1 && props.answer.tLevelCoursesPart2) {
        tLevelCourses1 = props.answer.tLevelCoursesPart1;
        tLevelCourses2 = props.answer.tLevelCoursesPart2;
      }
    }

    this.state = {
      choice: choice,
      nothing: false,
      tLevelCoursesPart1: tLevelCourses1,
      tLevelCoursesPart2: tLevelCourses2,
      subStep: ThirdStepDSubStep.Start,
      overflowOpen: false,
    }
  }

  setChoice(choice: ThirdStepDChoice) {
    this.setState({ choice });
    this.props.onChange({
      choice: this.state.choice,
    });
  }

  getAnswer() {
    return {
      choice: this.state.choice,
      tLevelCoursesPart1: this.state.tLevelCoursesPart1,
      tLevelCoursesPart2: this.state.tLevelCoursesPart2
    }
  }

  saveAnswer() {
    this.props.saveAnswer(this.getAnswer());
  }

  addSelectedSubject(selected: any[], courses: TLevelCourse[]) {
    for (let course of courses) {
      for (let subject of course.subjects) {
        if (subject.checked) {
          selected.push(subject);
        }
      }
    }
  }

  toggleSubject(course: TLevelCourse, onChange: Function) {
    const checked = course.subjects.find(s => s.checked);
    if (!course.expanded) {
      course.expanded = !course.expanded;
      onChange();
    } else if (!checked) {
      course.expanded = !course.expanded;
      onChange();
    }
  }

  renderList(className: string, list: TLevelCourse[], onChange: Function) {
    return (
      <div>
        {list.map((course, i) => {
          return (
            <div key={i} className={"course-box-r-23 " + className}>
              <div className="font-16 clickable-box-r23 bold flex" onClick={() => this.toggleSubject(course, onChange)}>
                <div className="flex-center big-r-23">
                  <SpriteIcon name={course.icon} />
                </div>
                <div className="flex-y-center course-name-r23">
                  {course.name}
                </div>
                <div className="flex-center coursor-pointer">
                  <SpriteIcon name={course.expanded ? "arrow-up" : "arrow-down"} />
                </div>
              </div>
              {course.expanded && <div className="course-subjects-r23">
                {course.subjects.map((subject, r) =>
                  <div className="course-subject-r23" key={r} onClick={() => {
                    if (!subject.checked) {
                      let selected: any[] = [];
                      this.addSelectedSubject(selected, this.state.tLevelCoursesPart1);
                      this.addSelectedSubject(selected, this.state.tLevelCoursesPart2);
                      if (selected.length < 3) {
                        subject.checked = true;
                      } else {
                        this.setState({ overflowOpen: true });
                      }
                    } else {
                      subject.checked = false;
                    }
                    onChange();
                  }}>
                    {!isPhone() &&
                      <div className="flex-center">
                        <SpriteIcon name={subject.checked ? 'radio-btn-active' : 'radio-btn-blue'} />
                      </div>}
                    <div className={`flex-y-center text-container-r23 font-15 ${subject.checked ? 'active' : ''}`}>
                      {subject.name}
                    </div>
                  </div>)}
              </div>}
            </div>
          );
        })}
      </div>
    );
  }

  renderNextDButton() {
    let disabled = false;
    let className = 'absolute-contunue-btn font-24';
    if (this.state.choice === null) {
      disabled = true;
      className += ' disabled';
    }

    return (
      <NextButtonSix label="Continue" disabled={disabled} onClick={() => {
        this.saveAnswer();
        if (this.state.choice === ThirdStepDChoice.First) {
          this.setState({ subStep: ThirdStepDSubStep.TableLeaf });
        } else {
          this.props.moveNext();
        }
      }} />
    )
  }

  render() {
    if (this.state.subStep === ThirdStepDSubStep.TableLeaf) {
      let oneOrMore = this.state.tLevelCoursesPart1.some(course => course.subjects.some(s => s.checked)) || this.state.tLevelCoursesPart2.some(course => course.subjects.some(s => s.checked));

      if (isPhone()) {
        return (
          <div className="font-16 question-step-3d-tableleaf">
            <div className="relative">
              <img src="/images/choicesTool/phone/TLevel.png" className="third-step-img"></img>
            </div>
            <div className="bold font-23 question-text-3 margin-left-4">
              T-level Courses
            </div>
            <div className="margin-left-4">
              Below are the currently offered<br />
              T-level categories. Expand them<br />
              to view individual courses.<br />
              Select any that you would be interested in studying.
            </div>
            <div className="d3-table-scroll-container">
              <div className="d3-table-leaf">
                {this.renderList("first-b-r-23", this.state.tLevelCoursesPart1, () => {
                  this.setState({ tLevelCoursesPart1: [...this.state.tLevelCoursesPart1] })
                })}
                {this.renderList("second-b-r-23", this.state.tLevelCoursesPart2, () => {
                  this.setState({ tLevelCoursesPart2: [...this.state.tLevelCoursesPart2] })
                })}
              </div>
            </div>
            {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
              Oops! You’ve tried to pick too many.
              <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
            </Dialog>}
            <BackButtonSix onClick={() => this.setState({ subStep: ThirdStepDSubStep.Start })} />
            <NextButtonSix label={oneOrMore ? 'Continue' : 'Skip'} onClick={() => {
              this.saveAnswer();
              this.props.moveNext();
            }} />
          </div>
        );
      }

      return (
        <div className="font-16 question-step-3d-tableleaf">
          <img src="/images/choicesTool/ThirdStepR7.png" className="third-step-img"></img>
          <div className="bold font-32 question-text-3">
            T-level Courses
          </div>
          <div>
            Below are the currently offered T-level categories. Expand them to view individual courses. Select any<br />
            that you would be interested in studying.
          </div>
          <div className="d3-table-scroll-container">
            <div className="d3-table-leaf">
              {this.renderList("first-b-r-23", this.state.tLevelCoursesPart1, () => {
                this.setState({ tLevelCoursesPart1: [...this.state.tLevelCoursesPart1] })
              })}
              {this.renderList("second-b-r-23", this.state.tLevelCoursesPart2, () => {
                this.setState({ tLevelCoursesPart2: [...this.state.tLevelCoursesPart2] })
              })}
            </div>
          </div>
          {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
            Oops! You’ve tried to pick too many.
            <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
          </Dialog>}
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdStepDSubStep.Start })} />
          <NextButtonSix label={oneOrMore ? 'Continue' : 'Skip'} onClick={() => {
            this.saveAnswer();
            this.props.moveNext();
          }} />
        </div>
      );
    }

    if (isPhone()) {
      return (
        <div className="question-t-level1">
          <div className="relative">
            <img src="/images/choicesTool/phone/TLevel1.png" className="third-step-img third-step-img-r5"></img>
          </div>
          <div className="bold font-23 question-text-3 margin-left-4">
            Technical Levels (T-levels)
          </div>
          <div className="absolute-container-3d margin-left-4">
            <div className="font-16 text-container-t-r34">
              T-levels are new, two-year vocational courses worth three A-levels: you only take one, and they can’t be combined with other subjects. T-levels focus on the skills required for a particular sector or job. As part of the course, students undertake a work placement.
            </div>
            <div className="font-20 bold text-before-btns-r56">Would you be interested in knowing more about T-levels?</div>
            <div className="font-16">
              <ButtonR34
                currentChoice={ThirdStepDChoice.First} choice={this.state.choice}
                label="I’d be interested in taking a T-level." setChoice={choice => this.setChoice(choice)}
              />
              <ButtonR34
                currentChoice={ThirdStepDChoice.Second} choice={this.state.choice}
                label="I don’t think T-levels are right for me." setChoice={choice => this.setChoice(choice)}
              />
            </div>
          </div>
          <BackButtonSix onClick={() => this.props.moveBack(this.getAnswer())} />
          {this.renderNextDButton()}
        </div>
      );
    }

    return (
      <div>
        <div className="bold font-32 question-text-3">
          Technical Levels (T-levels)
        </div>
        <img src="/images/choicesTool/ThirdStepR5.png" className="third-step-img third-step-img-r5"></img>
        <div className="absolute-container-3d">
          <div className="font-16 line-d3">
            T-levels are new, two-year vocational courses worth three A-levels: you only take one, and<br />
            they can’t be combined with other subjects. T-levels focus on the skills required for a<br />
            particular sector or job. As part of the course, students undertake a work placement.
          </div>
          <div className="font-20 bold text-before-btns-r56">Would you be interested in knowing more about T-levels?</div>
          <div className="font-24">
            <ButtonR34
              currentChoice={ThirdStepDChoice.First} choice={this.state.choice}
              label="I’d be interested in taking a T-level." setChoice={choice => this.setChoice(choice)}
            />
            <ButtonR34
              currentChoice={ThirdStepDChoice.Second} choice={this.state.choice}
              label="I don’t think T-levels are right for me." setChoice={choice => this.setChoice(choice)}
            />
          </div>
        </div>
        <BackButtonSix onClick={() => this.props.moveBack(this.getAnswer())} />
        {this.renderNextDButton()}
      </div>
    );
  }
}

export default ThirdStepD;
