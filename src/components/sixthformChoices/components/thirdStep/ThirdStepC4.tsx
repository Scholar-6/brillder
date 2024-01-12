import SpriteIcon from "components/baseComponents/SpriteIcon";
import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";
import { SixthformSubject } from "services/axios/sixthformChoices";

interface ThirdCategoriesC4 {
  subjects: any[];
  interestedSubjects: any[];
  quiteInterestedSubjects: any[];
}

interface ThirdProps {
  subjects: SixthformSubject[];
  categoriesC4: ThirdCategoriesC4;
  onSkip(): void;
  onChange(answer: any): void;
}

interface ThirdQuestionState {
  subjects: any[];
  interestedSubjects: any[];
  quiteInterestedSubjects: any[];
}

class ThirdStepC4 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let sNames = [
      'Ancient History',
      'Business',
      'Classical Civilisation',
      'Computer Science',
      'Design & Technology',
      'Dance',
      'Economics',
      'English Language',
      'Environmental Science',
      'Film Studies',
      'Further Mathematics',
      'History of Art',
      'Law',
      'Media Studies',
      'Philosophy',
      'Physical Education',
      'Politics',
      'Psychology',
      'Sociology',
      'Other Modern Language',
    ];

    let subjects = [];
    for (let sName of sNames) {
      let s = this.props.subjects.find(s => s.name === sName);
      if (s) {
        subjects.push(s);
      }
      if (sName === 'Other Modern Language') {
        console.log(this.props.subjects);
        let modernLanguages = [];
        const langNames = [
          "Arabic", "Bengali", "Chinese (Mandarin)", "Modern Greek", "Irish", "Gujarati",
          "Modern Hebrew", "Japanese", "Panjabi", "Persian", "Polish",
          "Portuguese", "Russian", "Turkish", "Urdu", "Welsh"
        ];

        for (const langName of langNames) {
          const subject1 = this.props.subjects.find((s) => s.name === langName);
          modernLanguages.push(subject1);
        }

        subjects.push({
          isOtherModernLanguage: true,
          name: sName,
          subjects: modernLanguages,
        })
      }
    }

    let interestedSubjects: any[] = [];
    let quiteInterestedSubjects: any[] = [];

    /*
    if (props.categoriesC4) {
      let categoriesC4 = props.categoriesC4;
      if (categoriesC4.subjects) {
        subjects = categoriesC4.subjects;
      }
      if (categoriesC4.interestedSubjects) {
        interestedSubjects = categoriesC4.interestedSubjects;
      }
      if (categoriesC4.quiteInterestedSubjects) {
        quiteInterestedSubjects = categoriesC4.quiteInterestedSubjects;
      }
    }*/

    this.state = {
      subjects,
      interestedSubjects,
      quiteInterestedSubjects
    }
  }

  setSubjects(subjects: any[]) {
    this.setState({ subjects });
  }

  onChange() {
    this.props.onChange({
      subjects: this.state.subjects,
      interestedSubjects: this.state.interestedSubjects,
      quiteInterestedSubjects: this.state.quiteInterestedSubjects,
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

  renderSubjectBox(s: any, i: number) {
    if (s.isOtherModernLanguage === true) {
      return (
        <div className={`drag-box-r23 other-language ${s.expanded ? 'expanded' : ''}`} key={i}>
          <div className="drag-item-r23">
            <div className="other-language-label" onClick={() => {
              s.expanded = !s.expanded;
              this.setState({ subjects: this.state.subjects });
            }}>
              <SpriteIcon name="arrow-right" />
              {s.name}
            </div>
            {s.expanded && s.subjects.map((s: any) => <div className="subject-left">
              <div>
                {s.name}
              </div>
            </div>)}
          </div>
        </div>
      );
    }
    return (
      <div className="drag-box-r23" key={i}>
        <div className="drag-item-r23">{s.name}</div>
      </div>
    );
  }

  render() {
    const ReactSortableV1 = ReactSortable as any;

    return (
      <div>
        <div className="bold font-32 question-text-3">
          What YOU think
        </div>
        <div className="font-16">
          Now consider whether you are genuinely interested in taking any of these subjects - all of which can be commenced in the sixth form. (Note that it’s also the case that none of them are absolutely essential in order to apply for a university degrees in the subject.)<br />
          Sort them into one of the three categories:
        </div>
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
                  {this.state.subjects.map(this.renderSubjectBox.bind(this))}
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
                  {this.state.interestedSubjects.map(this.renderSubjectBox.bind(this))}
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
                  {this.state.quiteInterestedSubjects.map(this.renderSubjectBox.bind(this))}
                </ReactSortableV1>
              </div>
            </div>
          </div>
          {this.state.interestedSubjects.length === 0 && this.state.quiteInterestedSubjects.length === 0 && (
            <div className="container-r23 last bold font-16">
              <div>
                <div>I’m currently not interested in <br /> any of these subjects</div>
                <div className="skip-btn-container font-14"><div onClick={this.props.onSkip}>Skip</div></div>
              </div>
            </div>)}
        </div>
        <div className="font-16 bottom-text-r23">
          You can always try a taster lesson/ topic / brick in any of the above subjects you are interested in.
        </div>
      </div>
    );
  }
}

export default ThirdStepC4;
