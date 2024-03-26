import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";


interface ThirdProps {
  pairAnswers: any[];
  onChange(pairAnswers: any[]): void;
}

interface ThirdQuestionState {
  subjects: any[];
  answers: any[];
}

class FifthStepA extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subjects = [{
      correctIndex: 0,
      name: "Scientific Disciplines",
      subName: "(e.g. medicine or engineering)"
    }, {
      correctIndex: 1,
      name: "Building Trades, Skilled Industry & Manufacturing",
      subName: "(e.g. electrician, automotive maintenance)"
    }, {
      correctIndex: 2,
      name: "Discursive, Managerial and Strategic ",
      subName: "(e.g. law, media, advertising, HR, civil service)"
    }, {
      correctIndex: 3,
      name: "Creative, Performative & Craft",
      subName: "(e.g. photography, fashion design)"
    }, {
      correctIndex: 4,
      name: "Commercial Disciplines",
      subName: "(e.g. accountancy, insurance, finance, share trading)"
    }, {
      correctIndex: 5,
      name: "Secondary Teaching and Academia",
      subName: "(secondary school and university posts)"
    }, {
      correctIndex: 6,
      name: "Skilled roles in health, social care, public service ",
      subName: "(e.g. nursing, social work, uniformed services)"
    }];

    if (this.props.pairAnswers && this.props.pairAnswers.length > 0) {
      subjects = this.props.pairAnswers;
    }

    let answers = [{
      name: "almost invariably require Maths & Science A-levels, usually to a high standard"
    }, {
      name: "require vocational qualifications and, often, apprenticeships"
    }, {
      name: "often follow from prestigious academic degrees well-disposed to A-levels in ‘essay subjects’"
    }, {
      name: "expect training in specific artistic, technical and digital skills (e.g. drawing, dance, CAD )"
    }, {
      name: "strongly favour Maths and well-disposed towards Business, Economics etc."
    }, {
      name: "high proficiency in subject specialisms and post-graduate training or additional degrees"
    }, {
      name: "require vocational training but recruit from a wide range of post-16 and degree courses"
    }];

    this.state = {
      subjects,
      answers
    }
  }

  setSubjects(subjects: any[]) {
    this.setState({ subjects });
  }

  render() {
    return (
      <div className="drag-container-r22">
        <div className="title-r22 bold font-16">
          Drag to match the categories to their sixth form expectations
        </div>
        <div className="container-r22">
          <div className="left-part-r22">
            <ReactSortable
              list={this.state.subjects}
              animation={150}
              group={{ name: "cloning-group-name", pull: "clone" }}
              setList={newSubjects => {
                this.props.onChange(newSubjects);
                this.setState({ subjects: newSubjects });
              }}
            >
              {this.state.subjects.map((subject: any, i: number) => {
                return (
                  <div className="drag-boxv2-r22">
                    <div className="drag-box-r22">
                      <div className="drag-item-r22 bold font-12" key={i + 1}>
                        {subject.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </ReactSortable>
          </div>
          <div className="right-part-r22">
            {this.state.answers.map((answer: any, i: number) => {
              return (
                <div className="answer-item-r22 font-12" key={i + 1}>
                  {answer.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default FifthStepA;
