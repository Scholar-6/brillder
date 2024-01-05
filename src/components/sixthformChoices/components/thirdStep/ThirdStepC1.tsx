import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";
import {shuffle} from "../../services/shuffle";


interface ThirdProps {
  pairAnswers: any[];
  onChange(pairAnswers: any[]): void;
}

interface ThirdQuestionState {
  subjects: any[];
  answers: any[];
}

class ThirdStepC1 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subjects = [{
      correctIndex: 0,
      name: "Psychology"
    }, {
      correctIndex: 1,
      name: "Sociology"
    }, {
      correctIndex: 2,
      name: "Business"
    }, {
      correctIndex: 3,
      name: "Economics"
    }, {
      correctIndex: 4,
      name: "Politics"
    }, {
      correctIndex: 5,
      name: "Criminology"
    }];

    subjects = shuffle(subjects);

    console.log('pairAnswers', this.props.pairAnswers);

    if (this.props.pairAnswers && this.props.pairAnswers.length > 0) {
      subjects = this.props.pairAnswers;
    }

    let answers = [{
      name: "the scientific study of the mind and behaviour, including brain function, decision making, gender differences and child development"
    }, {
      name: "how society is organised and how it changes, including the ways it responds to and manifests, crime, culture, media, politics and identity"
    }, {
      name: "combines elements of accountancy, finance, marketing, economics, management, human resources, and commercial operations"
    }, {
      name: "examines data and statistics around resources, the production of goods and services, and the trends affecting the cost of living, inflation, taxation etc."
    }, {
      name: "explores ideologies, policies, constitutions, elections, the legislative process, interest groups and how governments conduct diplomacy, trade and conflict"
    }, {
      name: "a multi-disciplinary field which draws on psychology, sociology and statistics to evaluate criminal behaviour and the policing, justice and penal systems"
    }]

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
          Drag the subjects to match them with the right description!
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
                  <div className="drag-boxv2-r22" key={i}>
                    <div className="drag-box-r22">
                      <div className="drag-item-r22 bold font-12">
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

export default ThirdStepC1;
