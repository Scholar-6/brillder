import { notDeepStrictEqual } from "assert";
import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";
import { SixthformSubject } from "services/axios/sixthformChoices";

interface ThirdCategoriesC4 {
  subjects: any[];
  interestedSubjects: any[];
  quiteInterestedSubjects: any[];
  notInterestedSubjects: any[];
}

interface ThirdProps {
  subjects: SixthformSubject[];
  answer: {
    categoriesC4: ThirdCategoriesC4;
  };
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

    let interestedSubjects: any[] = [];
    let quiteInterestedSubjects: any[] = [];
    let notInterestedSubjects: any[] = [];

    if (props.answer) {
      let categoriesC4 = props.answer.categoriesC4;
      if (categoriesC4 && categoriesC4.subjects && categoriesC4.interestedSubjects && categoriesC4.quiteInterestedSubjects) {
        subjects = categoriesC4.subjects;
        interestedSubjects = categoriesC4.interestedSubjects;
        quiteInterestedSubjects = categoriesC4.quiteInterestedSubjects;
        notInterestedSubjects = categoriesC4.notInterestedSubjects;
      }
    }

    this.state = {
      subjects,
      interestedSubjects,
      quiteInterestedSubjects,
      notInterestedSubjects,
    }
  }

  setSubjects(subjects: any[]) {
    this.setState({ subjects });
  }

  onChange() {
    this.props.onChange({
      categoriesC4: {
        subjects: this.state.subjects,
        interestedSubjects: this.state.interestedSubjects,
        quiteInterestedSubjects: this.state.quiteInterestedSubjects,
        notInterestedSubjects: this.state.notInterestedSubjects,
      }
    })
  }

  updateSubjects(subjects: any[]) {
    this.setState({ subjects });
    this.onChange();
  }

  updateInterestedSubjects(interestedSubjects: any[]) {
    this.setState({ interestedSubjects });
    this.onChange();
  }

  updateQuiteInterestedSubjects(quiteInterestedSubjects: any[]) {
    this.setState({ quiteInterestedSubjects });
    this.onChange();
  }

  updateNotInterestedSubjects(notInterestedSubjects: any[]) {
    this.setState({ notInterestedSubjects });
    this.onChange();
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
        <div className="container-r23 last bold font-16">
          <div>
            <div>I’m currently not interested in <br/> any of these subjects</div>
            <div className="skip-btn-container font-14"><div onClick={() => {}}>Skip</div></div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdQuestionSubStep5;
