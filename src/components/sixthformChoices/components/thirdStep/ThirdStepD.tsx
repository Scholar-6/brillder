import React, { Component } from "react";
import { SixthformSubject } from "services/axios/sixthformChoices";
import CheckBoxV2 from "../CheckBox";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";

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
  moveBack(): void;
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
  tLevelCoursesPart1: TLevelCourse[];
  tLevelCoursesPart2: TLevelCourse[];
}

class ThirdStepD extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let tLevelCourses1 = [{
      icon: 'six-frame0',
      name: 'Agricultural, Environmental & Animal Care',
      subjects: [{ name: 'Agriculture, Land Management & Production' }, { name: 'Animal Care & Management' }],
    }, {
      icon: 'six-frame1',
      name: 'Catering & Hospitality',
      subjects: [{ name: 'Catering' }],
    }, {
      icon: 'six-frame2',
      name: 'Creative & Design',
      subjects: [{ name: 'Craft & Design' }, { name: 'Media Broadcast & Production' }],
    }, {
      icon: 'six-frame3',
      name: 'Education and Early Years',
      subjects: [{ name: 'Education and Early Years' }],
    }, {
      icon: 'six-frame4',
      name: 'Hair & Beauty',
      subjects: [{ name: 'Hairdressing, Barbering and Beauty Therapy' }],
    }, {
      icon: 'six-frame5',
      name: 'Legal, Finance & Accounting',
      subjects: [{ name: 'Accounting' }, { name: 'Finance' }, { name: 'Legal Services' }],
    }];

    let tLevelCourses2 = [{
      icon: 'six-frame6',
      name: 'Business & Administration',
      subjects: [{ name: 'Management and Administration' }],
    }, {
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

    this.state = {
      choice: null,
      tLevelCoursesPart1: tLevelCourses1,
      tLevelCoursesPart2: tLevelCourses2,
      subStep: ThirdStepDSubStep.Start
    }
  }

  setChoice(choice: ThirdStepDChoice) {
    this.setState({ choice });
    this.props.onChange({ choice: choice });
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
                  course.expanded = !course.expanded;
                  onChange();
                  this.setState({ tLevelCoursesPart1: [...this.state.tLevelCoursesPart1] })
                }}>
                  <SpriteIcon name={course.expanded ? "arrow-up" : "arrow-down"} />
                </div>
              </div>
              {course.expanded && <div className="course-subjects-r23">
                {course.subjects.map((subject, i) =>
                  <div className="course-subject-r23" onClick={() => {
                    subject.checked = !subject.checked;
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

  render() {
    if (this.state.subStep === ThirdStepDSubStep.LastStep) {
      return (
        <div className="font-16">
          <div className="bold font-32 question-text-3">
            T Levels
          </div>
          <div className="flex-center top-label-r3-r23 bold">
            Awesome! How would you like to proceed?
          </div>
          <div className="d3-table-scroll-container">
            <div className="button-step-d-r23 button-step-dl4-r23">
              <div onClick={() => this.props.moveToStepE()}>
                Now show me other Vocational, Applied and Practical Courses which are not T-levels.
              </div>
            </div>
            <div className="button-step-d-r23 button-step-dl4-r23">
              <div onClick={() => this.props.moveToStep4()}>
                I’m only interested in T-levels - show me the next step.
              </div>
            </div>
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdStepDSubStep.Start })} />
        </div>
      );
    } else if (this.state.subStep === ThirdStepDSubStep.TableLeaf) {
      return (
        <div className="font-16">
          <div className="bold font-32 question-text-3">
            T Levels
          </div>
          <div>
            Here is a list of current T-level courses. Which courses interest you? If only ONE course which interests you, select it. But Select no more than THREE courses.
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
            <div className="course-box-r-23 big-b-r-23">
              <div className="font-16 bold flex">
                <div className="flex-y-center bold">
                  NOTHING
                </div>
                <div className="flex-center nothing-hint">
                  I like the idea of T-levels but none of these courses really interest me.
                </div>
              </div>
            </div>
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: ThirdStepDSubStep.Start })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: ThirdStepDSubStep.LastStep });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === ThirdStepDSubStep.Message) {
      return <div>
        <div className="bold font-32 question-text-3">
          T Levels
        </div>
        <div className="font-20 bold text-center text-d3-r23">
          Well, we’ll show you the T-level courses, then we’ll show you other VAPs. If you give some thought to your preferences, you’ll still get closer to an idea of what might suit you in the sixth form.
        </div>
        <div className="button-step-d-r23">
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
          T Levels
        </div>
        <div className="font-16">
          A lot of changes are happening within vocational education. For 16-19 year-olds there will be a steady reduction in the availability of BTEC and Diploma courses in Vocational, Applied & Practical subjects (VAPs), and a rapid rolling out of T-levels.
        </div>
        <div className="font-16">
          T-levels focus on the skills required for a particular job. You can only take one. Each T-level requires a time commitment equivalent to 3 A-levels: it’s a fully immersive experience designed to get you ready for the workplace. Doing a T-level therefore requires you to be clear in your own mind that you want to pursue the field you choose as a profession.
        </div>
        <div className="font-16 bold sub-title-e23">
          Which of the following best applies to you?
        </div>
        <div className="boxes-container font-24">
          <CheckBoxV2
            currentChoice={ThirdStepDChoice.First} choice={this.state.choice}
            label="If the right T-level for me is available, I’d be interested." setChoice={choice => this.setChoice(choice)}
          />
          <CheckBoxV2
            currentChoice={ThirdStepDChoice.Second} choice={this.state.choice}
            label="I’d prefer to do a variety of shorter VAP courses if they were available." setChoice={choice => this.setChoice(choice)}
          />
          <CheckBoxV2
            currentChoice={ThirdStepDChoice.Third} choice={this.state.choice}
            label="I’d consider a mix of shorter VAPs and A-levels rather than a T-level." setChoice={choice => this.setChoice(choice)}
          />
          <CheckBoxV2
            currentChoice={ThirdStepDChoice.Forth} choice={this.state.choice}
            label="I’m really not sure what to do yet."
            setChoice={() => this.setState({ choice: ThirdStepDChoice.Forth })}
          />
        </div>
        <BackButtonSix onClick={this.props.moveBack} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          if (this.state.choice === ThirdStepDChoice.Forth) {
            this.setState({ subStep: ThirdStepDSubStep.Message });
          } else if (this.state.choice === ThirdStepDChoice.First) {
            this.setState({ subStep: ThirdStepDSubStep.TableLeaf });
          } else {
            this.props.moveToStepF();
          }
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdStepD;
