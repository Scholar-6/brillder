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
  helpText: string;
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
      helpText: 'The A Level is unlike GCSE English Language and has much more to do with linguistics than, for example, creative writing or literature.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Further Mathematics",
      text: " - “The decision around whether to choose Further Maths should be more about your love of the subject than your ability. In fact, doing the additional A Level makes the normal A Level content easier because you get more time to spend on it.”",
      helpText: 'This is not true. You’ll need a 9, or maybe an 8, at GCSE to do Further Maths, which plays well with leading universities if you want to take a STEM degree. You also need to be able to cover the ordinary A-level content faster.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Computer Science",
      text: "- “Having done the GCSE helps, but you don’t need the GCSE if you’re a fairly natural tecchie - i.e. you’re a keen coder and feel you have the making of a developer.”",
      helpText: 'This is true. You will quickly find yourself out of your depth doing A-level Computer Science if you don’t have some idea of coding or take to it very naturally because you have strong maths and logic skills.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Engineering",
      text: " - “There is no Engineering A-level, Design & Technology has some Engineering content.  A large number of Physics and Maths students opt to do a BTEC in Engineering which is highly regarded by universities and employers.”",
      helpText: 'This is true. But you can get onto a university Engineering course with good Physics and Maths A Levels if your school or college does not offer an Engineering qualification.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Sport & Physical Education, Dance, Music, Theatre Studies",
      text: " - “It’s better to do the A-level than take a vocational equivalent in these subjects”",
      helpText: 'There’s some truth in this if you’re planning to apply to a university (and because some VAPs are being phased out). But vocational courses often afford more time on practical components (many are equivalent to more than one A level), which means you achieve greater proficiency.',
      status: ThirdC3Status.None,
    }, {
      boldText: "Modern Languages",
      text: " - “The vocab and grammar learned at GCSE is essential before doing a language A-level.”",
      helpText: 'Generally true, but a proportion of A-level students doing languages (from Arabic to Panjabi to Polish) have some dual language fluency, so may not need the GCSE. And a small number of really good linguists deliberately choose a new, unfamiliar language for A-level.',
      status: ThirdC3Status.None,
    }];

    console.log(props.answer);

    if (props.answer && props.answer.categories && props.answer.categories.length > 0) {
      categories = props.answer.categories;
    }

    this.state = {
      categories,
    }
  }

  renderBox(category: ThirdC3Category, i: number) {
    let className="font-12 combo-block-c3-r23";

    if (category.boldText === 'Further Mathematics') {
      if (category.status === ThirdC3Status.None) {
      }else if (category.status === ThirdC3Status.False) {
        className += " green";
      } else {
        className += " red";
      }
    }

    if (category.boldText === "English Language" || category.boldText === "Computer Science" || category.boldText === "Engineering") {
      if (category.status === ThirdC3Status.None) {
      } else if (category.status === ThirdC3Status.True) {
        className += " green";
      } else {
        className += " red";
      }
    }
    if (category.boldText === "Modern Languages" || category.boldText === "Sport & Physical Education, Dance, Music, Theatre Studies") {
      if (category.status === ThirdC3Status.None) {
      } else if (category.status === ThirdC3Status.BETWEEN) {
        className += " green";
      } else {
        className += " red";
      }
    }

    return (
      <div className={className} key={i}>
        <div className="text-block-c3-r23">
          <span className="bold">{category.boldText}</span> {category.text}
          {category.status !== ThirdC3Status.None && <div className="help-text">{category.helpText}</div>}
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
              {this.state.categories.map(this.renderBox.bind(this))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdStepC3;
