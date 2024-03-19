import React, { Component } from "react";
import { SixthformSubject } from "services/axios/sixthformChoices";
import CheckBoxV2 from "../CheckBox";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Dialog } from "@material-ui/core";

export enum ThirdStepDChoice {
  First,
  Second,
  Third,
  Forth
}

export enum ThirdStepDSubStep {
  Start = 1,
  Message,
  TableLeaf,
  LastStep
}

interface ThirdProps {
  subjects: SixthformSubject[];
  answer: any;
  onChange(answer: any): void;
  saveAnswer(answer: any): void;
  moveBack(answer: any): void;
  moveToStepE(): void;
  moveToStepF(): void;
  moveToStep4(): void;
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
    }, /*{
      icon: 'six-frame1',
      name: 'Catering & Hospitality',
      subjects: [{ name: 'Catering' }],
    },*/ {
      icon: 'six-frame2',
      name: 'Creative & Design',
      subjects: [{ name: 'Craft & Design' }, { name: 'Media Broadcast & Production' }],
    }, {
      icon: 'six-frame3',
      name: 'Education and Early Years',
      subjects: [{ name: 'Education and Early Years' }],
    }, /*{
      icon: 'six-frame4',
      name: 'Hair & Beauty',
      subjects: [{ name: 'Hairdressing, Barbering and Beauty Therapy' }],
    },*/ {
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
      overflowOpen: false
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

  renderList(className: string, list: TLevelCourse[], onChange: Function) {
    return (
      <div>
        {list.map((course, i) => {
          return (
            <div key={i} className={"course-box-r-23 " + className}>
              <div className="font-16 bold flex">
                <div className="flex-center big-r-23">
                  <SpriteIcon name={course.icon} />
                </div>
                <div className="flex-y-center course-name-r23">
                  {course.name}
                </div>
                <div className="flex-center coursor-pointer" onClick={() => {
                  const checked = course.subjects.find(s => s.checked);

                  if (!course.expanded) {
                    course.expanded = !course.expanded;
                    onChange();
                  } else if (!checked) {
                    course.expanded = !course.expanded;
                    onChange();
                  }
                }}>
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
                    <div className="flex-center">
                      <SpriteIcon name={subject.checked ? 'radio-btn-active' : 'radio-btn-blue'} />
                    </div>
                    <div className="flex-y-center text-container-r23 font-15">
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
      <button className={className} disabled={disabled} onClick={() => {
        if (this.state.choice === ThirdStepDChoice.Forth) {
          this.setState({ subStep: ThirdStepDSubStep.Message });
        } else if (this.state.choice === ThirdStepDChoice.First) {
          this.setState({ subStep: ThirdStepDSubStep.TableLeaf });
        } else {
          this.saveAnswer();
          this.props.moveToStepF();
        }
      }}>Continue</button>
    )
  }

  render() {
    if (this.state.subStep === ThirdStepDSubStep.LastStep) {
      return (
        <div className="font-16 question-3d-r8-r1">
          <img src="/images/choicesTool/ThirdStepR8.png" className="third-step-img-r8"></img>
          <div className="question-3d-r8 font-20">
            <div>
              <div className="flex-center top-label-r3-r23 bold">
                Would you like to see other Vocational, Applied and Practical courses?
              </div>
              <div className="flex-center">
                <div className="button-step-d-r23 button-step-dl4-r23">
                  <div onClick={() => this.props.moveToStepE()}>
                    Yes, I would.
                  </div>
                </div>
              </div>
              <div className="flex-center">
                <div className="button-step-d-r23 button-step-dl4-r23">
                  <div onClick={() => this.props.moveToStep4()}>
                    No - if I do a vocational course, it’ll be a T-level.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdStepDSubStep.TableLeaf })} />
        </div>
      );
    } else if (this.state.subStep === ThirdStepDSubStep.TableLeaf) {
      return (
        <div className="font-16 question-step-3d-tableleaf">
          <img src="/images/choicesTool/ThirdStepR7.png" className="third-step-img"></img>
          <div className="bold font-32 question-text-3">
            T-level Courses
          </div>
          <div>
            These are the different T-level categories. Expand them to view different courses.<br />
            Which interest you? Select up to three courses.
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
            <div className="course-box-r-23 big-b-r-23" onClick={() => {
              // nothing
              this.state.tLevelCoursesPart1.forEach(t => {
                t.expanded = false;
                t.subjects.map(s => s.checked = false);
              });
              this.state.tLevelCoursesPart2.forEach(t => {
                t.expanded = false;
                t.subjects.map(s => s.checked = false);
              });
              this.setState({ tLevelCoursesPart1: this.state.tLevelCoursesPart1, tLevelCoursesPart2: this.state.tLevelCoursesPart2});
            }}>
              <div className="font-16 bold flex">
                <div className="flex-center nothing-hint">
                  Not sure. None of these really interests me.
                </div>
              </div>
            </div>
          </div>
          {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
            Oops! You’ve tried to pick too many.
            <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
          </Dialog>}
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdStepDSubStep.Start })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: ThirdStepDSubStep.LastStep });
            this.saveAnswer();
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === ThirdStepDSubStep.Message) {
      return <div className="question-3d-r6">
        <div className="font-20 bold text-center text-d3-r23">
          In that case, we’ll show you T-levels, and then we’ll show you other vocational courses.
        </div>
        <img src="/images/choicesTool/ThirdStepR6.png" className="image-container-r6"></img>
        <div className="button-step-d-r23 font-24">
          <div onClick={() => {
            this.setState({ subStep: ThirdStepDSubStep.TableLeaf })
          }}>
            OK then, let’s have a look.
          </div>
        </div>
        <BackButtonSix onClick={() => this.setState({ subStep: ThirdStepDSubStep.Start })} />
      </div>
    }
    return (
      <div>
        <div className="bold font-32 question-text-3">
          T-levels
        </div>
        <img src="/images/choicesTool/ThirdStepR5.png" className="third-step-img third-step-img-r5"></img>
        <div className="absolute-container-3d">
          <div className="font-16 line-d3">
            These are the new two-year vocational courses worth three A-levels: you only take one, and they can’t be combined with other subjects.
          </div>
          <div className="font-16 line-d3">
            T-levels focus on the skills required for a particular sector or job. As part of the course, students undertake a work placement.
          </div>
          <div className="font-16 bold sub-title-e23">
            Which of the following best applies to you?
          </div>
          <div className="boxes-container font-24">
            <CheckBoxV2
              currentChoice={ThirdStepDChoice.First} choice={this.state.choice}
              label="If the right T-level is available, I’d be interested." setChoice={choice => this.setChoice(choice)}
            />
            <CheckBoxV2
              currentChoice={ThirdStepDChoice.Second} choice={this.state.choice}
              label="I’d prefer to do a combination of shorter vocational courses." setChoice={choice => this.setChoice(choice)}
            />
            <CheckBoxV2
              currentChoice={ThirdStepDChoice.Third} choice={this.state.choice}
              label="I’d prefer to do a mixture of vocational courses and A-levels." setChoice={choice => this.setChoice(choice)}
            />
            <CheckBoxV2
              currentChoice={ThirdStepDChoice.Forth} choice={this.state.choice}
              label="I’m not really sure yet."
              setChoice={() => this.setState({ choice: ThirdStepDChoice.Forth })}
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
