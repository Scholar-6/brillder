import React, { Component } from "react";

import "./SixthformChoices.scss";
import { User } from "model/user";
import {
  SixthformSubject, UserSubjectChoice, getSixthformAnswers, getSixthformSubjects, saveSixthformAnswer
} from "services/axios/sixthformChoices";

import HomeButton from "components/baseComponents/homeButton/HomeButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import FirstQuestion from "./components/FirstQuestion";
import SecondQuestion from "./components/SecondQuestion";
import ThirdQuestion from "./components/ThirdQuestion";


interface UserProfileProps {
  user: User;
  location: any;
  history: any;
  match: any;
}

enum Pages {
  Welcome = 0,
  Question1,
  Question2,
  Question3,
  Question4,
  Question5,
}

enum SubjectType {
  AcademicSubjects = 1,
  ALevels,
  VocationalSubjects,
  AllSubjects
}

interface UserProfileState {
  subjectType: SubjectType;
  allSubjects: SixthformSubject[];
  subjects: SixthformSubject[];
  popupSubject: SixthformSubject | null;
  popupTimeout: number | NodeJS.Timeout;
  answers: any[];
  page: Pages;
}

class SixthformChoices extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      subjectType: SubjectType.AllSubjects,
      allSubjects: [],
      subjects: [],
      answers: [],
      popupTimeout: -1,
      popupSubject: null,
      page: Pages.Welcome,
    }

    this.loadSubjects();
  }

  async loadSubjects() {
    const subjects = await getSixthformSubjects();
    
    if (subjects) {
      for (let subject of subjects) {
        subject.score = 3;
        subject.userChoice = UserSubjectChoice.Maybe;
      }
      this.setState({ subjects, allSubjects: subjects });
    }

    const answers = await getSixthformAnswers();
    if (answers) {
      for (let answer of answers) {
        answer.answer = JSON.parse(answer.answer);
      }
      this.setState({answers});
    }
  }

  sortByScore(subjects: SixthformSubject[]) {
    subjects.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      } else if (a.score < b.score) {
        return 1;
      }
      return 0;
    });
    return subjects;
  }

  renderCircle(subject: SixthformSubject) {
    let colorClass = 'subject-circle yellow-circle';
    if (subject.userChoice === UserSubjectChoice.Definetly) {
      colorClass = 'subject-circle green-circle';
    } else if (subject.userChoice === UserSubjectChoice.NotForMe) {
      colorClass = 'subject-circle red-circle';
    }
    return <SpriteIcon name="circle-filled" className={colorClass} />
  }

  renderSidebarCheckbox(currentSubjectType: SubjectType, label: string) {
    return (
      <label className="check-box-container container font-16" onClick={() => {
        let subjects: any[] = [];
        if (currentSubjectType === SubjectType.AcademicSubjects) {
          subjects = this.state.allSubjects.filter(s => s.isAcademic === true);
        } else if (currentSubjectType === SubjectType.ALevels) {
          subjects = this.state.allSubjects.filter(s => s.isALevel === true);
        } else if (currentSubjectType === SubjectType.VocationalSubjects) {
          subjects = this.state.allSubjects.filter(s => s.isVocational === true);
        } else if (currentSubjectType === SubjectType.AllSubjects) {
          subjects = this.state.allSubjects;
        }
        this.setState({ subjectType: currentSubjectType, subjects });
      }}>
        {label}
        <span className={`checkmark ${currentSubjectType === this.state.subjectType ? "checked" : ""}`}></span>
      </label>
    );
  }

  renderCourseContent() {
    if (this.state.page === Pages.Welcome) {
      return (
        <div>
          <SpriteIcon name="ios-library" className="ionLibrary" />
          <div className="bold font-32">Welcome to our Sixth Form Course Selector!</div>
          <div className="smaller-text-box text-box-number1 font-20">
            We take you through a ten step process which helps you identify the right courses for<br />
            you. Numerous factors have a bearing, from current subjects and interests to your<br />
            thinking about degree courses and careers.
          </div>
          <div className="smaller-text-box text-box-number2 font-20">
            At any point, you can also ‘tweak’ the selection process yourself by using the subject<br />
            column on the left to sort your choices.
          </div>
          <div className="smaller-text-box text-box-number3 font-20">
            Let’s start by identifying the type of study you are interested in.
          </div>
          <button className="absolute-contunue-btn font-25" onClick={() => this.setState({ page: Pages.Question1 })}>Continue</button>
        </div>
      );
    }

    if (this.state.page === Pages.Question1) {
      return <FirstQuestion answer={this.state.answers.find(a => a.step === Pages.Question1)} moveNext={async (answer: any) => {
        const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question1);
        if (result) {
          const answerR1 = this.state.answers.find(a => a.step === Pages.Question1);
          answerR1.answer.choice = answer.choice;
        }
        this.setState({ page: Pages.Question2 });
      }} moveBack={() => this.setState({ page: Pages.Welcome })} />
    } else if (this.state.page === Pages.Question2) {
      return <SecondQuestion moveNext={() => this.setState({ page: Pages.Question3 })} moveBack={() => this.setState({ page: Pages.Question1 })} />
    } else if (this.state.page === Pages.Question3) {
      return <ThirdQuestion moveNext={() => this.setState({ page: Pages.Question4 })} moveBack={() => this.setState({ page: Pages.Question2 })} />
    } else if (this.state.page === Pages.Question4) {
      //return <FourthQuestion setPage={setPage} />
    }
    return <div />;
  }

  renderSwitchButton(subject: SixthformSubject) {
    return (
      <div className="switch-button font-12 bold">
        <div
          className={`${subject.userChoice === UserSubjectChoice.Definetly ? 'active active-green' : ''}`}
          onClick={() => {
            if (!subject.score) {
              subject.score = 0;
            }
            if (subject.userChoice === UserSubjectChoice.Maybe) {
              subject.score += 2;
            } else if (subject.userChoice === UserSubjectChoice.NotForMe) {
              subject.score += 15;
            } else {
              subject.score += 5;
            }
            subject.userChoice = UserSubjectChoice.Definetly;
            this.setState({ popupSubject: subject, subjects: this.sortByScore(this.state.subjects) });
          }}>Definitely!</div>
        <div
          className={`${subject.userChoice === UserSubjectChoice.Maybe || !subject.userChoice ? 'active active-yellow' : ''}`}
          onClick={() => {
            if (!subject.score) {
              subject.score = 0;
            }

            if (subject.userChoice === UserSubjectChoice.Definetly) {
              subject.score -= 2;
            } else if (subject.userChoice === UserSubjectChoice.NotForMe) {
              subject.score += 13;
            } else {
              subject.score += 3;
            }
            subject.userChoice = UserSubjectChoice.Maybe;
            this.setState({ popupSubject: subject, subjects: this.sortByScore(this.state.subjects) });
          }}>Maybe</div>
        <div
          className={`${subject.userChoice === UserSubjectChoice.NotForMe ? 'active active-red' : ''}`}
          onClick={() => {
            if (!subject.score) {
              subject.score = 0;
            }

            if (subject.userChoice === UserSubjectChoice.Definetly) {
              subject.score -= 15;
            } else if (subject.userChoice === UserSubjectChoice.Maybe) {
              subject.score -= 13;
            } else {
              subject.score -= 10;
            }
            subject.userChoice = UserSubjectChoice.NotForMe;
            this.setState({ popupSubject: subject, subjects: this.sortByScore(this.state.subjects) });
          }}>Not for me</div>
      </div>
    );
  }

  renderSubjectPopup(subject: SixthformSubject) {
    if (this.state.popupSubject && this.state.popupSubject === subject) {
      const { popupSubject } = this.state;
      return (
        <div className="subject-sixth-popup">
          <div className="subject-name font-24 bold">
            {this.renderCircle(subject)}
            {popupSubject.name} {popupSubject.score}
          </div>
          <div className="font-14">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
          <div className="second-row">
            <div className="box-v32 m-r">
              <div>
                <SpriteIcon name="user-custom-v3" />
              </div>
              <div className="font-12">Candidates</div>
              <div className="bold font-15">220,000</div>
            </div>
            <div className="box-v32">
              <div>
                <SpriteIcon name="facility-icon-hat" />
              </div>
              <div className="font-12">Facilitating Subject</div>
              <div className="bold font-15">STEM</div>
            </div>
            <div className="box-v32 m-l">
              <div>
                <SpriteIcon name="bricks-icon-v3" />
              </div>
              <div className="font-12">Often taken with</div>
              <div className="bold font-11">Accounting, Business</div>
            </div>
          </div>
          {this.renderSwitchButton(subject)}
          <div className="taste-container">
            <div className="label-container">
              <div>
                <div className="bold font-20">Take a Tester Brick!</div>
                <div className="font-14">Try out a Brick for this subject to see if it’s a good fit for you.</div>
              </div>
            </div>
            <div>
              <div className="brick-container">
                <div className="scroll-block" style={{ backgroundImage: `url(https://s3.eu-west-2.amazonaws.com/app.brillder.files.com/files/6c5bb9cb-28f0-4bb4-acc6-0169ef9ce9aa.png)` }}></div>
                <div className="bottom-description-color" />
                <div className="bottom-description font-8 bold">Introduction to Advanced Mathemathics</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return;
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        <div className="page1 dashboard-page SixthformChoicesPage">
          <div className="header-top">
            <HomeButton link={"/home"} history={this.props.history} />
            <div className="logout-container">
              <div className="search-container font-32">
                <div>
                  Course Selector
                </div>
              </div>
            </div>
          </div>
          <div className="sorted-row">
            <div className="sort-and-filter-container">
              <div className="subjects-select-box">
                <div className="bold sidebar-title font-18">Show me:</div>
                {this.renderSidebarCheckbox(1, 'Academic Subjects Only')}
                {this.renderSidebarCheckbox(2, 'A-Levels Only')}
                {this.renderSidebarCheckbox(3, 'Vocational Subjects Only')}
                {this.renderSidebarCheckbox(4, 'Showing All Subjects')}
              </div>
              <div className="font-18 ranking-label">Your subject rankings</div>
              <div className="subjects-scrollbar font-16">
                {this.state.subjects.map((subject, i) => {
                  return <div key={i} onMouseEnter={() => {
                    if (this.state.popupTimeout) {
                      clearTimeout(this.state.popupTimeout);
                    }
                    let popupTimeout = setTimeout(() => {
                      this.setState({ popupSubject: subject });
                    }, 1000);
                    this.setState({ popupTimeout });
                  }} onMouseLeave={(e) => {
                    this.setState({ popupSubject: null });
                  }}>
                    {this.renderCircle(subject)}
                    <div>{subject.name}</div>
                    {this.renderSubjectPopup(subject)}
                  </div>
                })}
              </div>
            </div>
            <div className="brick-row-container">
              {this.renderCourseContent()}
            </div>
          </div>
        </div>
      </React.Suspense>
    );
  }
}

export default SixthformChoices;
