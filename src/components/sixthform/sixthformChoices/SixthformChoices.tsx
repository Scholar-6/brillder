import React, { Component } from "react";

import "./SixthformChoices.scss";
import { User } from "model/user";
import {
  SixthformSubject, UserSubjectChoice, getSixthformAnswers,
  getSixthformSubjects, saveSixthformAnswer, setSixthformSubjectChoice
} from "services/axios/sixthformChoices";

import SpriteIcon from "components/baseComponents/SpriteIcon";

import FirstStep from "./components/FirstStep";
import SecondStep from "./components/SecondStep";
import ThirdStep from "./components/thirdStep/ThirdStep";
import FourthStep from "./components/FourthStep";
import FifthStep from "./components/FifthStep";
import { fileUrl } from "components/services/uploadFile";
import ProgressBarSixthform from "./components/progressBar/ProgressBarSixthform";
import SixthStep from "./components/sixStep/SixthStep";


interface UserProfileProps {
  user: User;
  location: any;
  history: any;
  match: any;
}

export enum Pages {
  Welcome = 0,
  Question1,
  Question2,
  Question3,
  Question4,
  Question5,
  Question6
}

enum SubjectType {
  ALevels = 1,
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
        if (!subject.userChoice) {
          subject.score = 3;
          subject.userChoice = UserSubjectChoice.Maybe;
        }
      }
      this.setState({ subjects: this.sortByScore(subjects), allSubjects: this.sortByScore(subjects) });
    }

    const answers = await getSixthformAnswers();

    if (answers) {
      for (let answer of answers) {
        answer.answer = JSON.parse(answer.answer);
      }

      const firstAnswer = answers.find(a => a.step === Pages.Question1);

      let subjectType = SubjectType.AllSubjects;
      if (firstAnswer) {
        subjectType = firstAnswer.answer.choice;
      }

      this.setState({ answers: [], subjectType });
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

  parseAnswer(result: any, answer: any, questionPage: Pages) {
    if (result && result.result) {
      const answerR1 = this.state.answers.find(a => a.step === questionPage);
      if (answerR1) {
        answerR1.answer.choice = answer.choice;
      } else {
        result.result.answer = JSON.parse(result.result.answer);
        this.state.answers.push(result.result);
        this.setState({ answers: [...this.state.answers] });
      }
    }
  }

  parseAnswer2(result: any, answer: any, questionPage: Pages) {
    if (result) {
      const answerR1 = this.state.answers.find(a => a.step === questionPage);
      if (answerR1) {
        answerR1.answer.choice = answer.choice;
        answerR1.answer.otherChoice = answer.otherChoice;
        answerR1.answer.subStep = answer.subStep;
        answerR1.answer.currentSchool = answer.currentSchool;
        answerR1.answer.databaseSchool = answer.databaseSchool;
        answerR1.answer.sixthformChoice = answer.sixthformChoice;
      } else {
        result.result.answer = JSON.parse(result.result.answer);
        this.state.answers.push(result.result);
        this.setState({ answers: [...this.state.answers] });
      }
    }
  }

  parseAnswer3(result: any, answer: any, questionPage: Pages) {
    if (result) {
      const answerR1 = this.state.answers.find(a => a.step === questionPage);
      if (answerR1) {
        if (answer.firstPairResults) {
          answerR1.answer.firstPairResults = answer.firstPairResults;
        }
        if (answer.secondPairResults) {
          answerR1.answer.secondPairResults = answer.secondPairResults;
        }
        if (answer.subjectSelections) {
          answerR1.answer.subjectSelections = answer.subjectSelections;
        }
        if (answer.categoriesC3) {
          answerR1.answer.categoriesC3 = answer.categoriesC3;
        }
        if (answer.categoriesC4) {
          answerR1.answer.categoriesC4 = answer.categoriesC4;
        }
        if (answer.coursesD) {
          answerR1.answer.coursesD = answer.coursesD;
        }
        if (answer.coursesF) {
          answerR1.answer.coursesF = answer.coursesF;
        }
        if (answer.ePairResults) {
          answerR1.answer.ePairResults = answer.ePairResults;
        }
        if (answer.subStep) {
          answerR1.answer.subStep = answer.subStep;
        }
        this.setState({
          allSubjects: this.sortByScore(this.state.allSubjects),
          subjects: this.sortByScore(this.state.subjects)
        });
      } else {
        result.result.answer = JSON.parse(result.result.answer);
        this.state.answers.push(result.result);
        this.setState({
          answers: [...this.state.answers],
          allSubjects: this.sortByScore(this.state.allSubjects),
          subjects: this.sortByScore(this.state.subjects)
        });
      }
    }
  }

  parseAnswer4(result: any, answer: any, questionPage: Pages) {
    if (result) {
      const answerR1 = this.state.answers.find(a => a.step === questionPage);
      if (answerR1) {
        answerR1.answer.subStep = answer.subStep;
        answerR1.answer.categories4bc = answer.categories4bc;
        answerR1.answer.facilitatingSubjects = answer.facilitatingSubjects;
        answerR1.answer.nonFacilitatingSubjects = answer.nonFacilitatingSubjects;
        answerR1.answer.categories4c = answer.categories4c;
        answerR1.answer.categories4e = answer.categories4e;
        console.log('parsedAnswer4', answerR1)
        this.setState({
          allSubjects: this.sortByScore(this.state.allSubjects),
          subjects: this.sortByScore(this.state.subjects)
        });
      } else {
        result.result.answer = JSON.parse(result.result.answer);
        this.state.answers.push(result.result);
        this.setState({
          answers: [...this.state.answers],
          allSubjects: this.sortByScore(this.state.allSubjects),
          subjects: this.sortByScore(this.state.subjects)
        });
      }
    }
  }

  parseAnswer5(result: any, answer: any, questionPage: Pages) {
    if (result) {
      const answerR1 = this.state.answers.find(a => a.step === questionPage);
      if (answerR1) {
        answerR1.answer.subStep = answer.subStep;
        answerR1.answer.abAnswer = answer.abAnswer;
        answerR1.answer.careers = answer.careers;
        console.log('parsedAnswer5', answerR1, answer)
        this.setState({
          allSubjects: this.sortByScore(this.state.allSubjects),
          subjects: this.sortByScore(this.state.subjects)
        });
      } else {
        result.result.answer = JSON.parse(result.result.answer);
        this.state.answers.push(result.result);
        this.setState({
          answers: [...this.state.answers],
          allSubjects: this.sortByScore(this.state.allSubjects),
          subjects: this.sortByScore(this.state.subjects)
        });
      }
    }
  }

  parseAnswer6(result: any, answer: any, questionPage: Pages) {
    if (result) {
      const answerR1 = this.state.answers.find(a => a.step === questionPage);
      if (answerR1) {
        answerR1.answer.subStep = answer.subStep;
        //answerR1.answer.abAnswer = answer.abAnswer;
        //answerR1.answer.careers = answer.careers;
        console.log('parsedAnswer6', answerR1, answer)
        this.setState({
          allSubjects: this.sortByScore(this.state.allSubjects),
          subjects: this.sortByScore(this.state.subjects)
        });
      } else {
        result.result.answer = JSON.parse(result.result.answer);
        this.state.answers.push(result.result);
        this.setState({
          answers: [...this.state.answers],
          allSubjects: this.sortByScore(this.state.allSubjects),
          subjects: this.sortByScore(this.state.subjects)
        });
      }
    }
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

  filterBySubjectType(currentSubjectType: SubjectType, subjectsR4: SixthformSubject[]) {
    let subjects: any[] = [];
    if (currentSubjectType === SubjectType.ALevels) {
      subjects = subjectsR4.filter(s => s.isALevel === true);
    } else if (currentSubjectType === SubjectType.VocationalSubjects) {
      subjects = subjectsR4.filter(s => s.isVocational === true);
    } else if (currentSubjectType === SubjectType.AllSubjects) {
      subjects = subjectsR4;
    }
    return subjects;
  }

  renderSidebarCheckbox(currentSubjectType: SubjectType, label: string) {
    return (
      <label className="check-box-container container font-16" onClick={() => {
        this.saveFirstAnswer({ choice: currentSubjectType });
      }}>
        {label}
        <span className={`checkmark ${currentSubjectType === this.state.subjectType ? "checked" : ""}`}></span>
      </label>
    );
  }

  async saveFirstAnswer(answer: any) {
    const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question1);
    if (result) {
      this.parseAnswer(result, answer, Pages.Question1);
      this.setState({
        subjects: this.filterBySubjectType(answer.choice, result.subjectScores), allSubjects: result.subjectScores, subjectType: answer.choice
      });
    }
  }

  async saveThirdAnswer(answer: any) {
    const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question3);
    if (result) {
      for (let subject of this.state.allSubjects) {
        subject.score = 0;
      }
      let scores = result.subjectScores.filter(s => s.score !== 0);
      for (let subject of this.state.allSubjects) {
        let s2 = scores.find((s) => s.id == subject.id);
        if (s2) {
          subject.score = s2.score;
        }
      }
      this.parseAnswer3(result, answer, Pages.Question3);
    }
  }

  async saveFourthAnswer(answer: any) {
    console.log('save 4 answer', answer)
    const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question4);
    if (result) {
      for (let subject of this.state.allSubjects) {
        subject.score = 0;
      }
      let scores = result.subjectScores.filter(s => s.score !== 0);
      for (let subject of this.state.allSubjects) {
        let s2 = scores.find((s) => s.id == subject.id);
        if (s2) {
          subject.score = s2.score;
        }
      }
      this.parseAnswer4(result, answer, Pages.Question4);
    }
  }

  async saveFifthAnswer(answer: any) {
    const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question5);
    if (result) {
      for (let subject of this.state.allSubjects) {
        subject.score = 0;
      }
      let scores = result.subjectScores.filter(s => s.score !== 0);
      for (let subject of this.state.allSubjects) {
        let s2 = scores.find((s) => s.id == subject.id);
        if (s2) {
          subject.score = s2.score;
        }
      }
      this.parseAnswer5(result, answer, Pages.Question5);
    }
  }

  async saveSixthAnswer(answer: any) {
    const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question6);
    if (result) {
      for (let subject of this.state.allSubjects) {
        subject.score = 0;
      }
      let scores = result.subjectScores.filter(s => s.score !== 0);
      for (let subject of this.state.allSubjects) {
        let s2 = scores.find((s) => s.id == subject.id);
        if (s2) {
          subject.score = s2.score;
        }
      }
      this.parseAnswer6(result, answer, Pages.Question6);
    }
  }

  renderCourseContent() {
    if (this.state.page === Pages.Welcome) {
      return (
        <div>
          <SpriteIcon name="ios-library" className="ionLibrary" />
          <div className="bold big-text-q1 font-32">Welcome to our Sixth Form Course Selector!</div>
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
          <button className="absolute-contunue-btn font-24" onClick={() => this.setState({ page: Pages.Question1 })}>Continue</button>
        </div>
      );
    } else if (this.state.page === Pages.Question1) {
      return <FirstStep
        answer={this.state.answers.find(a => a.step === Pages.Question1)}
        onChoiceChange={(answer: any) => this.saveFirstAnswer(answer)}
        moveNext={() => this.setState({ page: Pages.Question2 })}
        moveBack={() => this.setState({ page: Pages.Welcome })}
      />
    } else if (this.state.page === Pages.Question2) {
      return <SecondStep
        answer={this.state.answers.find(a => a.step === Pages.Question2)}
        moveNext={async (answer: any) => {
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question2);
          if (result) {
            this.parseAnswer2(result, answer, Pages.Question2);
            this.setState({ page: Pages.Question3 });
          }
        }}
        moveBack={async (answer: any) => {
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question2);
          if (result) {
            this.parseAnswer2(result, answer, Pages.Question2);
            this.setState({ page: Pages.Question1, subjects: this.state.allSubjects });
          }
        }}
      />
    } else if (this.state.page === Pages.Question3) {
      return <ThirdStep
        subjects={this.state.allSubjects}
        firstAnswer={this.state.answers.find(a => a.step === Pages.Question1)}
        answer={this.state.answers.find(a => a.step === Pages.Question3)}
        saveThirdAnswer={async (answer: any) => {
          console.log('save answer', answer);
          await this.saveThirdAnswer(answer);
        }}
        moveNext={async (answer: any) => {
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question3);
          if (result) {
            this.parseAnswer3(result, answer, Pages.Question3);
            this.setState({ page: Pages.Question4 });
          }
        }}
        moveBack={async (answer: any) => {
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question3);
          if (result) {
            this.parseAnswer3(result, answer, Pages.Question3);
            this.setState({ page: Pages.Question2, answers: [...this.state.answers] })
          }
        }} />
    } else if (this.state.page === Pages.Question4) {
      return <FourthStep
        firstAnswer={this.state.answers.find(a => a.step === Pages.Question1)}
        answer={this.state.answers.find(a => a.step === Pages.Question4)}
        saveAnswer={answer => {
          this.saveFourthAnswer(answer);
        }}
        moveNext={answer => {
          console.log('save 4 answer', answer)
          this.saveFourthAnswer(answer);
          this.setState({ page: Pages.Question5 });
        }}
        moveBack={answer => {
          this.saveFourthAnswer(answer);
          this.setState({ page: Pages.Question3 });
        }}
      />
    } else if (this.state.page === Pages.Question5) {
      return <FifthStep
        answer={this.state.answers.find(a => a.step === Pages.Question5)}
        saveAnswer={(answer: any) => {
          this.saveFifthAnswer(answer);
        }}
        moveNext={answer => {
          this.saveFifthAnswer(answer);
          this.setState({ page: Pages.Question6 });
        }}
        moveBack={answer => {
          this.saveFifthAnswer(answer);
          this.setState({ page: Pages.Question4 });
        }}
      />
    } else if (this.state.page === Pages.Question6) {
      return <SixthStep
        answer={this.state.answers.find(a => a.step === Pages.Question6)}
        saveAnswer={answer => this.saveSixthAnswer(answer)}
        moveNext={answer => {
          this.saveSixthAnswer(answer);
        }}
        moveBack={answer => {
          this.saveSixthAnswer(answer);
          this.setState({ page: Pages.Question5 });
        }} />
    }
    return <div />;
  }

  async updateSubject(subject: SixthformSubject) {
    await setSixthformSubjectChoice(subject);
    this.setState({ popupSubject: subject, subjects: this.sortByScore(this.state.subjects) });
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
            this.updateSubject(subject);
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
            this.updateSubject(subject);
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
            this.updateSubject(subject);
          }}>Not for me</div>
      </div>
    );
  }

  renderBrick(subject: SixthformSubject) {
    if (subject.name === 'Accounting') {
      console.log(subject)
    }
    if (subject.brick) {
      return (
        <div className="brick-container">
          <div className="scroll-block" style={{ backgroundImage: `url(${fileUrl(subject.brick.coverImage)})` }}></div>
          <div className="bottom-description-color" />
          <div className="bottom-description font-8 bold" dangerouslySetInnerHTML={{ __html: subject.brick.title }} />
        </div>
      );
    }
    return (
      <div className="brick-container">
        <div className="scroll-block" style={{ backgroundImage: `url(https://s3.eu-west-2.amazonaws.com/app.brillder.files.com/files/6c5bb9cb-28f0-4bb4-acc6-0169ef9ce9aa.png)` }}></div>
        <div className="bottom-description-color" />
        <div className="bottom-description font-8 bold">Introduction to Advanced Mathemathics</div>
      </div>
    );
  }

  renderSubjectPopup(subject: SixthformSubject) {
    if (this.state.popupSubject && this.state.popupSubject === subject) {
      const { popupSubject } = this.state;
      return (
        <div className="subject-sixth-popup">
          {subject.facilitatingSubject &&
            <div className="facilitation-container font-12">
              <div>
                <SpriteIcon name="facilitating-badge" />
                <span>Facilitating Subject</span>
              </div>
            </div>}
          <div className="subject-name font-24 bold">
            {this.renderCircle(subject)}
            <span className="subject-name-only">
              {popupSubject.name} {popupSubject.score}
            </span>
          </div>
          <div className="font-14">
            {subject.description ? subject.description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
          </div>
          <div className="second-row">
            <div className="box-v32 m-r">
              <div>
                <SpriteIcon name="user-custom-v3" />
              </div>
              <div className="font-12">Candidates</div>
              <div className="bold font-15">{subject.candidates > 0 ? subject.candidates : 1000}</div>
            </div>
            <div className="box-v32">
              <div>
                <SpriteIcon name="facility-icon-hat" />
              </div>
              <div className="font-12">Subject Group</div>
              <div className="bold font-12">{subject.subjectGroup ? subject.subjectGroup : 'STEM'}</div>
            </div>
            <div className="box-v32 m-l">
              <div>
                <SpriteIcon name="bricks-icon-v3" />
              </div>
              <div className="font-12">Often taken with</div>
              <div className="bold font-11">{subject.oftenWith ? subject.oftenWith : 'Accounting, Business'}</div>
            </div>
          </div>
          {this.renderSwitchButton(subject)}
          <div className="taste-container">
            <div className="label-container">
              <div>
                <div className="bold font-18">Try a taster topic</div>
                <div className="font-14">Try out a Brick for this subject to see if it’s a good fit for you.</div>
              </div>
            </div>
            <div>
              {this.renderBrick(subject)}
            </div>
          </div>
        </div>
      );
    }
    return;
  }

  renderSubjectGroup(subject: SixthformSubject) {
    if (subject.isTLevel) {
      return "T Level";
    } else if (subject.isALevel) {
      return "A Level";
    } else {
      return "VAP";
    }
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        <div className="page1 dashboard-page SixthformChoicesPage">
          <div className="header-top">
            <div className="top-left-logo-container">
              <div>
                <div className="logo-container-r23">
                  <SpriteIcon name="scholar6-white-logo" className="white-logo-r23" />
                  <SpriteIcon name="red-shape-icon-r1" className="red-shape-r23" />
                </div>
                <div className="font-22 course-select-label">
                  Course Selector
                </div>
              </div>
            </div>
            <div className="logout-container">
              <div className="search-container font-32">
                <ProgressBarSixthform step={this.state.page} />
              </div>
            </div>
          </div>
          <div className="sorted-row">
            <div className="sort-and-filter-container">
              {this.state.page < Pages.Question2 &&
                <div className="subjects-select-box">
                  <div className="bold sidebar-title font-18">Show me:</div>
                  {this.renderSidebarCheckbox(SubjectType.ALevels, 'A-Levels Only')}
                  {this.renderSidebarCheckbox(SubjectType.VocationalSubjects, 'Vocational Subjects Only')}
                  {this.renderSidebarCheckbox(SubjectType.AllSubjects, 'Showing All Subjects')}
                </div>}
              <div className="font-18 ranking-label">Your subject rankings</div>
              <div className={`subjects-scrollbar font-16 ${this.state.page >= Pages.Question2 ? 'big-subjects-sidebar' : ''}`}>
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
                    clearTimeout(this.state.popupTimeout);
                    this.setState({ popupSubject: null });
                  }}>
                    {this.renderCircle(subject)}
                    <div className="subject-name">{subject.name}</div>
                    <div className="level-round font-12">{this.renderSubjectGroup(subject)}</div>
                    {this.renderSubjectPopup(subject)}
                  </div>
                })}
              </div>
              <div className="sidebar-footer"></div>
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
