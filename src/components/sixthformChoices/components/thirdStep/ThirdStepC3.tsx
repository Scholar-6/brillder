import SpriteIcon from "components/baseComponents/SpriteIcon";
import React, { Component } from "react";


interface ThirdProps {
  answer: any;
  onChange(answer: any): void;
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
  status: ThirdC3Status;
}

interface ThirdQuestionState {
  categories: ThirdC3Category[];
}

class ThirdStepC3 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let categories = [{
      boldText: "English Language",
      text: " - “The A Level is very unlike GCSE English Language and has much more to do with linguistics than, for example, creative writing or literature.”",
      status: ThirdC3Status.None,
    }, {
      boldText: "Further Mathematics",
      text: " - “The decision around whether to choose Further Maths should be more about your love of the subject than your ability. In fact, doing the additional A Level makes the normal A Level content easier because you get more time to spend on it.”",
      status: ThirdC3Status.None,
    }, {
      boldText: "Computer Science",
      text: "- “Having done the GCSE helps, but you don’t need the GCSE if you’re a fairly natural tecchie - i.e. you’re a keen coder and feel you have the making of a developer.”",
      status: ThirdC3Status.None,
    }, {
      boldText: "Engineering",
      text: " - “There is no Engineering A-level, Design & Technology has some Engineering content.  A large number of Physics and Maths students opt to do a BTEC in Engineering which is highly regarded by universities and employers.”",
      status: ThirdC3Status.None,
    }, {
      boldText: "Physical Education, Dance, Music, Performing Arts",
      text: " - “It’s better to do the A-level than take a vocational equivalent in these subjects”",
      status: ThirdC3Status.None,
    }, {
      boldText: "Minor Modern Languages",
      text: " - “The vocab and grammar learned at GCSE is essential before doing a language A-level.”",
      status: ThirdC3Status.None,
    }];

    if (props.answer && props.answer.categories && props.answer.categories.length > 0) {
      categories = props.answer.categories;
    }

    this.state = {
      categories,
    }
  }

  renderBox(category: ThirdC3Category) {
    return (
      <div className="font-12 combo-block-c3-r23">
        <div className="text-block-c3-r23">
          <span className="bold">{category.boldText}</span> {category.text}
        </div>
        <div className="icons-block-c3-r23">
          <div
            className={category.status == ThirdC3Status.True ? "green-active clickable bold" : "not-active clickable bold"}
            onClick={() => {
              category.status = ThirdC3Status.True;
              this.setState({ categories: this.state.categories });
              this.props.onChange({ categories: this.state.categories });
            }}
          >TRUE</div>

          <SpriteIcon
            name="circled-question-icon-v1"
            className={category.status == ThirdC3Status.BETWEEN ? "orange" : "not-active"}
            onClick={() => {
              category.status = ThirdC3Status.BETWEEN;
              this.setState({ categories: this.state.categories });
              this.props.onChange({ categories: this.state.categories });
            }}
          />
          <div
            className={category.status == ThirdC3Status.False ? "red-active clickable bold" : "not-active clickable bold"}
            onClick={() => {
              category.status = ThirdC3Status.False;
              this.setState({ categories: this.state.categories });
              this.props.onChange({ categories: this.state.categories });
            }}
          >FALSE</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="bold font-32 question-text-3">
          Curve Balls
        </div>
        <div className="font-16 margin-text-c3">
          There are a few A Levels which need careful thought because there may be more to them than first meets the eye. Decide whether the statement which follows each of the following subjects is ‘TRUE’, ‘FALSE’ or ‘SOMEWHERE IN BETWEEN’.
        </div>
        <div className="tick-container-c3-r23">
          <div>
            <div className="font-16 bold">
              Tick your answer on the right for the following statements!
            </div>
            <div className="scrollbox-c3-r23">
              {this.state.categories.map((category, i) => {
                return this.renderBox(category);
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdStepC3;
