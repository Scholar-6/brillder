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
}

interface ThirdProps {
  subjects: SixthformSubject[];
  answer: any;
  onChange(answer: any): void;
  moveBack(): void;
  moveToStepE(): void;
  moveToStepF(): void;
}

interface TLevelCourse {
  icon: string;
  name: string;
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
      icon: '',
      name: 'Agricultural, Environmental & Animal Care',
      subjects: [{ name: 'Agriculture, Land Management & Production' }, { name: 'Animal Care & Management' }],
    }, {
      icon: '',
      name: 'Catering & Hospitality',
      subjects: [{ name: 'Catering' }],
    }, {
      icon: '',
      name: 'Creative & Design',
      subjects: [{ name: 'Craft & Design' }, { name: 'Media Broadcast & Production' }],
    }, {
      icon: '',
      name: 'Education and Early Years',
      subjects: [{ name: 'Education and Early Years' }],
    }, {
      icon: '',
      name: 'Hair & Beauty',
      subjects: [{ name: 'Hairdressing, Barbering and Beauty Therapy' }],
    }, {
      icon: '',
      name: 'Legal, Finance & Accounting',
      subjects: [{ name: 'Accounting' }, { name: 'Finance' }, { name: 'Legal Services' }],
    }];

    let tLevelCourses2 = [{
      icon: '',
      name: 'Business & Administration',
      subjects: [{ name: 'Management and Administration' }],
    }, {
      icon: '',
      name: 'Construction',
      subjects: [
        { name: 'Building Services Engineering for Construction' },
        { name: 'Design, Surveying and Planning for Construction' },
        { name: 'Onsite Construction' }],
    }, {
      icon: '',
      name: 'Digital',
      subjects: [
        { name: 'Digital Business Services' },
        { name: 'Digital Production, Design and Development' },
        { name: 'Digital Support Services' }
      ],
    }, {
      icon: '',
      name: 'Engineering & Manufacturing',
      subjects: [
        { name: 'Design and Development for Engineering and Manufacturing' },
        { name: 'Maintenance, Installation and Repair for Engineering and Manufacturing' },
        { name: 'Engineering, Manufacturing, Processing and Control' }
      ],
    }, {
      icon: '',
      name: 'Health & Science',
      subjects: [{ name: 'Health' }, { name: 'Healthcare Science' }, { name: 'Science' }],
    }, {
      icon: '',
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
    this.props.onChange({
      choice: choice
    });
  }

  render() {
    if (this.state.subStep === ThirdStepDSubStep.TableLeaf) {
      return (
        <div>
          Here is a list of current T-level courses. Which courses interest you? If only ONE course which interests you, select it. But Select no more than THREE courses.
          <div className="d3-table-leaf">
            <div>
              {this.state.tLevelCoursesPart1.map((course, i) => {
                return (
                  <div key={i} className="course-box-r-23">
                    <div className="font-16 bold">
                      <SpriteIcon name={course.icon} />
                      {course.name}
                      <SpriteIcon name="arrow-down" />
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              {this.state.tLevelCoursesPart2.map((course, i) => {
                return (
                  <div key={i} className="course-box-r-23">
                    <div className="font-16 bold">
                      <SpriteIcon name={course.icon} />
                      {course.name}
                      <SpriteIcon name="arrow-down" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
