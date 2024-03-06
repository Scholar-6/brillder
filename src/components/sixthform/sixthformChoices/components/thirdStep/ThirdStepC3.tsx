import SpriteIcon from "components/baseComponents/SpriteIcon";
import React, { Component } from "react";
import ProgressBarStepsR1 from "../progressBar/ProgressBarStepsR1";
import BackButtonSix from "../BackButtonSix";


interface ThirdProps {
  answer: any;
  onChange(answer: any): void;
  moveNext(): void;
  moveBack(): void;
}

enum ThirdC3Status {
  None,
  True,
  False,
  BETWEEN
}

export interface ThirdC3Category {
  boldText: string;
  text: string;
  helpText: string;
  status: ThirdC3Status;
}

interface ThirdQuestionState {
  step: number;
  categories: ThirdC3Category[];
}

class ThirdStepC3 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let categories = [{
      boldText: "English Language",
      text: "“The A-Level is very unlike GCSE English Language and has much more to do with linguistics than, for example, creative writing.”",
      helpText: 'This is true.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Further Mathematics",
      text: "“The decision around whether to choose Further Maths should be more about your love of the subject than your ability. In fact, doing the additional A-Level makes the normal A-Level content easier because you get more time to spend on it.”",
      helpText: 'This is not true. You’ll need a 9, or maybe an 8, at GCSE to do Further Maths, which plays well with leading universities if you want to take a STEM degree. You also need to be able to cover the ordinary A-level content faster.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Computer Science",
      text: "“Having done the GCSE helps, but you don’t need the GCSE if you’re a fairly natural tecchie - i.e. you’re a keen coder and feel you have the making of a developer.”",
      helpText: 'This is true. You will quickly find yourself out of your depth doing A-level Computer Science if you don’t have some idea of coding or take to it very naturally because you have strong maths and logic skills.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Engineering",
      text: "“There is no Engineering A-level, but Design & Technology has some engineering content.  A large number of Physics and Maths students opt to do a BTEC in Engineering, which is highly regarded by universities and employers.”",
      helpText: 'This is true. But you can get onto a university engineering course with good Physics and Maths A-Levels if your school or college does not offer an engineering qualification.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Sport & Physical Education, Dance, Music, Theatre Studies",
      text: "“It’s better to do the A-level than take a vocational equivalent in these subjects”",
      helpText: 'There’s some truth in this if you’re planning to apply to a university (and because some VAPs are being phased out). But vocational courses often afford more time on practical components (many are equivalent to more than one A-Level), which means you achieve greater proficiency.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Modern Languages",
      text: "“The vocab and grammar learned at GCSE is essential before doing a language A-level.”",
      helpText: 'Generally true, but a proportion of A-level students doing languages (from Arabic to Panjabi to Polish) have some dual language fluency, so may not need the GCSE. And a small number of really good linguists deliberately choose a new, unfamiliar language for A-level.',
      status: ThirdC3Status.None,
    }];

    if (props.answer && props.answer.categories && props.answer.categories.length > 0) {
      categories = props.answer.categories;
    }

    this.state = {
      step: 0,
      categories,
    }
  }

  renderSBox() {
    
  }

  renderBox(category: ThirdC3Category) {
    let className = "font-12 combo-block-c3-r23";

    let isCorrect = false;

    if (category.boldText === 'Further Mathematics') {
      if (category.status === ThirdC3Status.None) {
      } else if (category.status === ThirdC3Status.False) {
        isCorrect = true;
        className += " green";
      } else {
        className += " red";
      }
    }

    if (category.boldText === "English Language" || category.boldText === "Computer Science" || category.boldText === "Engineering") {
      if (category.status === ThirdC3Status.None) {
      } else if (category.status === ThirdC3Status.True) {
        isCorrect = true;
        className += " green";
      } else {
        className += " red";
      }
    }

    if (category.boldText === "Modern Languages" || category.boldText === "Sport & Physical Education, Dance, Music, Theatre Studies") {
      if (category.status === ThirdC3Status.None) {
      } else if (category.status === ThirdC3Status.BETWEEN) {
        isCorrect = true;
        className += " green";
      } else {
        className += " red";
      }
    }

    return (
      <div className="font-12 combo-block-c3-r23">
        <div className="text-block-c3-r23">
          <div className="page-number-r1023 font-14">{this.state.step + 1}/{this.state.categories.length}</div>
          <div className="bold text-center font-24">{category.boldText}</div>
          <div className="text-center font-16">{category.text}</div>
        </div>
        <div className="icons-block-c3-r23">
          <div
            className={(category.status == ThirdC3Status.True && isCorrect)
              ? "green-active clickable bold flex-center"
              : category.status == ThirdC3Status.True ? "red-active clickable flex-center bold" : " clickable flex-center bold"
            }
            onClick={() => {
              category.status = ThirdC3Status.True;
              this.setState({ categories: this.state.categories });
              this.props.onChange({ categories: this.state.categories });
            }}
          >
            <div>
              <div className="flex-center">
                <SpriteIcon name="thumb-up-3c3" />
              </div>
              <div className="text-center font-20">TRUE</div>
            </div>
          </div>
          <div
            className={
              `flex-center ${(category.status == ThirdC3Status.BETWEEN && isCorrect) ? "green-active" : category.status == ThirdC3Status.BETWEEN ? "red-active" : ""}`
            }
            onClick={() => {
              category.status = ThirdC3Status.BETWEEN;
              this.setState({ categories: this.state.categories });
              this.props.onChange({ categories: this.state.categories });
            }}>
            <div>
              <div className="flex-center">
                <SpriteIcon name="circled-question-icon-v1" />
              </div>
              <div className="text-cente bold font-20">IN BETWEEN</div>
            </div>
          </div>
          <div
            className={
              (category.status == ThirdC3Status.False && isCorrect)
                ? "green-active flex-center clickable bold"
                : (category.status == ThirdC3Status.False) ? "red-active flex-center clickable bold" : "flex-center clickable bold"
            }
            onClick={() => {
              category.status = ThirdC3Status.False;
              this.setState({ categories: this.state.categories });
              this.props.onChange({ categories: this.state.categories });
            }}
          >
            <div>
              <div className="flex-center">
                <SpriteIcon name="thumb-down-3c3" />
              </div>
              <div className="text-center font-20">FALSE</div>
            </div>
          </div>
        </div>
        {category.status !== ThirdC3Status.None && <div className="help-text text-center font-16">{category.helpText}</div>}
      </div>
    );
  }


  render() {
    let category = this.state.categories[this.state.step];
    return (
      <div>
        <div className="bold font-32 question-text-3">
          Common Misunderstandings
        </div>
        <div className="font-16 margin-text-c3">
          There are a few A-Levels which need careful thought because there may be more to them than first meets the eye. Decide whether<br />
          the statement which follows each of the following subjects is ‘TRUE’, ‘FALSE’ or ‘SOMEWHERE IN BETWEEN’.
        </div>
        <ProgressBarStepsR1 step={this.state.step} total={this.state.categories.length} />
        <div className="tick-container-c3-r23">
          {this.renderBox(category)}
        </div>
        <BackButtonSix onClick={() => {
          if (this.state.step > 0) {
            this.setState({ step: this.state.step - 1 });
          } else {
            this.props.moveBack();
          }
        }} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          if (this.state.step < this.state.categories.length - 1) {
            this.setState({ step: this.state.step + 1 });
          } else {
            this.props.moveNext();
          }
        }}>Continue</button>
      </div>
    );
  }
}

export default ThirdStepC3;
