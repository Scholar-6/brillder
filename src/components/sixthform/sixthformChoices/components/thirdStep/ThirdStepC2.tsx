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

class ThirdStepC2 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let subjects = [{
      correctIndex: 0,
      name: "Ancient History"
    }, {
      correctIndex: 1,
      name: "Law"
    }, {
      correctIndex: 2,
      name: "Film Studies"
    }, {
      correctIndex: 3,
      name: "Media Studies"
    }, {
      correctIndex: 4,
      name: "Classical Civilisation"
    }, {
      correctIndex: 5,
      name: "Philosophy"
    }, {
      correctIndex: 6,
      name: "History of Art"
    }];

    subjects = shuffle(subjects);

    if (this.props.pairAnswers && this.props.pairAnswers.length > 0) {
      subjects = this.props.pairAnswers;
    }

    let answers = [{
      name: "I did History GCSE and considered A-level but I’ve always been drawn to the distant pre-Christian era. I loved studying Roman Britain and visited several sites. It made me interested in archaeology as a degree course."
    }, {
      name: "Although I’d love to be an advocate, I know the A-level doesn’t give you an edge applying for uni or professional training. But legal history and the concepts are so interesting - and the course is more rigorous than the Criminology diploma."
    }, {
      name: "I considered Media Studies but I liked the focus on purely one form and the practical opportunities to shoot and edit my own material. I am a huge fan of directors like Martin Scorsese and Jane Campion."
    }, {
      name: "With digital streaming we’re now constantly immersed in news, video gaming, social media and apps for everything: Media Studies is the most relevant subject to my life and I am really interested in content creation and modern advertising and marketing as careers."
    }, {
      name: "I knew very little Latin and no Greek but all the texts are in translation. I particularly enjoyed the epic literature and the material on the nature of Athenian democracy and the politics of Rome."
    }, {
      name: "I was intrigued by the course - the nature of knowledge, the nature of morality and debates around the existence of God. I did RS at GCSE so some of the ideas were familiar, but I think philosophy offers a broader, more objective approach to the big questions of life."
    }, {
      name: "I enjoy analysing poems in English A-level and looking at a painting closely requires a similar approach. I also did GCSE Art, so I feel it complements both and plays to my creative and essay-writing strengths."
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
      <div className="question-step-3c2">
        <div className="bold font-32 question-text-3">
          New Subjects
        </div>
        <div className="font-16">
          Here are a few more subjects which are often new to students who begin them in the sixth form: Match the correct courses to the comments of students who chose them.
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

export default ThirdStepC2;
