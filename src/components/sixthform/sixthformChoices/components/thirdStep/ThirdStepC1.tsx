import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";
import { shuffle } from "../../services/shuffle";


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
    }];

    subjects = shuffle(subjects);

    if (this.props.pairAnswers && this.props.pairAnswers.length > 0) {
      subjects = this.props.pairAnswers;
    }

    let answers = [{
      name: "the scientific study of the mind and behaviour, including brain function, decision making, gender differences and child development"
    }, {
      name: "the study of how society is organised, including issues such as class, crime, the family, culture, gender and identity"
    }, {
      name: "combines elements of accountancy, finance, marketing, economics, management, human resources, and commercial operations"
    }, {
      name: "examines data and statistics around resources, the production of goods and services, and the trends affecting the cost of living, inflation, taxation etc."
    }, {
      name: "explores ideologies, policies, constitutions, elections, the legislative process, interest groups and how governments conduct diplomacy, trade and conflict"
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
      <div className="question-step-3c1">
        <div className="bold font-32 question-text-3">
          New Subjects
        </div>
        <div className="font-16">
          Some subjects are rarely studied before the sixth form. See if you understand what they involve - could any be a fit for you?
        </div>
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
                  let correct = false;
                  if (subject.correctIndex === i) {
                    correct = true;
                  }
                  
                  return (
                    <div className={`drag-boxv2-r22 drag-boxv3-r22 ${correct ? 'correct' : ''}`} key={i}>
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
                let correct = false;
                let subject = this.state.subjects[i];
                if (subject.correctIndex === i) {
                  correct = true;
                }
                return (
                  <div className={`answer-item-r22 answer-item-v3r22 font-12 ${correct ? 'correct' : ''}`} key={i + 1}>
                    {answer.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdStepC1;
