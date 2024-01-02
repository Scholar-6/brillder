import React, { Component } from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { SixthformSubject } from "services/axios/sixthformChoices";

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
  Arts
}

interface ThirdProps {
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

  renderStem() {
    if (this.state.hoveredCategory === Category.Stem) {
      return (
        <div className="hovered-category">
          <div className="bold font-16 h-title-r24">Traditional STEM <br /> degrees</div>
          <div className="font-14">
            For many science courses there is an expectation that you will have done A-level Maths.
          </div>
          <div className="lozengies-container font-11 first-lozengies">
            <div>Economics</div>
            <div>Geography</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Sociology</div>
            <div>Psychology</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex-center">
          <SpriteIcon name="stem-icon" />
        </div>
        <div className="bold">
          Traditional STEM <br /> degrees
        </div>
      </div>
    );
  }

  renderScience() {
    if (this.state.hoveredCategory === Category.Science) {
      return (
        <div className="hovered-category">
          <div className="bold font-16 h-title-r24">Interdisciplinary <br /> Sciences</div>
          <div className="font-14">
            Some subjects fuse scientific or statistical method with aspects of Humanities
          </div>
          <div className="lozengies-container font-11 first-lozengies">
            <div>Chemistry</div>
            <div>Mathematics</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Engineering</div>
            <div>Biology</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex-center">
          <SpriteIcon name="science-icon" />
        </div>
        <div className="bold">Interdisciplinary<br /> Sciences</div>
      </div>
    );
  }

  renderHumanities() {
    if (this.state.hoveredCategory === Category.Humanities) {
      return (
        <div className="hovered-category">
          <div className="bold font-16 h-title-r24">Traditional Humanities</div>
          <div className="lozengies-container font-11 first-lozengies">
            <div>History</div>
            <div>Politics</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Religion, Philosophy & Ethics</div>
          </div>
          <div className="lozengies-container font-11">
            <div>English Literature</div>
            <div>Law</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex-center">
          <SpriteIcon name="humanity-icon" />
        </div>
        <div className="bold">Traditional <br /> Humanities</div>
      </div>
    );
  }

  renderLanguages() {
    if (this.state.hoveredCategory === Category.Languages) {
      return (
        <div className="hovered-category">
          <div className="bold font-16 h-title-r24">Languages & Cultures</div>
          <div className="lozengies-container font-11">
            <div>Modern European Languages</div>
          </div>
          <div className="lozengies-container font-11">
            <div>French</div>
            <div>Spanish</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Eastern and Oriental Languages</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Mandarin</div>
            <div>Japanese</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Classical Languages</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Linguistics</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex-center">
          <SpriteIcon name="language-icon" />
        </div>
        <div className="bold">Languages & <br /> Cultures</div>
      </div>
    );
  }

  renderArts() {
    if (this.state.hoveredCategory === Category.Arts) {
      return (
        <div className="hovered-category">
          <div className="bold font-16 h-title-r24">Arts</div>
          <div className="lozengies-container font-11">
            <div>Performing Arts</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Fine Art </div>
            <div>Photography</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Film & Media </div>
            <div>Design</div>
          </div>
          <div className="lozengies-container font-11">
            <div>Music</div>
            <div>Dance</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex-center">
          <SpriteIcon name="arts-icon" />
        </div>
        <div className="bold">Arts</div>
      </div>
    );
  }

  renderStemCategory() {
    let className = "first";
    let category = this.state.categories.includes(Category.Stem);
    if (category) {
      className += " active";
    }
    return (
      <div
        className={className}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Stem })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Stem)}
      >
        {this.renderStem()}
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

    return (
      <div
        className={className}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Science })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Science)}
      >
        {this.renderScience()}
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

    return (
      <div
        className={className}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Humanities })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Humanities)}
      >
        {this.renderHumanities()}
      </div>
    );
  }

  renderLanguageCategory() {
    let className = "";
    let category = this.state.categories.includes(Category.Languages);

    if (category) {
      className += " active";
    }

    if (this.state.hoveredCategory === Category.Languages) {
      className += " start-f-r24";
    }

    return (
      <div
        className={className}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Languages })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Languages)}
      >
        {this.renderLanguages()}
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
      className += " start-f-r24";
    }

    return (
      <div
        className={className}
        onMouseEnter={() => this.setState({ hoveredCategory: Category.Arts })}
        onMouseLeave={this.leaveCategory.bind(this)}
        onClick={() => this.selectCategory(Category.Arts)}
      >
        {this.renderArts()}
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
        this.setState({ subStep: SubStep.Second });
      }}>Continue</button>
    );
  }

  render() {
    return (
      <div className="question">
        {this.renderProgressBar()}
        <div className="bold font-32 question-text-4">
          We think you are someone who will only study A-levels
        </div>
        <div className="font-16 margin-bottom-1">
          Most A-level students go to a university. Nobody expects you to know what degree you are going to do before you have even started the sixth form. However, it makes sense to think about what your strengths, weaknesses and interests are, because you can’t do some degrees without certain A-levels.
        </div>
        <div className="font-16 margin-bottom-1">
          First of all, let’s get a general impression of what type of degree you might pursue. Below are five broad categories. Select the one or two that you think you are most likely to fall into. Note that many very academic degrees, like Medicine and Architecture, are also vocational.
        </div>
        <div className="categories-container font-16">
          {this.renderStemCategory()}
          {this.renderScienceCategory()}
          {this.renderHumanityCategory()}
          {this.renderLanguageCategory()}
          {this.renderArtsCategory()}
        </div>
        <div className="absolute-back-btn" onClick={() => {
          this.props.moveBack();
        }}>
          <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-25">Previous</span>
        </div>
        {this.renderContinueBtn()}
      </div>
    );
  }
}

export default ThirdQuestion;
