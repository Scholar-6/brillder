import React, { Component } from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import BackButtonSix from "../BackButtonSix";
import CheckBoxB from "../CheckBoxB";
import FourthStepA from "./FourthStepA";
import { Dialog } from "@material-ui/core";
import FourthStepWelcome from "./FourthStepWelcome";
import { FirstChoice } from "../firstStep/StepCourseSelect";
import { isPhone } from "services/phone";
import NextButtonSix from "../NextButtonSix";

enum SubStep {
  welcome,
  sub4a,
  sub4b,
  sub4c,
  sub4d1, // hidden
  sub4d2, // hidden
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
  secondAnswer: any;
  answer: any;
  canSkip: boolean;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
  saveAnswer(answer: any): void;
  saveSecondAnswer(choice: FirstChoice): void;
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

  overflowOpen: boolean;
}

class FourthStep extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subStep = SubStep.welcome;

    let categories4bc: any[] = [];

    let cetegoriesData = [{
      name: "none",
      subjects: []
    }, {
      name: "Traditional STEM",
      description: "For many science courses there is an expectation that you will have done A-level Maths.",
      subjects: [{
        name: "Astronomy",
        selected: false,
      }, {
        name: "Biology",
        selected: false,
      }, {
        name: "Computer Science",
        selected: false,
      }, {
        name: "Chemistry",
        selected: false,
      }, {
        name: "Data Science",
        selected: false,
      }, {
        name: "Dentistry",
        selected: false,
      }, {
        name: "Ecology",
        selected: false,
      }, {
        name: "Engineering",
        selected: false,
      }, {
        name: "Geology",
        selected: false,
      }, {
        name: "Mathematics",
        selected: false,
      }, {
        name: "Medicine (Human and Veterinary)",
        selected: false,
      }, {
        name: "Pharmacology",
        selected: false,
      }, {
        name: "Physics",
        selected: false,
      }, {
        name: "Robotics",
        selected: false,
      }, {
        name: "Zoology",
        selected: false,
      }]
    }, {
      name: "Interdisciplinary Sciences",
      description: "Some subjects fuse scientific or statistical method with aspects of Humanities and/or Arts",
      subjects: [{
        name: "Agriculture & Forestry",
        selected: false,
      }, {
        name: "Anthropology",
        selected: false,
      }, {
        name: "Archaeology",
        selected: false,
      }, {
        name: "Architecture",
        selected: false,
      }, {
        name: "Criminology",
        selected: false,
      }, {
        name: "Economics",
        selected: false,
      }, {
        name: "Environmental Science",
        selected: false,
      }, {
        name: "Forensic Science",
        selected: false,
      }, {
        name: "Geography",
        selected: false,
      }, {
        name: "Psychology",
        selected: false,
      }, {
        name: "Sociology",
        selected: false,
      }]
    }, {
      name: "Traditional Humanities",
      subjects: [{
        name: "Classics & Ancient History",
        selected: false,
      }, {
        name: "Education",
        selected: false,
      }, {
        name: "English Literature",
        selected: false,
      }, {
        name: "History",
        selected: false,
      }, {
        name: "Law",
        selected: false,
      }, {
        name: "Politics",
        selected: false,
      }, {
        name: "Religion, Philosophy & Ethics",
        selected: false,
      }]
    }, {
      name: "Languages & Cultures",
      subjects: [{
        name: "Modern European Languages (French, Spanish etc.)",
        selected: false,
      }, {
        name: "Other Modern Languages (Arabic, Mandarin, Japanese etc.)",
        selected: false,
      }, {
        name: "Classics (Latin, Ancient Greek, and also, Classical Civilisation / Archaeology)",
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
      name: "English Literature",
      selected: false
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
      name: 'Design, Craft & Visual Arts',
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

    if (props.answer) {
      const { answer } = props.answer;
      if (answer.subStep) {
        subStep = answer.subStep;
      }
      if (answer.categories4bc) {
        categories4bc = answer.categories4bc;
      }
      if (answer.cetegoriesData) {
        cetegoriesData = answer.cetegoriesData;
      }
      if (answer.facilitatingSubjects) {
        facilitatingSubjects = answer.facilitatingSubjects;
      }
      if (answer.nonFacilitatingSubjects) {
        nonFacilitatingSubjects = answer.nonFacilitatingSubjects;
      }
      if (answer.categories4e) {
        if (answer.categories4e.tVocCoursesE1Part1) {
          tVocCoursesE1Part1 = answer.categories4e.tVocCoursesE1Part1;
        }
        if (answer.categories4e.tVocCoursesE1Part2) {
          tVocCoursesE1Part2 = answer.categories4e.tVocCoursesE1Part2;
        }
      }
    }

    this.state = {
      categories4bc,
      cetegoriesData,
      facilitatingSubjects,
      nonFacilitatingSubjects,
      hoveredCategory: -1,
      subStep,

      tVocCoursesE1Part1,
      tVocCoursesE1Part2,

      overflowOpen: false,
    }
  }

  getAnswer() {
    const { categories4bc } = this.state;
    const categories4c: any[] = [];
    for (let category4b of categories4bc) {
      const category = this.state.cetegoriesData[category4b];
      categories4c.push(category);
    }
    return {
      subStep: this.state.subStep,
      cetegoriesData: this.state.cetegoriesData,
      categories4bc: categories4bc,
      facilitatingSubjects: this.state.facilitatingSubjects,
      nonFacilitatingSubjects: this.state.nonFacilitatingSubjects,
      categories4c,
      categories4e: {
        tVocCoursesE1Part1: this.state.tVocCoursesE1Part1,
        tVocCoursesE1Part2: this.state.tVocCoursesE1Part2
      }
    }
  }

  saveAnswer() {
    this.props.saveAnswer(this.getAnswer());
  }

  renderNextBtn() {
    let disabled = false;
    return (
      <button className={`absolute-contunue-btn font-24 ${disabled ? 'disabled' : ''}`} onClick={() => {
        this.props.moveNext(this.getAnswer());
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
      } else {
        this.setState({ overflowOpen: true });
      }
    }
    this.setState({ categories4bc });
  }

  renderStemCategoryPhone() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Stem);
    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Stem) {
      return (
        <div
          className={className + " hovered-category"}
          onClick={() => this.selectCategory(Category.Stem)}
        >
          <div className="bold font-16 h-title-r24">
            <SpriteIcon name="stem-icon" />
            <div>Traditional STEM</div>
            <SpriteIcon name="arrow-up" className="expand-arrow-4544" onClick={e => {
              e.stopPropagation();
              this.leaveCategory();
            }} />
          </div>
          <div className="font-14 margin-left-4">
            A-level Maths is usually required for science courses.
          </div>
          <div className="lozengies-container font-12 first-lozengies bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Medicine</div>
            <div>Chemical Engineering</div>
            <div>Physics</div>
            <div>Zoology</div>
          </div>
        </div>
      );
    }
    return (<div
      className={className + " flex-center"}
      onClick={() => this.selectCategory(Category.Stem)}
    >
      <SpriteIcon name="stem-icon" />
      <div className="bold">Traditional STEM</div>
      <SpriteIcon name="arrow-down" className="expand-arrow-4544" onClick={e => {
        e.stopPropagation();
        this.setState({ hoveredCategory: Category.Stem });
      }} />
    </div>
    );
  }

  renderScienceCategoryPhone() {
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
          onClick={() => this.selectCategory(Category.Science)}
        >
          <div className="bold font-16 h-title-r24">
            <SpriteIcon name="science-icon" />
            <div>Interdisciplinary Sciences</div>
            <SpriteIcon name="arrow-up" className="expand-arrow-4544" onClick={e => {
              e.stopPropagation();
              this.leaveCategory();
            }} />
          </div>
          <div className="font-14 margin-left-4">
            Some degrees fuse scientific or statistical method with aspects of Humanities.
          </div>
          <div className="lozengies-container font-12 first-lozengies bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Geography</div>
            <div>Economics</div>
            <div>Psychology</div>
            <div>Sociology</div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={className + " flex-center"}
        onClick={() => this.selectCategory(Category.Science)}
      >
        <SpriteIcon name="science-icon" />
        <div className="bold">Interdisciplinary Sciences</div>
        <SpriteIcon name="arrow-down" className="expand-arrow-4544" onClick={e => {
          e.stopPropagation();
          this.setState({ hoveredCategory: Category.Science });
        }} />
      </div>
    );
  }

  renderHumanityCategoryPhone() {
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
          onClick={() => this.selectCategory(Category.Humanities)}
        >
          <div className="bold font-16 h-title-r24">
            <SpriteIcon name="humanity-icon" />
            <div>Traditional Humanities</div>
            <SpriteIcon name="arrow-up" className="expand-arrow-4544" onClick={e => {
              e.stopPropagation();
              this.leaveCategory();
            }} />
          </div>
          <div className="font-14 margin-left-4">The expectation is that you would do at least one essay subject at A-level.</div>
          <div className="lozengies-container font-12 first-lozengies bold">
            <div className="just-text-r3367">e.g.</div>
            <div>History</div>
            <div>Politics</div>
            <div>Literature</div>
            <div>Law</div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={className + " "}
        onClick={() => this.selectCategory(Category.Humanities)}>
        <SpriteIcon name="humanity-icon" />
        <div className="bold">Traditional Humanities</div>
        <SpriteIcon name="arrow-down" className="expand-arrow-4544" onClick={e => {
          e.stopPropagation();
          this.setState({ hoveredCategory: Category.Humanities });
        }} />
      </div>
    );
  }

  renderLanguageCategoryPhone() {
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
          <div className="bold font-16 h-title-r24">
            <SpriteIcon name="language-icon" />
            <div>Languages & Cultures</div>
            <SpriteIcon name="arrow-up" className="expand-arrow-4544" onClick={e => {
              e.stopPropagation();
              this.leaveCategory();
            }} />
          </div>
          <div className="font-14 margin-left-4">You will have studied languages already and shown some aptitude.</div>
          <div className="lozengies-container font-11 bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Spanish</div>
            <div>French</div>
            <div>Classics</div>
            <div>Mandarin</div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={className + " flex-center"}
        onClick={() => this.selectCategory(Category.Languages)}
      >
        <SpriteIcon name="language-icon" />
        <div className="bold">Languages & Cultures</div>
        <SpriteIcon name="arrow-down" className="expand-arrow-4544" onClick={e => {
          e.stopPropagation();
          this.setState({ hoveredCategory: Category.Languages });
        }} />
      </div>
    );
  }

  renderArtsCategoryPhone() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Arts);

    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Arts) {
      return (
        <div
          className={className + " hovered-category"}
          onClick={() => this.selectCategory(Category.Arts)}
        >
          <div className="bold font-16 h-title-r24">
            <SpriteIcon name="arts-icon" />
            <div>Arts</div>
            <SpriteIcon name="arrow-up" className="expand-arrow-4544" onClick={e => {
              e.stopPropagation();
              this.leaveCategory();
            }} />
          </div>
          <div className="font-14 margin-left-4">You would probably need a qualification in the field you wish to pursue.</div>
          <div className="lozengies-container font-11 bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Fine Art</div>
            <div>Performing Arts</div>
            <div>Photography</div>
            <div>Music</div>
            <div>Film</div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={className + " flex-center"}
        onClick={() => this.selectCategory(Category.Arts)}
      >
        <SpriteIcon name="arts-icon" />
        <div className="bold">Arts</div>
        <SpriteIcon name="arrow-down" className="expand-arrow-4544" onClick={e => {
          e.stopPropagation();
          this.setState({ hoveredCategory: Category.Arts });
        }} />
      </div>
    );
  }

  renderVocationalCategoryPhone() {
    let className = "";
    let category = this.state.categories4bc.includes(Category.Vocational);

    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Vocational) {
      return (
        <div
          className={className + " hovered-category"}
          onClick={() => this.selectCategory(Category.Vocational)}
        >
          <div className="bold font-16 h-title-r24">
            <SpriteIcon name="vocational-comertial" />
            <div>Vocational & Commercial</div>
            <SpriteIcon name="arrow-up" className="expand-arrow-4544" onClick={e => {
              e.stopPropagation();
              this.leaveCategory();
            }} />
          </div>
          <div className="font-14">Entry from both academic and vocational routes is possible.</div>
          <div className="lozengies-container font-11 bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Business & Management</div>
            <div>Journalism</div>
            <div>Retail</div>
            <div>Marketing</div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={className + " flex-center"}
        onClick={() => this.selectCategory(Category.Vocational)}
      >
        <SpriteIcon name="vocational-comertial" />
        <div className="bold">Vocational & Commercial</div>
        <SpriteIcon name="arrow-down" className="expand-arrow-4544" onClick={e => {
          e.stopPropagation();
          this.setState({ hoveredCategory: Category.Vocational });
        }} />
      </div>
    );
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
          <div className="bold font-16 h-title-r24">Traditional STEM</div>
          <div className="font-14">
            A-level Maths is usually required for science courses.
          </div>
          <div className="lozengies-container font-11 first-lozengies bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Medicine</div>
            <div>Chemical Engineering</div>
            <div>Physics</div>
            <div>Zoology</div>
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
        Traditional STEM
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
            Some degrees fuse scientific or statistical method with aspects of<br /> Humanities.
          </div>
          <div className="lozengies-container font-11 first-lozengies bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Geography</div>
            <div>Economics</div>
            <div>Psychology</div>
            <div>Sociology</div>
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
          <div className="font-14">The expectation is that you would do at least one essay subject at A-level.</div>
          <div className="lozengies-container font-11 first-lozengies bold">
            <div className="just-text-r3367">e.g.</div>
            <div>History</div>
            <div>Politics</div>
            <div>Literature</div>
            <div>Law</div>
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
          <div className="font-14">You will have studied languages already and shown some aptitude.</div>
          <div className="lozengies-container font-11 bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Spanish</div>
            <div>French</div>
            <div>Classics</div>
            <div>Mandarin</div>
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
          <div className="font-14">You would probably need a qualification in the field you wish to pursue.</div>
          <div className="lozengies-container font-11 bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Fine Art</div>
            <div>Performing Arts</div>
            <div>Photography</div>
            <div>Music</div>
            <div>Film</div>
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
          <div className="font-14">Entry from both academic and vocational routes is possible.</div>
          <div className="lozengies-container font-11 bold">
            <div className="just-text-r3367">e.g.</div>
            <div>Business & Management</div>
            <div>Journalism</div>
            <div>Retail</div>
            <div>Marketing</div>
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

  renderList(className: string, list: TLevelCourse[], onChange: Function) {
    return (
      <div>
        {list.map((course, i) => {
          return (
            <div key={i} className={"course-box-r-23 course-box-4e1 " + className + (course.active ? ' active' : "")} onClick={() => {
              const activeNumber = this.state.tVocCoursesE1Part1.filter(a => a.active == true).length + this.state.tVocCoursesE1Part2.filter(a => a.active == true).length;
              if (activeNumber >= 3 && !course.active) {
                this.setState({ overflowOpen: true });
              } else {
                course.active = !course.active;
              }
              onChange();
            }}>
              <div className="font-16 bold flex">
                <div className="flex-center big-r-23">
                  <SpriteIcon name={course.icon} />
                </div>
                <div className="flex-y-center course-name-r23">
                  {course.name}
                </div>
                <div className="flex-center coursor-pointer">
                  <SpriteIcon name={course.active ? "arrow-up" : "arrow-down"} />
                </div>
              </div>
              {course.active && <div className="course-subjects-r23 font-14">
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

      if (isPhone()) {
        return (
          <div className="question question-vocational-degrees">
            <div className="relative">
              <img src="/images/choicesTool/phone/Step4Fifth.png" className="third-step-img fourth-step-img-r4324"></img>
            </div>
            <div className="bold font-24 question-text-3 margin-left-4">
              Vocational Degrees
            </div>
            <div className="font-16 margin-left-4">
              View the courses available for the<br />
              categories you selected. Select up<br />
              to <span className="bold">five</span> that interest you.
            </div>
            <div className="categories-container categories-container-r342">
              {selected.map((course, i) => {
                return (
                  <div>
                    <div
                      className="hovered-category hovered-category-r34554"
                      onMouseEnter={() => this.setState({ hoveredCategory: Category.Stem })}
                      onMouseLeave={this.leaveCategory.bind(this)}
                      onClick={() => this.selectCategory(Category.Stem)}
                    >
                      <div className="bold font-16">{course.name}</div>
                      <div>
                        <div className="lozengies-container font-11 first-lozengies lozengies-r232">
                          {course.subjects.map(s => <div className={s.active ? 'active' : ''} onClick={() => {
                            if (s.active === false) {
                              let activeCount = this.state.tVocCoursesE1Part1.map(s => s.subjects.filter(s => s.active).length).reduce((a, b) => a + b, 0) + this.state.tVocCoursesE1Part2.map(s => s.subjects.filter(s => s.active).length).reduce((a, b) => a + b, 0);
                              if (activeCount >= 5) {
                                return;
                              }
                            }
                            s.active = !s.active;
                            this.setState({ tVocCoursesE1Part1: [...this.state.tVocCoursesE1Part1], tVocCoursesE1Part2: [...this.state.tVocCoursesE1Part2] });
                          }}>{s.name}</div>)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4e1 })} />
            <NextButtonSix label="Continue" onClick={() => {
              this.props.moveNext(this.getAnswer());
            }} />
          </div>
        );
      }

      return (
        <div className="question">
          <div className="bold font-32 question-text-3">
            Vocational Degrees
          </div>
          <img src="/images/choicesTool/VocationDegrees.png" className="third-step-img fourth-step-img-r4324"></img>
          <div className="font-16">
            View the courses available for the categories you selected. Select up to <span className="bold">five</span> that interest you.
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
                        {course.subjects.map(s => <div className={s.active ? 'active' : ''} onClick={() => {
                          if (s.active === false) {
                            let activeCount = this.state.tVocCoursesE1Part1.map(s => s.subjects.filter(s => s.active).length).reduce((a, b) => a + b, 0) + this.state.tVocCoursesE1Part2.map(s => s.subjects.filter(s => s.active).length).reduce((a, b) => a + b, 0);
                            if (activeCount >= 5) {
                              return;
                            }
                          }
                          s.active = !s.active;
                          this.setState({ tVocCoursesE1Part1: [...this.state.tVocCoursesE1Part1], tVocCoursesE1Part2: [...this.state.tVocCoursesE1Part2] });
                        }}>{s.name}</div>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4e1 })} />
          <NextButtonSix label="Continue" onClick={() => {
            this.props.moveNext(this.getAnswer());
          }} />
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4e1) {
      let disabled = true;
      for (let t of this.state.tVocCoursesE1Part1) {
        t.active && (disabled = false);
      }
      for (let t of this.state.tVocCoursesE1Part2) {
        t.active && (disabled = false);
      }

      if (isPhone()) {
        return (
          <div className="font-16 question-4e1">
            <div className="relative">
              <img src="/images/choicesTool/TypesOfVocationalDegree.png" className="third-step-img fourth-step-img-r4325"></img>
            </div>
            <div className="bold font-24 question-text-3 margin-left-4">
              Types of Vocational<br /> Degree
            </div>
            <div className="margin-left-4">
              Many students go directly into work or<br />
              apprenticeships after sixth form. But some begin<br />
              vocational degrees instead.
            </div>
            <div className="margin-left-4 margin-top-2vw">
              Here are fifteen types of vocational degree. Select up to <span className="bold">three</span> that interest you.
            </div>
            <div className="d3-table-scroll-container d3-table-scroll-container-f4">
              <div className="d3-table-leaf">
                {this.renderList("first-b-r-23", this.state.tVocCoursesE1Part1, () => {
                  this.setState({ tVocCoursesE1Part1: [...this.state.tVocCoursesE1Part1] })
                })}
                {this.renderList("second-b-r-23", this.state.tVocCoursesE1Part2, () => {
                  this.setState({ tVocCoursesE1Part2: [...this.state.tVocCoursesE1Part2] })
                })}
              </div>
            </div>
            {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
              Oops! You’ve tried to pick too many.
              <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
            </Dialog>}
            <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4c })} />
            <NextButtonSix label="Continue" disabled={disabled} onClick={() => {
              this.saveAnswer();
              this.setState({ subStep: SubStep.sub4e2 });
            }} />
          </div>
        );
      }

      return (
        <div className="font-16 question-4e1">
          <div className="bold font-32 question-text-3 padding-b-1d5vh">
            Types of Vocational Degree
          </div>
          <img src="/images/choicesTool/TypesOfVocationalDegree.png" className="third-step-img fourth-step-img-r4325"></img>
          <div>
            Many students go directly into work or apprenticeships after sixth form. But some begin vocational degrees instead.
          </div>
          <div>
            Here are fifteen types of vocational degree. Select up to <span className="bold">three</span> that interest you.
          </div>
          <div className="d3-table-scroll-container d3-table-scroll-container-f4">
            <div className="d3-table-leaf">
              {this.renderList("first-b-r-23", this.state.tVocCoursesE1Part1, () => {
                this.setState({ tVocCoursesE1Part1: [...this.state.tVocCoursesE1Part1] })
              })}
              {this.renderList("second-b-r-23", this.state.tVocCoursesE1Part2, () => {
                this.setState({ tVocCoursesE1Part2: [...this.state.tVocCoursesE1Part2] })
              })}
            </div>
          </div>
          {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
            Oops! You’ve tried to pick too many.
            <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
          </Dialog>}
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4c })} />
          <NextButtonSix label="Continue" disabled={disabled} onClick={() => {
            this.saveAnswer();
            this.setState({ subStep: SubStep.sub4e2 });
          }} />
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4c) {
      if (isPhone()) {
        return (
          <div className="question question-step4fourth">
            <div className="relative">
              <img src="/images/choicesTool/phone/Step4Fourth.png" className="third-step-img fourth-step-img-r12"></img>
            </div>
            <div className="bold font-24 question-text-4 margin-left-4">
              Degree Courses
            </div>
            <div className="font-16 margin-left-4">
              You have suggested that your<br />
              eventual degree course might come<br />
              from one of the following categories.
            </div>
            <div className="font-16 margin-left-4 margin-top-2vw margin-bottom-4vw">
              Now choose up to five individual courses that<br />
              particularly appeal to you.
            </div>
            <div className="categories-container-4c-r23 font-16">
              {this.state.categories4bc.map((category, i) => {
                const catData = this.state.cetegoriesData[category];
                return (
                  <div key={i} className="font-16">
                    <div className="text-4c">
                      <div className="bold">{catData.name}</div>
                      {catData.description ? <div className="font-14 description-4-r434">{catData.description}</div> : ""}
                    </div>
                    <div className="checkbox-container-r23">
                      {catData.subjects.map((subject: any, index: number) => <div>
                        <CheckBoxB key={index} currentChoice={subject.selected} label={subject.name} toggleChoice={() => {
                          let selected: any[] = [];
                          this.state.cetegoriesData.forEach((c: any) => {
                            selected.push(...c.subjects.filter((s: any) => s.selected));
                          });
                          if (selected.length >= 5 && !subject.selected) {
                            this.setState({ overflowOpen: true });
                            //skip
                          } else {
                            subject.selected = !subject.selected;
                          }
                          this.setState({ cetegoriesData: this.state.cetegoriesData });
                        }} />
                      </div>)}
                    </div>
                  </div>
                );
              })}
            </div>
            {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
              Oops! You’ve tried to pick too many.
              <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
            </Dialog>}
            <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4b })} />
            <NextButtonSix label="Continue" onClick={() => {
              this.saveAnswer();
              this.setState({ subStep: SubStep.sub4e1 });
            }} />
          </div>
        );
      }
      return (
        <div className="question">
          <img src="/images/choicesTool/FourthStepR12.png" className="third-step-img fourth-step-img-r12"></img>
          <div className="bold font-32 question-text-4">
            Degree Courses
          </div>
          <div className="font-16 margin-bottom-1">
            You have suggested that your eventual degree course might come from one of the following categories.
          </div>
          <div className="font-16 margin-bottom-1">
            Now choose up to five individual courses that particularly appeal to you.
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
                    {catData.subjects.map((subject: any, index: number) => <div>
                      <CheckBoxB key={index} currentChoice={subject.selected} label={subject.name} toggleChoice={() => {
                        let selected: any[] = [];
                        this.state.cetegoriesData.forEach((c: any) => {
                          selected.push(...c.subjects.filter((s: any) => s.selected));
                        });
                        if (selected.length >= 5 && !subject.selected) {
                          this.setState({ overflowOpen: true });
                          //skip
                        } else {
                          subject.selected = !subject.selected;
                        }
                        this.setState({ cetegoriesData: this.state.cetegoriesData });
                      }} />
                    </div>)}
                  </div>
                </div>
              );
            })}
          </div>
          {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
            Oops! You’ve tried to pick too many.
            <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
          </Dialog>}
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4b })} />
          <NextButtonSix label="Continue" onClick={() => {
            this.saveAnswer();
            this.setState({ subStep: SubStep.sub4e1 });
          }} />
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4b) {
      const disabled = this.state.categories4bc.length === 0;

      if (isPhone()) {
        return (
          <div className="question question-step4-degrees">
            <div className="relative">
              <img src="/images/choicesTool/phone/Step4Third.png" className="third-step-img fourth-step-img-r11" />
            </div>
            <div className="bold font-24 question-text-4 margin-left-4">
              Types of Degree Course
            </div>
            <div className="font-16 margin-left-4">
              Below are five broad categories of degree.<br />
              Select up to <span className="bold">three</span> categories that you<br />
              think you might fall into.
            </div>
            <div className="categories-container font-16">
              <div>
                {this.renderStemCategoryPhone()}
                {this.renderScienceCategoryPhone()}
                {this.renderHumanityCategoryPhone()}
                {this.renderLanguageCategoryPhone()}
                {this.renderArtsCategoryPhone()}
                {this.renderVocationalCategoryPhone()}
              </div>
            </div>
            {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
              Oops! You’ve tried to pick too many
              <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
            </Dialog>}
            <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4a })} />
            <NextButtonSix label="Continue" disabled={disabled} onClick={() => {
              this.saveAnswer();
              this.setState({ subStep: SubStep.sub4c });
            }} />
          </div>
        );
      }

      return (
        <div className="question">
          <img src="/images/choicesTool/FourthStepR11.png" className="third-step-img fourth-step-img-r11"></img>
          <div className="bold font-32 question-text-4">
            Types of Degree Course
          </div>
          <div className="font-16 margin-bottom-1">
            Below are five broad categories of degree. Select up to <span className="bold">three</span> categories that you think you might fall into.
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
          {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
            Oops! You’ve tried to pick too many
            <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
          </Dialog>}
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub4a })} />
          <NextButtonSix label="Continue" disabled={disabled} onClick={() => {
            this.saveAnswer();
            this.setState({ subStep: SubStep.sub4c });
          }} />
        </div>
      );
    } else if (this.state.subStep === SubStep.sub4a) {
      let choice = FirstChoice.ShowMeAll;
      if (this.props.secondAnswer && this.props.secondAnswer.answer && this.props.secondAnswer.answer.subjectType) {
        choice = this.props.secondAnswer.answer.subjectType;
      }

      return <FourthStepA
        moveBack={() => this.setState({ subStep: SubStep.welcome })}
        moveNext={() => {
          this.setState({ subStep: SubStep.sub4b });
        }}
        choice={choice}
        onChoiceChanged={choice => {
          this.props.saveSecondAnswer(choice);
        }}
      />;
    }

    return <FourthStepWelcome
      canSkip={this.props.canSkip}
      onSkip={() => this.props.moveNext(this.getAnswer())}
      moveNext={() => this.setState({ subStep: SubStep.sub4a })}
      moveBack={() => this.props.moveBack(this.getAnswer())}
    />;
  }
}

export default FourthStep;
