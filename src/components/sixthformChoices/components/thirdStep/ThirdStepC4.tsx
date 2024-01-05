import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";
import { SixthformSubject } from "services/axios/sixthformChoices";


interface ThirdProps {
  subjects: SixthformSubject[];
  answer: any;
  onChange(answer: any): void;
}

interface ThirdQuestionState {
  subjects: any[];
  interestedSubjects: any[];
  quiteInterestedSubjects: any[];
  notInterestedSubjects: any[];
}

class ThirdQuestionSubStep5 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let sNames = ['Ancient History', 'Business',
      'Classical Civilisation',
      'Criminology',
      'Economics',
      'Film Studies',
      'History of Art',
      'Law',
      'Media Studies',
      'Philosophy',
      'Politics',
      'Psychology',
      'Sociology'
    ]

    let subjects = [];
    for (let sName of sNames) {
      let s = this.props.subjects.find(s => s.name === sName);
      if (s) {
        subjects.push(s);
      }
    }

    this.state = {
      subjects,
      interestedSubjects: [],
      quiteInterestedSubjects: [],
      notInterestedSubjects: [],
    }
  }

  setSubjects(subjects: any[]) {
    this.setState({ subjects });
  }

  updateSubjects(subjects: any[]) {
    this.setState({ subjects });
  }

  updateInterestedSubjects(interestedSubjects: any[]) {
    this.setState({ interestedSubjects });
  }

  updateQuiteInterestedSubjects(quiteInterestedSubjects: any[]) {
    this.setState({ quiteInterestedSubjects });
  }

  updateNotInterestedSubjects(notInterestedSubjects: any[]) {
    this.setState({ notInterestedSubjects });
  }

  renderSubjectBox(s: any) {
    return (
      <div className="drag-box-r23">
        <div className="drag-item-r23">{s.name}</div>
      </div>
    )
  }

  render() {
    const ReactSortableV1 = ReactSortable as any;

    return (
      <div className="drag-container-r23">
        <div className="container-r23 first font-12 bold">
          <div>
            <div className="sort-category-r23 font-16">
              Subjects
            </div>
            <div className="sort-category-list-container-r23">
              <ReactSortableV1
                list={this.state.subjects as any[]}
                animation={150}
                className="sortable-list-r23"
                group={{ name: "cloning-group-name" }}
                setList={(list: any[]) => this.updateSubjects(list)}
              >
                {this.state.subjects.map(s => this.renderSubjectBox(s))}
              </ReactSortableV1>
            </div>
          </div>
        </div>
        <div className="container-r23 second bold font-12">
          <div>
            <div className="sort-category-r23 font-16">
              Very Interested
            </div>
            <div className="sort-category-list-container-r23">
              <ReactSortableV1
                list={this.state.interestedSubjects as any[]}
                animation={150}
                className="sortable-list-r23"
                group={{ name: "cloning-group-name" }}
                setList={(list: any[]) => this.updateInterestedSubjects(list)}
              >
                {this.state.interestedSubjects.map(s => this.renderSubjectBox(s))}
              </ReactSortableV1>
            </div>
          </div>
        </div>
        <div className="container-r23 third bold font-12">
          <div>
            <div className="sort-category-r23 font-16">
              Quite Interested
            </div>
            <div className="sort-category-list-container-r23">
              <ReactSortableV1
                list={this.state.quiteInterestedSubjects as any[]}
                animation={150}
                className="sortable-list-r23"
                group={{ name: "cloning-group-name" }}
                setList={(list: any[]) => this.updateQuiteInterestedSubjects(list)}
              >
                {this.state.quiteInterestedSubjects.map(s => this.renderSubjectBox(s))}
              </ReactSortableV1>
            </div>
          </div>
        </div>
        <div className="container-r23 last bold font-12">
          <div>
            <div className="sort-category-r23 font-16">
              Not at all Interested
            </div>
            <div className="sort-category-list-container-r23">
              <ReactSortableV1
                list={this.state.notInterestedSubjects as any[]}
                animation={150}
                className="sortable-list-r23"
                group={{ name: "cloning-group-name" }}
                setList={(list: any[]) => this.updateNotInterestedSubjects(list)}
              >
                {this.state.notInterestedSubjects.map(s => this.renderSubjectBox(s))}
              </ReactSortableV1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdQuestionSubStep5;
