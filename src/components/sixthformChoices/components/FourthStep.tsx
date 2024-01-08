import React, { Component } from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { SixthformSubject } from "services/axios/sixthformChoices";
import CheckBoxV2 from "./CheckBox";
import BackButtonSix from "./BackButtonSix";

enum SubStep {
  First,
  Second,
  Third,
  Fourth
}

enum Category {
  Stem = 1,
  Science,
  Humanities,
  Languages,
  Arts,
  Vocational
}

interface ThirdProps {
  firstAnswer: any;
  answer: any;
  subjects: SixthformSubject[];
  moveNext(answer: any): void;
  moveBack(): void;
}

interface ThirdQuestionState {
  subStep: SubStep;
  categories: Category[];
  hoveredCategory: number;
}

class ThirdQuestion extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    this.state = {
      categories: [],
      hoveredCategory: -1,
      subStep: SubStep.First,
    }
  }

  renderProgressBar() {
    return (
      <div>
        <div className="progress-bar">
          <div className='start active' />
          <div className='active' />
          <div className='active' />
          <div className='active' />
          <div />
          <div className="end" />
        </div>
        <div className="font-16">
          STEP 4: HIGHER EDUCATION
        </div>
      </div>
    );
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
    let { categories } = this.state;
    if (categories.includes(category)) {
      categories = categories.filter(c => c !== category);
    } else {
      if (categories.length < 2) {
        categories.push(category);
      }
    }
    this.setState({ categories });
  }

  renderStemCategory() {
    let className = "";
    let category = this.state.categories.includes(Category.Stem);
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
    let category = this.state.categories.includes(Category.Science);

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
    let category = this.state.categories.includes(Category.Humanities);

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

    /*

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
    );*/
  }

  renderLanguageCategory() {
    let className = "";
    let category = this.state.categories.includes(Category.Languages);

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
    let category = this.state.categories.includes(Category.Arts);

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
    let category = this.state.categories.includes(Category.Vocational);

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
    let disabled = this.state.categories.length === 0;
    if (disabled) {
      className += " disabled";
    }
    return (
      <button className={className} onClick={() => {
        this.setState({ subStep: SubStep.Third });
      }}>Continue</button>
    );
  }

  render() {
    if (this.state.subStep === SubStep.Third) {
      return (
        <div className="question">
          {this.renderProgressBar()}
          <div className="bold font-32 question-text-4">
            A-levels
          </div>
          <div className="font-16 margin-bottom-1">
            You have suggested that your eventual degree course might come from one of the following (one/ two) categories.
          </div>
          <div className="font-16 margin-bottom-1">
            Now highlight the individual courses which most appeal to you. Choose up to three.
          </div>
          <div className="categories-container font-16">
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.First })} />
        </div>
      );
    } else if (this.state.subStep === SubStep.Second) {
      return (
        <div className="question">
          {this.renderProgressBar()}
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
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.First })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
          this.setState({ subStep: SubStep.Third });
        }}>Continue</button>
        </div>
      );
    }

    return (
      <div className="question">
        {this.renderProgressBar()}
        <div className="font-16">
          What you choose to do in the sixth form invariably affects your options if you want to continue into higher education.
        </div>
        <div className="bold font-32 question-text-4">
          From the answer you’ve given us, we think you are . . .
        </div>
        <div className="boxes-container font-20">
          <CheckBoxV2 currentChoice={2 as any} choice={null as any}
            label="someone who will only study A-levels and apply to study at university" setChoice={() => { }}
          />
          <CheckBoxV2 currentChoice={2 as any} choice={null as any}
            label="someone who may study a combination of A-level and Vocational Courses who may apply to study at university." setChoice={() => { }}
          />
          <CheckBoxV2 currentChoice={2 as any} choice={null as any}
            label="someone likely to study Vocational Courses only in the sixth form, who may go directly into work at eighteen, or an apprenticeship." setChoice={() => { }}
          />
        </div>
        <div className="font-16 white-blue">If you’ve changed your mind click the category above which best applies to you.</div>
        <BackButtonSix onClick={() => this.props.moveBack()} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          this.setState({ subStep: SubStep.Second });
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdQuestion;
