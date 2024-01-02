import React, { Component } from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { SixthformSubject } from "services/axios/sixthformChoices";

enum SubStep {
  First,
  Second,
  Third,
  Fourth
}

interface ThirdProps {
  answer: any;
  subjects: SixthformSubject[];
  moveNext(answer: any): void;
  moveBack(): void;
}

interface ThirdQuestionState {
  subStep: SubStep;
}

class ThirdQuestion extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    this.state = {
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
        this.props.moveNext({ });
      }}>Continue</button>
    )
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
        <div className="categories-container bold font-16">
          <div className="first">
            <div>
              <div className="flex-center">
                <SpriteIcon name="stem-icon" />
              </div>
              <div>
                Traditional STEM <br/> degrees
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className="flex-center">
                <SpriteIcon name="science-icon" />
              </div>
              <div>Interdisciplinary<br/> Sciences</div>
            </div>
          </div>
          <div>
            <div>
              <div className="flex-center">
                <SpriteIcon name="humanity-icon" />
              </div>
              <div>Traditional <br/> Humanities</div>
            </div>
          </div>
          <div>
            <div>
              <div className="flex-center">
                <SpriteIcon name="language-icon" />
              </div>
              <div>Languages & <br/> Cultures</div>
            </div>
          </div>
          <div className="last">
            <div>
              <div className="flex-center">
                <SpriteIcon name="arts-icon" />
              </div>
              <div>Arts</div>
            </div>
          </div>
        </div>
        <div className="absolute-back-btn" onClick={() => {
          this.props.moveBack();
        }}>
          <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7L7 13" stroke="#4C608A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-25">Previous</span>
        </div>
        <button className="absolute-contunue-btn font-24" onClick={() => {
          this.setState({ subStep: SubStep.Second });
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdQuestion;
