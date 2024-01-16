import React, { Component } from "react";
import { SixthformSubject } from "services/axios/sixthformChoices";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export enum ThirdStepDSubStep {
  Start = 1,
  Message,
  TableLeaf,
  LastStep
}

interface ThirdProps {
  subjects: SixthformSubject[];
  answer: any;
  moveBack(): void;
  moveToStep4(answer: any): void;
}

interface TLevelCourse {
  icon: string;
  name: string;
  expanded?: boolean;
  subjects: any[];
}

interface ThirdQuestionState {
  tLevelCoursesPart1: TLevelCourse[];
  tLevelCoursesPart2: TLevelCourse[];
}

class ThirdStepF extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let tLevelCourses1 = [{
      icon: 'six-frame12',
      name: 'Maths & English',
      subjects: [
        { name: 'Applied Maths (Core & Certificate)' },
        { name: 'ESOL (English for Speakers of Other Languages)' }
      ],
    }, {
      icon: 'six-frame9',
      name: 'Engineering & Maintenance',
      subjects: [
        { name: 'Engineering' },
        { name: 'Mechanical Engineering' },
        { name: 'Electrical and Electronic Engineering' },
        { name: 'Manufacturing Engineering' },
        { name: 'Motor Vehicle Maintenance' },
      ],
    }, {
      icon: 'six-frame6',
      name: 'Business',
      subjects: [
        { name: 'Applied Business' },
        { name: 'Marketing' },
        { name: 'Enterprise & Entrepreneurship' },
        { name: 'Accounting & Bookkeeping' },
      ],
    }, {
      icon: 'six-frame13',
      name: 'Music & Performing Arts',
      subjects: [
        { name: 'Digital Music Production' },
        { name: 'Dance' },
        { name: 'Performing Arts (Acting)' },
        { name: 'Musical Theatre' },
        { name: 'Music Performance'},
        { name: 'Music' },
        { name: 'Production Arts' },
      ],
    }, {
      icon: 'six-frame8',
      name: 'IT, Digital & Media',
      subjects: [
        { name: 'Information Technology' },
        { name: 'Creative Media / Digital Media Production' },
        { name: 'Computing' },
        { name: 'eSports & Computer Games' },
      ],
    }, {
      icon: 'six-frame7',
      name: 'Built Environment',
      subjects: [
        { name: 'Construction & Built Environment ' },
        { name: 'Electrical Installation' },
        { name: 'Plumbing' },
        { name: 'Brickwork' },
        { name: 'Plastering' },
        { name: 'Carpentry' },
      ]
    }, {
      icon: 'six-frame13',
      name: 'Hospitality & Catering',
      subjects: [
        { name: 'Culinary Arts' },
      ]
    }]
    let tLevelCourses2 = [{
      icon: 'six-frame19',
      name: 'Science & Engineering',
      subjects: [
        { name: 'Food Science & Nutrition' },
        { name: 'Applied Psychology' },
        { name: 'Medical Science' },
        { name: 'Applied Human Biology' },
        { name: 'Applied Science' },
        { name: 'Forensic Science' },
      ],
    }, {
      icon: 'six-frame18',
      name: 'Law, Crime & Uniformed Services',
      subjects: [
        { name: 'Criminology' },
        { name: 'Uniformed Services' },
        { name: 'Applied Law' },
        { name: 'Pre-cadetship for Merchant Navy' },
      ],
    }, {
      icon: 'six-frame17',
      name: 'Care',
      subjects: [
        { name: 'Childcare & Child Development (Education & Early Years)' },
        { name: 'Health & Social Care' }
      ],
    }, {
      icon: 'six-frame2',
      name: 'Art & Design',
      subjects: [
        { name: 'Art & Design (Photography)' },
        { name: 'Art & Design' },
      ]
    }, {
      icon: 'six-frame16',
      name: 'Sport, Leisure & Wellbeing',
      subjects: [
        { name: 'Sport & Exercise Science' },
        { name: 'Beauty' },
        { name: 'Sporting Excellence' },
        { name: 'Hairdressing' },
        { name: 'Personal Training & Instruction' },
        { name: 'Travel & Tourism' },
      ]
    }, {
      icon: 'six-frame15',
      name: 'Land & Animal Management',
      subjects: [
        { name: 'Agriculture' },
        { name: 'Land & Countryside Management' },
        { name: 'Horticulture' },
        { name: 'Animal Care & Management' },
        { name: 'Forestry' },
        { name: 'Sustainability' },
      ]
    }];

    this.state = {
      tLevelCoursesPart1: tLevelCourses1,
      tLevelCoursesPart2: tLevelCourses2,
    }
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
                    if (!subject.checked) {
                      let selected: any[] = [];
                      this.addSelectedSubject(selected, this.state.tLevelCoursesPart1);
                      this.addSelectedSubject(selected, this.state.tLevelCoursesPart2);
                      if (selected.length < 5) {
                        subject.checked = true;
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

  render() {
    return (
      <div className="font-16">
        <div className="bold font-32 question-text-3">
          Vocational, Applied and Practical Courses other than T-levels
        </div>
        <div className="font-16">
          Click on any of the fourteen categories to reveal more than fifty course options. Select a maximum of five courses which interest you (you won’t be able to do them all).
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
        <BackButtonSix onClick={() => this.props.moveBack()} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          console.log('move next 3')
          this.props.moveToStep4({
            tLevelCoursesPart1: this.state.tLevelCoursesPart1,
            tLevelCoursesPart2: this.state.tLevelCoursesPart2
          });
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdStepF;
