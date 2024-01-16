import React, { Component } from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { SixthformSubject } from "services/axios/sixthformChoices";
import CheckBoxV2 from "./CheckBox";
import BackButtonSix from "./BackButtonSix";
import { FirstChoice } from "./FirstStep";
import CheckBoxB from "./CheckBoxB";

enum SubStep {
  sub4a,
  sub4b,
  sub4c,
  sub4d1,
  sub4d2,
  sub4e1,
  sub4e2,
}

enum Category {
  Stem = 1,
  Science,
  Humanities,
  Languages,
  Arts,
  Vocational
}

interface TLevelCourse {
  icon: string;
  name: string;
  active: boolean;
  expanded?: boolean;
  subjects: any[];
}

interface ThirdProps {
  firstAnswer: any;
  answer: any;
  subjects: SixthformSubject[];
  moveNext(answer: any): void;
  moveBack(): void;
  saveAnswer(answer: any): void;
}

interface ThirdQuestionState {
  subStep: SubStep;
  cetegoriesData: any[];
  categories4bc: Category[];
  hoveredCategory: number;
  facilitatingSubjects: any[];
  nonFacilitatingSubjects: any[];

  tVocCoursesE1Part1: TLevelCourse[];
  tVocCoursesE1Part2: TLevelCourse[];
}

