import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";
import { SixthformSubject } from "services/axios/sixthformChoices";
import BackButtonSix from "../BackButtonSix";
import NextButtonSix from "../NextButtonSix";
import { isPhone } from "services/phone";

interface ThirdCategoriesC4 {
  subjects: any[];
  modernLanguagesExpanded: boolean;
  interestedSubjects: any[];
  modernLanguages: any[];
  quiteInterestedSubjects: any[];
}

interface ThirdProps {
  subjects: SixthformSubject[];
  categoriesC4: ThirdCategoriesC4;
  moveNext(): void;
  moveBack(): void;
  onChange(answer: any): void;
}

interface ThirdQuestionState {
  subjects: any[];
  modernLanguagesExpanded: boolean;
  modernLanguages: any[];
  interestedSubjects: any[];
  quiteInterestedSubjects: any[];
}

class ThirdStepC4 extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    let modernLanguages: any[] = [];

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
    ];

    let subjects = [];
    for (let sName of sNames) {
      let s = this.props.subjects.find(s => s.name === sName);
      if (s) {
        subjects.push(s);
      }
    }

    console.log('subjects', subjects);

    const langNames = [
      "Arabic", "Bengali", "Chinese (Mandarin)", "Modern Greek", "Irish", "Gujarati",
      "Modern Hebrew", "Japanese", "Panjabi", "Persian", "Polish",
      "Portuguese", "Russian", "Turkish", "Urdu", "Welsh"
    ];

    for (const langName of langNames) {
      const subject1 = this.props.subjects.find((s) => s.name === langName);
      if (subject1) {
        modernLanguages.push(subject1);
      }
    }

    let modernLanguagesExpanded = false;
    let interestedSubjects: any[] = [];
    let quiteInterestedSubjects: any[] = [];

    if (props.categoriesC4) {
      let categoriesC4 = props.categoriesC4;
      if (categoriesC4.subjects) {
        //subjects = categoriesC4.subjects;
      }
      if (categoriesC4.interestedSubjects) {
        //interestedSubjects = categoriesC4.interestedSubjects;
      }
      if (categoriesC4.quiteInterestedSubjects) {
        //quiteInterestedSubjects = categoriesC4.quiteInterestedSubjects;
      }
      if (categoriesC4.modernLanguages) {
        //modernLanguages = categoriesC4.modernLanguages;
      }
      if (categoriesC4.modernLanguagesExpanded) {
        //modernLanguagesExpanded = modernLanguagesExpanded;
      }
    }

    console.log(subjects);

    this.state = {
      subjects,
      modernLanguagesExpanded,
      modernLanguages,
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
      modernLanguages: this.state.modernLanguages,
      modernLanguagesExpanded: this.state.modernLanguagesExpanded,
      interestedSubjects: this.state.interestedSubjects,
      quiteInterestedSubjects: this.state.quiteInterestedSubjects,
    })
  }

  updateSubjects(subjects: any[]) {
    this.setState({ subjects });
    this.onChange();
  }

  updateModernLanguages(modernLanguages: any[]) {
    this.setState({ modernLanguages });
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
    return (
      <div className="drag-box-r23" key={i}>
        <div className="drag-item-r23">{s.name}</div>
      </div>
    );
  }

  renderMobileSubject(s: any, i: number) {
    const isInterested = this.state.interestedSubjects.find(sr => sr.id === s.id);
    const isQuiteInterested = this.state.quiteInterestedSubjects.find(sr => sr.id === s.id);

    return (
      <div className="mobile-subject-c-343 bold" key={i}>
        <div className="font-20 subject-title-c-343 text-center">{s.name}</div>
        <div className="flex-center text-center">
          <div className={`very-interested-c-343 interested-btn-c-343 ${isInterested ? 'active' : ''}`} onClick={() => {
            const quiteInterestedSubjects = this.state.quiteInterestedSubjects.filter(sr => sr.id !== s.id);
            const interestedSubjects = this.state.interestedSubjects;
            let found = interestedSubjects.find(sr => sr.id === s.id);
            if (!found) {
              console.log('add very subject', s);
              interestedSubjects.push(s);
            }
            console.log(interestedSubjects, quiteInterestedSubjects);
            this.setState({ interestedSubjects: [...interestedSubjects], quiteInterestedSubjects: [...quiteInterestedSubjects] });
          }}>Very Interested</div>
          <div className={`quite-interested-c-343 interested-btn-c-343 ${isQuiteInterested ? 'active' : ''}`} onClick={() => {
            const interestedSubjects = this.state.interestedSubjects.filter(sr => sr.id !== s.id);
            const quiteInterestedSubjects = this.state.quiteInterestedSubjects;
            let found = quiteInterestedSubjects.find(sr => sr.id === s.id);
            if (!found) {
              console.log('add quite subject', s);
              quiteInterestedSubjects.push(s);
            }
            this.setState({ interestedSubjects, quiteInterestedSubjects });
          }}>Quite Interested</div>
        </div>
      </div>
    )
  }

  render() {
    const ReactSortableV1 = ReactSortable as any;

    let canSkip = this.state.interestedSubjects.length === 0 && this.state.quiteInterestedSubjects.length === 0;

    if (isPhone()) {
      return (
        <div className="mobile-interests-c-343">
          <div className="relative">
            <img src="/images/choicesTool/ThirdStepR4.png" className="your-interests-img"></img>
          </div>
          <div className="bold font-23 question-text-3 margin-left-4">
            New Subjects - Your<br /> Interests
          </div>
          <div className="font-16 margin-left-4">
            Which of these new subjects would you<br />
            consider studying? Select any that<br />
            you’d be interested in.
          </div>
          <div>
            {this.state.subjects.map(this.renderMobileSubject.bind(this))}
          </div>

          <BackButtonSix onClick={this.props.moveBack} />
          {canSkip &&
            <div className="absolute-text-34234">
              <div>I’m currently not interested in <br /> any of these subjects</div>
            </div>}
          <NextButtonSix label={canSkip ? 'Skip' : 'Continue'} onClick={this.props.moveNext} />
        </div>
      );
    }

    return (
      <div>
        <div className="bold font-32 question-text-3">
          New Subjects - Your Interests
        </div>
        <img src="/images/choicesTool/ThirdStepR4.png" className="third-step-img third-step-img-r4"></img>
        <div className="font-16">
          Which of these new subjects would you consider studying? Select any that you’d be  interested in.
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
                {/* 
                <div className={`drag-box-r23 other-language ${this.state.modernLanguagesExpanded ? 'expanded' : ''}`}>
                  <div className="drag-item-r24">
                    <div className="other-language-label" onClick={() => {
                      this.setState({ modernLanguagesExpanded: !this.state.modernLanguagesExpanded });
                    }}>
                      <SpriteIcon name="arrow-right" />
                      Other Modern Language
                    </div>
                    {this.state.modernLanguagesExpanded &&
                      <ReactSortableV1
                        list={this.state.modernLanguages as any[]}
                        animation={150}
                        className="sortable-list-r23"
                        group={{ name: "cloning-group-name" }}
                        setList={(list: any[]) => this.updateModernLanguages(list)}
                      >
                        {this.state.modernLanguages.map(this.renderSubjectBox.bind(this))}
                      </ReactSortableV1>}
                  </div>
                </div>*/}
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
                  className="sortable-list-r23 full-height-r23"
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
                  className="sortable-list-r23 full-height-r23"
                  group={{ name: "cloning-group-name" }}
                  setList={(list: any[]) => this.updateQuiteInterestedSubjects(list)}
                >
                  {this.state.quiteInterestedSubjects.map(this.renderSubjectBox.bind(this))}
                </ReactSortableV1>
              </div>
            </div>
          </div>
        </div>
        <BackButtonSix onClick={this.props.moveBack} />
        {canSkip &&
          <div className="absolute-text-34234">
            <div>I’m currently not interested in <br /> any of these subjects</div>
          </div>}
        <NextButtonSix label={canSkip ? 'Skip' : 'Continue'} onClick={this.props.moveNext} />
      </div>
    );
  }
}

export default ThirdStepC4;
