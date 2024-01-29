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

class ThirdStepE extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subjects = [{
      correctIndex: 0,
      name: "Criminology"
    }, {
      correctIndex: 1,
      name: "Forensic Science"
    }, {
      correctIndex: 2,
      name: "Production Arts"
    }, {
      correctIndex: 3,
      name: "eSports"
    }, {
      correctIndex: 4,
      name: "Uniformed Services"
    }];

    subjects = shuffle(subjects);

    if (this.props.pairAnswers && this.props.pairAnswers.length > 0) {
      subjects = this.props.pairAnswers;
    }

    let answers = [{
      name: "A multi-disciplinary field which draws on psychology, sociology and statistics to evaluate criminal behaviour and the policing, justice and penal systems."
    }, {
      name: "A comprehensive multi-disciplinary course examining chemical, physical and biological techniques to acquire and analyse evidence relevant to criminal trials."
    }, {
      name: "The skills in making theatre (or film) productions happen, from costume and make-up to lighting and sound, from set design and scheme painting to and creating and managing props"
    }, {
      name: "Gaming is a rapidly growing industry as are the lucrative arenas in which top players now compete. This course develops commercial and marketing and teamwork skills alongside game design and	development."
    }, {
      name: "This course instils qualities of leadership, fitness, teamwork under pressure and a taste for adventure. Students often progress to university or into the armed forces, the police, ambulance or fire service as well as roles in private security and border control."
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
      <div className="question-step-3e">
        <div className="bold font-32 question-text-3">
          VAPs
        </div>
        <div className="font-16">
          Here are five VAPs which you may need to understand a little better before.
        </div>
        <div className="font-16">
          Already ruled out all the subjects below? Skip to the next question.
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

export default ThirdStepE;