class FourthStep extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let data = [{
      name: "none",
      subjects: []
    }, {
      name: "Traditional STEM degrees",
      description: "For many science courses there is an expectation that you will have done A-level Maths.",
      subjects: [{
        name: "Chemistry",
        selected: false,
      }, {
        name: "Mathematics",
        selected: false,
      }, {
        name: "Engineering",
        selected: false,
      }, {
        name: "Biology",
        selected: false,
      }, {
        name: "Physics",
        selected: false,
      }, {
        name: "Medicine (Human and Veterinary)",
        selected: false,
      }, {
        name: "Computer Science",
        selected: false,
      }, {
        name: "Geology",
        selected: false,
      }]
    }, {
      name: "Interdisciplinary Sciences",
      description: "Some subjects fuse scientific or statistical method with aspects of Humanities and/or Arts",
      subjects: [{
        name: "Economics",
        selected: false,
      }, {
        name: "Geography",
        selected: false,
      }, {
        name: "Psychology",
        selected: false,
      }, {
        name: "Environmental Sciences",
        selected: false,
      }, {
        name: "Sociology",
        selected: false,
      }, {
        name: "Architecture",
        selected: false,
      }]
    }, {
      name: "Traditional Humanities",
      subjects: [{
        name: "History",
        selected: false,
      }, {
        name: "Politics",
        selected: false,
      }, {
        name: "Religion, Philosophy & Ethics",
        selected: false,
      }, {
        name: "Law",
        selected: false,
      }, {
        name: "English Literature",
        selected: false,
      }]
    }, {
      name: "Languages & Cultures",
      subjects: [{
        name: "Modern European Languages (French, Spanish etc.)",
        selected: false,
      }, {
        name: "Linguistics",
        selected: false,
      }, {
        name: "Eastern and Oriental Languages (Arabic, Mandarin, Japanese etc.)",
        selected: false,
      }, {
        name: "Classical Languages like Latin (also, Classical Civilisation / Archaeology)",
        selected: false,
      }]
    }, {
      name: "Arts",
      subjects: [{
        name: "Performing Arts",
        selected: false,
      }, {
        name: "Art & Design (Photography)",
        selected: false,
      }, {
        name: "Dance",
        selected: false,
      }, {
        name: "Fine Art",
        selected: false,
      }, {
        name: "Photography",
        selected: false,
      }, {
        name: "Film & Media",
        selected: false,
      }, {
        name: "Design",
        selected: false,
      }, {
        name: "Music",
        selected: false,
      }]
    }, {
      name: "Vocational & Commercial",
      subjects: [{
        name: "Business & Management",
        selected: false,
      }, {
        name: "Journalism",
        selected: false,
      }, {
        name: "Retail",
        selected: false,
      }, {
        name: "Marketing, Advertising & PR",
        selected: false,
      }]
    }]

    let facilitatingSubjects = [{
      name: "Maths",
      selected: false,
    }, {
      name: "Further Maths",
      selected: false,
    }, {
      name: "Physics",
      selected: false,
    }, {
      name: "Biology",
      selected: false,
    }, {
      name: "Chemistry",
      selected: false,
    }, {
      name: "Geography",
      selected: false,
    }, {
      name: "History",
      selected: false,
    }, {
      name: "French",
      selected: false,
    }, {
      name: "German",
      selected: false,
    }, {
      name: "Spanish",
      selected: false,
    }, {
      name: "Other Modern Language",
      selected: false,
    }, {
      name: "Latin",
      selected: false,
    }, {
      name: "Ancient Greek",
      selected: false,
    }]

    let nonFacilitatingSubjects = [{
      name: "Sociology",
      selected: false,
    }, {
      name: "Psychology",
      selected: false,
    }, {
      name: "Media Studies",
      selected: false,
    }, {
      name: "Criminology",
      selected: false,
    }, {
      name: "Law",
      selected: false,
    }, {
      name: "Accounting",
      selected: false,
    }, {
      name: "Art and Design",
      selected: false,
    }, {
      name: "Business Studies",
      selected: false,
    }, {
      name: "Communication Studies",
      selected: false,
    }, {
      name: "Design and Technology",
      selected: false,
    }, {
      name: "Drama and Theatre Studies",
      selected: false,
    }, {
      name: "Music",
      selected: false,
    }, {
      name: "Music Technology",
      selected: false,
    }, {
      name: "Sports Studies",
      selected: false,
    }, {
      name: "Travel and Tourism",
      selected: false,
    }, {
      name: "English Language",
      selected: false,
    }]

    let tVocCoursesE1Part1 = [{
      icon: 'six-frame2',
      name: 'Design, Craftsmanship & Visual Arts',
      active: false,
      subjects: [
        { name: 'Photography' },
        { name: 'Jewellery & Silversmithing' },
        { name: 'Furniture Design & Build' },
        { name: 'Fashion & Textiles' },
        { name: 'Fashion Design and Production' },
        { name: 'Fine Art' },
        { name: 'Interior Design' }
      ],
    }, {
      icon: 'six-frame23',
      name: 'Catering, Travel & Hospitality',
      active: false,
      subjects: [
        { name: 'Professional Cookery' },
        { name: 'Food Industry Management' },
        { name: 'International Travel & Tourism' },
        { name: 'Hospitality Management' },
      ],
    }, {
      icon: 'six-frame9',
      name: 'Engineering',
      active: false,
      subjects: [
        { name: 'Electrical & Electronic' },
        { name: 'Mechanical' },
        { name: 'Manufacturing' },
        { name: 'Aeronautical' },
        { name: 'Automotive' },
        { name: 'Nuclear' },
        { name: 'Rail' },
        { name: 'Space Technologies' },
        { name: 'Mechatronics' },
      ],
    }, {
      icon: 'six-frame8',
      name: 'Computing',
      active: false,
      subjects: [
        { name: 'Computing' },
        { name: 'Computing & Systems Development' },
        { name: 'Business Computing (Web Design)' },
        { name: 'Software Engineering' },
        { name: 'Web Technology & Security' },
        { name: 'Cloud Computing' },
      ],
    }, {
      icon: 'six-frame24',
      name: 'Creative Digital Media',
      active: false,
      subjects: [
        { name: 'Computer Generated Animation' },
        { name: 'Graphic and Digital Design' },
        { name: 'Games Design' },
        { name: 'Creative Media Production' },
        { name: 'Film & Television' },
        { name: 'Sound & Media' },
        { name: 'Visual Effects' },
      ],
    }, {
      icon: 'six-frame6',
      name: 'Business & Management',
      active: false,
      subjects: [
        { name: 'Business' },
        { name: 'Business & Law' },
        { name: 'Business & Accounting' },
        { name: 'Business & Marketing' },
        { name: 'Business and Management' },
        { name: 'Leadership & Management' },
      ],
    }, {
      icon: 'six-frame15',
      name: 'Land-based Sector Studies',
      active: false,
      subjects: [
        { name: 'Animal Welfare and Management' },
        { name: 'Arboriculture' },
        { name: 'Horticulture' },
        { name: 'Landscape Management' },
        { name: 'Agricultural Science' },
        { name: 'Applied Bioscience' },
        { name: 'LegAnimal Careal' },
        { name: 'Countryside Management' },
        { name: 'Equine Studies' },
        { name: 'Garden Design' },
        { name: 'Green Technology' },
        { name: 'Wildlife Conservation' },
        { name: 'Agriculture' },
        { name: 'Veterinary Technician' },
      ],
    }, {
      icon: 'six-frame16',
      name: 'Sport & Exercise',
      active: false,
      subjects: [
        { name: 'Coaching and Developing Sport' },
        { name: 'Sport and Exercise Science' },
        { name: 'Sports Therapy' },
        { name: 'Community Coaching' }
      ],
    }];

    let tVocCoursesE1Part2 = [{
      icon: 'six-frame7',
      name: 'Construction',
      active: false,
      subjects: [
        { name: 'Building Services Engineering' },
        { name: 'Electrical Installation' },
        { name: 'Construction Management' },
        { name: 'Civil Engineering' },
        { name: 'Construction & Built Environment' },
        { name: 'Architectural Design & Technology' },
        { name: 'Future Homes Design & Construction' },
        { name: 'Quantity Surveying' },
      ],
    }, {
      icon: 'six-frame3',
      name: 'Education',
      active: false,
      subjects: [
        { name: 'Early Years Education' },
        { name: 'Primary Education & Teaching' },
      ]
    }, {
      icon: 'six-frame4',
      name: 'Hair & Beauty',
      active: false,
      subjects: [
        { name: 'Beauty' },
        { name: 'Hairdressing' },
      ],
    }, {
      icon: 'six-frame17',
      active: false,
      name: 'Health, Care & Social Services',
      subjects: [
        { name: 'Work with Children and Families' },
        { name: 'Care Practice' },
        { name: 'Applied Biology' },
        { name: 'Forensic Science' },
        { name: 'Nursing' },
        { name: 'Public & Emergency Services' },
        { name: 'Counselling & Applied Psychology' },
        { name: 'Social & Community Work' },
        { name: 'Healthcare Practice' },
        { name: 'Policing' },
      ],
    }, {
      icon: 'six-frame11',
      active: false,
      name: 'Media & Communications',
      subjects: [{ name: 'Electronics & Communications' }, { name: 'Journalism' }],
    }, {
      icon: 'six-frame21',
      active: false,
      name: 'Performing Arts',
      subjects: [
        { name: 'Dance Performance' },
        { name: 'Creative Production Arts' },
        { name: 'Media make up' },
        { name: 'Acting' },
        { name: 'Musical Theatre' },
        { name: 'Music' },
      ]
    }, {
      icon: 'six-frame20',
      active: false,
      name: 'Retail & Distribution Industry',
      subjects: [
        { name: 'Retail Management' },
        { name: 'Retail and Sales' },
        { name: 'Supply Chain Management' },
        { name: 'Vehicle Operations Management' },
        { name: 'Logistics and Transport' },
      ]
    }];

    this.state = {
      categories4bc: [],
      cetegoriesData: data,
      facilitatingSubjects,
      nonFacilitatingSubjects,
      hoveredCategory: -1,
      subStep: SubStep.sub4a,

      tVocCoursesE1Part1,
      tVocCoursesE1Part2,
    }
  }

  saveAnswer() {
    const { categories4bc } = this.state;
    const categories4c:any[] = [];
    for (let category4b of categories4bc) {
      const category = this.state.cetegoriesData[category4b];
      categories4c.push(category);
    }
    const answer = { categories4bc: categories4bc, categories4c };
    this.props.saveAnswer(answer);
  }

  renderNextBtn() {
    let disabled = false;
    return (
      <button className={`absolute-contunue-btn font-24 ${disabled ? 'disabled' : ''}`} onClick={() => {
        this.props.moveNext({});
      }}>Continue</button>
    )
  }

  leaveCategory() {
    this.setState({ hoveredCategory: -1 })
  }

  selectCategory(category: Category) {
    let { categories4bc } = this.state;
    if (categories4bc.includes(category)) {
      categories4bc = categories4bc.filter(c => c !== category);
    } else {
      if (categories4bc.length < 3) {
        categories4bc.push(category);
      }
    }
    this.setState({ categories4bc });
  }

  renderStemCategory() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Stem);
    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Stem) {
      return (
        <div
          className={className + " hovered-category"}
          onMouseEnter={() => this.setState({ hoveredCategory: Category.Stem })}
          onMouseLeave={this.leaveCategory.bind(this)}
          onClick={() => this.selectCategory(Category.Stem)}
        >
          <div className="bold font-16 h-title-r24">Traditional STEM degrees</div>
          <div className="font-14">
            For many science courses there is an expectation that you will have done <br /> A-level Maths.
          </div>
          <div className="lozengies-container font-11 first-lozengies">
            <div>Chemistry</div>
            <div>Mathematics</div>
            <div>Engineering</div>
            <div>Biology</div>
            <div>Physics</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Medicine (Human and Veterinary)</div>
            <div>Computer Science</div>
            <div>Geology</div>
          </div>
        </div>
      );
    }
    return (<div
      className={className + " flex-center"}
      onMouseEnter={() => this.setState({ hoveredCategory: Category.Stem })}
      onMouseLeave={this.leaveCategory.bind(this)}
      onClick={() => this.selectCategory(Category.Stem)}
    >
      <div className="flex-center">
        <SpriteIcon name="stem-icon" />
      </div>
      <div className="bold">
        Traditional STEM degrees
      </div>
    </div>
    );
  }

  renderScienceCategory() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Science);

    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Science) {
      className += " start-f-r24";
    }

    if (this.state.hoveredCategory === Category.Science) {
      return (
        <div
          className={className + " hovered-category"}
          onMouseEnter={() => this.setState({ hoveredCategory: Category.Science })}
          onMouseLeave={this.leaveCategory.bind(this)}
          onClick={() => this.selectCategory(Category.Science)}
        >
          <div className="bold font-16 h-title-r24">Interdisciplinary Sciences</div>
          <div className="font-14">
            Some subjects fuse scientific or statistical method with aspects of<br /> Humanities
          </div>
          <div className="lozengies-container font-11 first-lozengies">
            <div>Economics</div>
            <div>Geography</div>
            <div>Psychology</div>
            <div>Environmental Sciences</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Sociology</div>
            <div>Architecture</div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={className + " flex-center"}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Science })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Science)}
      >
        <div className="flex-center">
          <SpriteIcon name="science-icon" />
        </div>
        <div className="bold">Interdisciplinary Sciences</div>
      </div>
    );
  }

  renderHumanityCategory() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Humanities);

    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Humanities) {
      className += " start-f-r24";
    }

    if (this.state.hoveredCategory === Category.Humanities) {
      return (
        <div
          className={className + " hovered-category"}
          onMouseEnter={() => this.setState({ hoveredCategory: Category.Humanities })}
          onMouseLeave={this.leaveCategory.bind(this)}
          onClick={() => this.selectCategory(Category.Humanities)}
        >
          <div className="bold font-16 h-title-r24">Traditional Humanities</div>
          <div className="lozengies-container font-11 first-lozengies">
            <div>History</div>
            <div>Politics</div>
            <div>Religion, Philosophy & Ethics</div>
            <div>Law</div>
          </div>
          <div className="lozengies-container font-11">
            <div>English Literature</div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={className + " "}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Humanities })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Humanities)}>
        <div className="flex-center">
          <SpriteIcon name="humanity-icon" />
        </div>
        <div className="bold">Traditional Humanities</div>
      </div>
    );
  }

  renderLanguageCategory() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Languages);

    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Languages) {
      return (
        <div
          className={className + " hovered-category"}
          onMouseEnter={() => this.setState({ hoveredCategory: Category.Languages })}
          onMouseLeave={this.leaveCategory.bind(this)}
          onClick={() => this.selectCategory(Category.Languages)}
        >
          <div className="bold font-16 h-title-r24">Languages & Cultures</div>
          <div className="lozengies-container font-11">
            <div>Modern European Languages (French, Spanish etc.)</div>
            <div>Linguistics</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Eastern and Oriental Languages (Arabic, Mandarin, Japanese etc.)</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Classical Languages like Latin (also, Classical Civilisation / Archaeology)</div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={className + " flex-center"}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Languages })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Languages)}
      >
        <div className="flex-center">
          <SpriteIcon name="language-icon" />
        </div>
        <div className="bold">Languages & Cultures</div>
      </div>
    );
  }

  renderArtsCategory() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Arts);

    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Arts) {
      return (
        <div
          className={className + " hovered-category"}
          onMouseEnter={() => this.setState({ hoveredCategory: Category.Arts })}
          onMouseLeave={this.leaveCategory.bind(this)}
          onClick={() => this.selectCategory(Category.Arts)}
        >
          <div className="bold font-16 h-title-r24">Arts</div>
          <div className="lozengies-container font-11">
            <div>Performing Arts</div>
            <div>Art & Design (Photography)</div>
            <div>Dance</div>
            <div>Fine Art </div>
          </div>
          <div className="lozengies-container font-11">
            <div>Photography</div>
            <div>Film & Media </div>
            <div>Design</div>
            <div>Music</div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={className + " flex-center"}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Arts })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Arts)}
      >
        <div className="flex-center">
          <SpriteIcon name="arts-icon" />
        </div>
        <div className="bold">Arts</div>
      </div>
    );
  }

  renderVocationalCategory() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Vocational);

    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Vocational) {
      return (
        <div
          className={className + " hovered-category"}
          onMouseEnter={() => this.setState({ hoveredCategory: Category.Vocational })}
          onMouseLeave={this.leaveCategory.bind(this)}
          onClick={() => this.selectCategory(Category.Vocational)}
        >
          <div className="bold font-16 h-title-r24">Vocational & Commercial</div>
          <div className="lozengies-container font-11">
            <div>Business & Management</div>
            <div>Journalism</div>
            <div>Retail</div>
            <div>Marketing, Advertising & PR</div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={className + " flex-center"}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Vocational })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Arts)}
      >
        <div className="flex-center">
          <SpriteIcon name="vocational-comertial" />
        </div>
        <div className="bold">Vocational & Commercial</div>
      </div>
    );
  }

  renderContinueBtn() {
    let className = "absolute-contunue-btn font-24";
    let disabled = this.state.categories4bc.length === 0;
    if (disabled) {
      className += " disabled";
    }
    return (
      <button className={className} onClick={() => {
        this.setState({ subStep: SubStep.sub4c });
      }}>Continue</button>
    );
  }

  renderList(className: string, list: TLevelCourse[], onChange: Function) {
    return (
      <div>
        {list.map((course, i) => {
          return (
            <div key={i} className={"course-box-r-23 course-box-4e1 " + className + (course.active ? ' active' : "")} onClick={() => {
              course.active = !course.active;
              onChange();
            }}>
              <div className="font-16 bold flex">
                <div className="flex-center big-r-23">
                  <SpriteIcon name={course.icon} />
                </div>
                <div className="flex-y-center course-name-r23">
                  {course.name}
                </div>
                <div className="flex-center coursor-pointer" onClick={e => {
                  e.stopPropagation();
                  course.expanded = !course.expanded;
                  onChange();
                }}>
                  <SpriteIcon name={course.expanded ? "arrow-up" : "arrow-down"} />
                </div>
              </div>
              {course.expanded && <div className="course-subjects-r23 font-14">
                {course.subjects.map((subject, i) =>
                  <span>
                    {subject.name}{i !== course.subjects.length - 1 ? ", " : "."}
                  </span>)}
              </div>}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    if (this.state.subStep === SubStep.sub4e2) {
      let selected = this.state.tVocCoursesE1Part1.filter(a => a.active == true);
      selected.push(...this.state.tVocCoursesE1Part2.filter(a => a.active == true));

      return (
        <div className="question">
          <div className="bold font-32 question-text-3">
            Your selected categories and courses
          </div>
          <div className="font-16">
            View the courses available for the categories you’ve selected in the previous screen
          </div>

          <div className="categories-container categories-container-r342">
            {selected.map((course, i) => {
              return (
                <div>
                  <div
                    className="hovered-category"
                    onMouseEnter={() => this.setState({ hoveredCategory: Category.Stem })}
                    onMouseLeave={this.leaveCategory.bind(this)}
                    onClick={() => this.selectCategory(Category.Stem)}
                  >
                    <div className="bold font-16">{course.name}</div>
                    <div>
                      <div className="lozengies-container font-11 first-lozengies lozengies-r232">
                        {course.subjects.map(s => <div>{s.name}</div>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4e1 })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.moveNext({});
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4e1) {
      return (
        <div className="font-16 question-4e1">
          <div className="bold font-32 question-text-3">
            Vocational Options in Higher Education
          </div>
          <div>
            Many vocational students go straight into work and apprenticeships after the sixth form. But a large number proceed to vocational courses in higher education.
          </div>
          <div>
            Among many options, there are hundreds of courses for Higher National Certificate (1 year undergraduate study) and Higher National Diploma (2 years undergraduate study).
          </div>
          <div>
            It’s hard to know for sure where your thinking will be in a couple of years, but here are 15 broad categories of vocational courses in higher education. Try to Select the ONE, TWO or, at most, THREE categories that interest you most at present.
          </div>
          <div className="d3-table-scroll-container">
            <div className="d3-table-leaf">
              {this.renderList("first-b-r-23", this.state.tVocCoursesE1Part1, () => {
                this.setState({ tVocCoursesE1Part1: [...this.state.tVocCoursesE1Part1] })
              })}
              {this.renderList("second-b-r-23", this.state.tVocCoursesE1Part2, () => {
                this.setState({ tVocCoursesE1Part2: [...this.state.tVocCoursesE1Part2] })
              })}
            </div>
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4d2 })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: SubStep.sub4e2 });
          }}>Show me courses in the categories  which I have selected</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4d2) {
      return (
        <div className="question">
          <div className="bold font-32 question-text-4">
            Non-Facilitating Subjects
          </div>
          <div className="font-16 margin-bottom-1">
            Note that the Russell Group have been criticised for not including several arts subjects. Now select the three subjects you would choose if you could only choose from non-facilitating subjects.
          </div>
          <div className="categories-container-4c-r23 non-facilitation-category font-16">
            <div className="font-16">
              <div className="text-4c">
                <div className="bold">Russell Group’s Non-Facilitating Subjects:</div>
              </div>
              <div className="checkbox-container-r23">
                {this.state.nonFacilitatingSubjects.map((subject: any) => <div>
                  <CheckBoxB currentChoice={subject.selected} label={subject.name} toggleChoice={() => {
                    subject.selected = !subject.selected;
                    this.setState({ cetegoriesData: this.state.cetegoriesData });
                  }} />
                </div>)}
              </div>
            </div>
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4d1 })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: SubStep.sub4e1 });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4d1) {
      return (
        <div className="question">
          <div className="bold font-32 question-text-4">
            Prestige & Facilitating Subjects
          </div>
          <div className="font-16 margin-bottom-1">
            Some universities can be a bit picky about A-levels. The Russell Group represents most of the UK’s top universities. It does not dismiss any A-level or sixth form qualification, but it has previously argued that certain subjects, often considered more academically rigorous, can be viewed as facilitating subjects. This means subjects which open doors onto a wide variety of degree courses.
          </div>
          <div className="font-16 margin-bottom-1">
            As an experiment, select the three subjects you would be most likely to choose if you could only choose from facilitating subjects.
          </div>
          <div className="categories-container-4c-r23 facilitation-category font-16">
            <div className="font-16">
              <div className="text-4c">
                <div className="bold">Russell Group’s Facilitating Subjects:</div>
              </div>
              <div className="checkbox-container-r23">
                {this.state.facilitatingSubjects.map((subject: any) => <div>
                  <CheckBoxB currentChoice={subject.selected} label={subject.name} toggleChoice={() => {
                    subject.selected = !subject.selected;
                    this.setState({ cetegoriesData: this.state.cetegoriesData });
                  }} />
                </div>)}
              </div>
            </div>
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4b })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: SubStep.sub4d2 });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4c) {
      return (
        <div className="question">
          <div className="bold font-32 question-text-4">
            A-levels
          </div>
          <div className="font-16 margin-bottom-1">
            You have suggested that your eventual degree course might come from one of the following (one/ two) categories.
          </div>
          <div className="font-16 margin-bottom-1">
            Now highlight the individual courses which most appeal to you. Choose up to three.
          </div>
          <div className="categories-container-4c-r23 font-16">
            {this.state.categories4bc.map((category, i) => {
              const catData = this.state.cetegoriesData[category];
              return (
                <div key={i} className="font-16">
                  <div className="text-4c">
                    <div className="bold">{catData.name}</div>
                    {catData.description ? <div className="font-14">{catData.description}</div> : ""}
                  </div>
                  <div className="checkbox-container-r23">
                    {catData.subjects.map((subject: any) => <div>
                      <CheckBoxB currentChoice={subject.selected} label={subject.name} toggleChoice={() => {
                        subject.selected = !subject.selected;
                        this.setState({ cetegoriesData: this.state.cetegoriesData });
                      }} />
                    </div>)}
                  </div>
                </div>
              );
            })}
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4b })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.saveAnswer();
            this.setState({ subStep: SubStep.sub4d1 });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4b) {
      return (
        <div className="question">
          <div className="bold font-32 question-text-4">
            A-levels
          </div>
          <div className="font-16 margin-bottom-1">
            Most A-level students go to a university. Nobody expects you to know what degree you are going to do before you have even started the sixth form. However, it makes sense to think about what your strengths, weaknesses and interests are, because you can’t do some degrees without certain A-levels.
          </div>
          <div className="font-16 margin-bottom-1">
            First of all, let’s get a general impression of what type of degree you might pursue. Below are five broad categories. Select the ONE, TWO or THREE that you think you are most likely to fall into. “(While Medicine and Architecture, are vocations,  but we class them as academic degrees.)”
          </div>
          <div className="categories-container font-16">
            <div>
              {this.renderStemCategory()}
              {this.renderHumanityCategory()}
              {this.renderArtsCategory()}
            </div>
            <div>
              {this.renderScienceCategory()}
              {this.renderLanguageCategory()}
              {this.renderVocationalCategory()}
            </div>
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4a })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.saveAnswer();
            this.setState({ subStep: SubStep.sub4c });
          }}>Continue</button>
        </div>
      );
    }

    return (
      <div className="question">
        <div className="font-16">
          What you choose to do in the sixth form invariably affects your options if you want to continue into higher education.
        </div>
        <div className="bold font-32 question-text-4">
          From the answer you’ve given us, we think you are . . .
        </div>
        <div className="boxes-container font-20">
          <CheckBoxV2 currentChoice={FirstChoice.ALevel} choice={this.props.firstAnswer.answer.choice}
            label="someone who will only study A-levels and apply to study at university" setChoice={() => { }}
          />
          <CheckBoxV2 currentChoice={FirstChoice.ShowMeAll || FirstChoice.Other} choice={this.props.firstAnswer.answer.choice}
            label="someone who may study a combination of A-level and Vocational Courses who may apply to study at university." setChoice={() => { }}
          />
          <CheckBoxV2 currentChoice={FirstChoice.Vocational as any} choice={this.props.firstAnswer.answer.choice}
            label="someone likely to study Vocational Courses only in the sixth form, who may go directly into work at eighteen, or an apprenticeship." setChoice={() => { }}
          />
        </div>
        <div className="font-16 white-blue">If you’ve changed your mind click the category above which best applies to you.</div>
        <BackButtonSix onClick={() => this.props.moveBack()} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          this.setState({ subStep: SubStep.sub4b });
        }}>Continue</button>
      </div>
    );
  }
}

export default FourthStep;
