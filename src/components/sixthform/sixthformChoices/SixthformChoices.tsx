import React, { Component } from "react";

import "./SixthformChoices.scss";
import { User } from "model/user";
import {
  SixthformSubject, UserSubjectChoice, getSixthformAnswers,
  getSixthformSubjects, saveSixthformAnswer, setSixthformSubjectChoice
} from "services/axios/sixthformChoices";

import SpriteIcon from "components/baseComponents/SpriteIcon";

import ProgressBarSixthform from "./components/progressBar/ProgressBarSixthform";
import FirstStep from "./components/firstStep/FirstStep";
import SecondStep from "./components/secondStep/SecondStep";
import ThirdStep from "./components/thirdStep/ThirdStep";
import FifthStep from "./components/fifthStep/FifthStep";
import SixStep from "./components/sixStep/SixStep";
import map from "components/map";
import TasterBrickDialog from "./components/TasterBrickDialog";
import routes from "components/play/routes";
import authRoutes from "../login/routes";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import FourthStep from "./components/fourthStep/FourthStep";
import SubjectSidebarPopup from "./components/SubjectSidebarPopup";


interface UserProfileProps {
  user: User;
  location: any;
  history: any;
  match: any;
}

export enum Pages {
  Question1 = 1,
  Question2,
  Question3,
  Question4,
  Question5,
  Question6
}

export enum SubjectType {
  None = 0,
  ALevels = 1,
  VocationalSubjects,
  AllSubjects
}

interface UserProfileState {
  isLoading: boolean;
  subjectType: SubjectType;
  allSubjects: SixthformSubject[];
  subjects: SixthformSubject[];

  popupSubject: SixthformSubject | null;
  subjectPosition: any;
  popupTimeout: number | NodeJS.Timeout;
  leavePopupTimeout: number | NodeJS.Timeout;

  answers: any[];
  page: Pages;
  brickPopup: {
    isOpen: boolean;
    brick: any;
  }
}

class SixthformChoices extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    let subjectType = SubjectType.AllSubjects;

    let page = Pages.Question1;

    // if step in params load from cash
    if (this.props.match.params.step) {
      page = parseInt(this.props.match.params.step);
    }

    this.state = {
      isLoading: true,
      subjectType: SubjectType.None,
      allSubjects: [],
      subjects: [],
      answers: [],

      popupTimeout: -1,
      leavePopupTimeout: -1,
      popupSubject: null,
      subjectPosition: null,

      page,
      brickPopup: {
        isOpen: false,
        brick: null
      }
    }

    this.loadSubjects(subjectType);
  }

  async loadSubjects(subjectType: any) {
    const subjects = await getSixthformSubjects();
    const answers = await getSixthformAnswers();

    let secondAnswer = null;
    if (answers) {
      for (let answer of answers) {
        answer.answer = JSON.parse(answer.answer);
      }
      secondAnswer = answers.find(a => a.step === Pages.Question2);
      if (secondAnswer && secondAnswer.answer.subjectType) {
        subjectType = secondAnswer.answer.subjectType;
      } else {
        secondAnswer = {
          answer: {
            subjectType: SubjectType.AllSubjects
          }
        }
      }
    }

    if (subjects) {
      for (let subject of subjects) {
        if (!subject.userChoice) {
          subject.score = 3;
          subject.userChoice = UserSubjectChoice.Maybe;
        }
      }
      if (secondAnswer) {
        await this.saveSecondAnswer(secondAnswer.answer);
      }
    } else {
      this.props.history.push(authRoutes.SignUp);
    }

    if (answers) {
      let answeRs: any[] = [];

      // if step in params load from cash
      if (this.props.match.params.step) {
        answeRs = answers;
      }

      this.setState({ answers, subjectType });
    }
    this.setState({ isLoading: false });
  }

  sortByScore(subjects: SixthformSubject[]) {
    subjects.sort((a, b) => {
      let aName = a.name.toLowerCase();
      let bName = b.name.toLowerCase()
      if (aName < bName) {
        return -1;
      } else if (aName > bName) {
        return 1;
      }
      return 0;
    });
    subjects.sort((a, b) => {
      if (a.candidates > b.candidates) {
        return -1;
      } else if (a.candidates < b.candidates) {
        return 1;
      }
      return 0;
    });
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
        answerR1.answer.email = answer.email;
        answerR1.answer.emailCorrected = answer.emailCorrected;
        answerR1.answer.firstName = answer.firstName;
        answerR1.answer.lastName = answer.lastName;
        answerR1.answer.nameCorrected = answer.nameCorrected;
        answerR1.answer.subStep = answer.subStep;
        answerR1.answer.dreamChoices = answer.dreamChoices;
        answerR1.answer.enthusiasmChoices = answer.enthusiasmChoices;
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
        answerR1.answer.subjectType = answer.subjectType;
        answerR1.answer.subStep = answer.subStep;
        answerR1.answer.currentSchool = answer.currentSchool;
        answerR1.answer.schoolName = answer.schoolName;
        answerR1.answer.sixthformChoice = answer.sixthformChoice;
        answerR1.answer.readingChoice = answer.readingChoice;
        answerR1.answer.readingChoicesV2 = answer.readingChoicesV2;
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
        if (answer.watchingChoices) {
          answerR1.answer.watchingChoices = answer.watchingChoices;
        }
        this.setState({
          allSubjects: this.sortByScore(result.subjectScores),
          subjects: this.filterBySubjectType(this.state.subjectType, result.subjectScores)
        });
      } else {
        result.result.answer = JSON.parse(result.result.answer);
        this.state.answers.push(result.result);
        this.setState({
          answers: [...this.state.answers],
          allSubjects: this.sortByScore(result.subjectScores),
          subjects: this.filterBySubjectType(this.state.subjectType, result.subjectScores)
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
        answerR1.answer.listeningChoices = answer.listeningChoices;

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
        if (answer.watchingChoices) {
          answerR1.answer.watchingChoices = answer.watchingChoices;
        }

        this.setState({
          allSubjects: this.sortByScore(result.subjectScores),
          subjects: this.filterBySubjectType(this.state.subjectType, result.subjectScores)
        });
      } else {
        result.result.answer = JSON.parse(result.result.answer);
        this.state.answers.push(result.result);
        this.setState({
          answers: [...this.state.answers],
          allSubjects: this.sortByScore(result.subjectScores),
          subjects: this.filterBySubjectType(this.state.subjectType, result.subjectScores)
        });
      }
    }
  }

  parseAnswer5(result: any, answer: any, questionPage: Pages) {
    if (result) {
      const answerR1 = this.state.answers.find(a => a.step === questionPage);
      if (answerR1) {
        answerR1.answer.subStep = answer.subStep;
        answerR1.answer.categories4bc = answer.categories4bc;
        answerR1.answer.categories4c = answer.categories4c;
        answerR1.answer.cetegoriesData = answer.cetegoriesData;
        answerR1.answer.facilitatingSubjects = answer.facilitatingSubjects;
        answerR1.answer.nonFacilitatingSubjects = answer.nonFacilitatingSubjects;
        answerR1.answer.categories4e = answer.categories4e;
        answerR1.answer.speakingChoices = answer.speakingChoices;

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
        answerR1.answer.aAnswer = answer.aAnswer;
        answerR1.answer.abAnswer = answer.abAnswer;
        answerR1.answer.careers = answer.careers;
        answerR1.answer.writingChoice = answer.writingChoice;
        answerR1.answer.writingChoices = answer.writingChoices;

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
    return this.sortByScore(subjects);
  }

  renderSidebarCheckbox(currentSubjectType: SubjectType, label: string) {
    return (
      <label className="check-box-container container font-16" onClick={() => {
        let answer = this.state.answers.find(a => a.step === Pages.Question2);
        if (!answer) {
          answer = { answer: { subjectType: currentSubjectType } };
        } else {
          answer.answer.subjectType = currentSubjectType;
        }
        this.saveSecondAnswer(answer.answer);
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
        subjects: this.filterBySubjectType(this.state.subjectType, result.subjectScores),
        allSubjects: result.subjectScores
      });
    }
  }

  async saveSecondAnswer(answer: any) {
    const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question2);
    if (result) {
      this.parseAnswer2(result, answer, Pages.Question2);
      this.setState({
        subjects: this.filterBySubjectType(answer.subjectType, result.subjectScores),
        allSubjects: result.subjectScores,
        subjectType: answer.subjectType
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
    if (this.state.page === Pages.Question1) {
      return <FirstStep
        answer={this.state.answers.find(a => a.step === Pages.Question3)}
        saveAnswer={this.saveThirdAnswer.bind(this)}
        moveNext={async (answer: any) => {
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question1);
          if (result) {
            this.parseAnswer(result, answer, Pages.Question1);
            this.setState({ page: Pages.Question2 });
          }
        }}
        moveBack={async (answer: any) => {
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question3);
          if (result) {
            this.parseAnswer(result, answer, Pages.Question1);
            this.setState({ page: Pages.Question2, answers: [...this.state.answers] })
          }
        }}
      />
    } else if (this.state.page === Pages.Question2) {
      const firstAnswer = this.state.answers.find(a => a.step === Pages.Question1);
      return <SecondStep
        firstAnswer={firstAnswer}
        subjects={this.state.subjects}
        answer={this.state.answers.find(a => a.step === Pages.Question2)}
        saveAnswer={answer => this.saveSecondAnswer(answer)}
        moveNext={answer => {
          this.saveFourthAnswer(answer);
          this.setState({ page: Pages.Question2 });
        }}
        moveBack={answer => {
          this.saveFourthAnswer(answer);
          this.setState({ page: Pages.Question1 });
        }}
      />
    } else if (this.state.page === Pages.Question3) {
      return <ThirdStep
        answer={this.state.answers.find(a => a.step === Pages.Question3)}
        saveAnswer={this.saveThirdAnswer.bind(this)}
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
      const secondAnswer = this.state.answers.find(a => a.step === Pages.Question2);
      const thirdAnswer = this.state.answers.find(a => a.step === Pages.Question3);
      return <FourthStep
        secondAnswer={secondAnswer}
        thirdAnswer={thirdAnswer}
        subjects={this.state.subjects}
        answer={this.state.answers.find(a => a.step === Pages.Question4)}
        saveThirdAnswer={answer => {
          this.saveFourthAnswer(answer);
        }}
        moveNext={answer => {
          this.saveFourthAnswer(answer);
          this.setState({ page: Pages.Question5 });
        }}
        moveBack={answer => {
          this.saveFourthAnswer(answer);
          this.setState({ page: Pages.Question3 });
        }}
      />
    } else if (this.state.page === Pages.Question5) {
      const secondAnswer = this.state.answers.find(a => a.step === Pages.Question2);

      return <FifthStep
        secondAnswer={secondAnswer}
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
        saveSecondAnswer={sType => {
          let answer = this.state.answers.find(a => a.step === Pages.Question2);
          if (answer && answer.answer) {
            answer.answer.subjectType = sType;
            this.saveSecondAnswer(answer.answer);
          }
        }}
      />
    } else if (this.state.page === Pages.Question6) {
      return <SixStep
        answer={this.state.answers.find(a => a.step === Pages.Question6)}
        history={this.props.history}
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

  renderSubjectGroup(subject: SixthformSubject) {
    if (subject.isTLevel) {
      return "T-level";
    } else if (subject.isALevel) {
      return "A-level";
    } else {
      return "VAP";
    }
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader content="...Loading Choices..." />;
    }
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
                <ProgressBarSixthform step={this.state.page} exit={() => {
                  this.props.history.push(map.SixthformOutcome);
                }} />
              </div>
            </div>
          </div>
          <div className="sorted-row">
            <div className="sort-and-filter-container" onMouseLeave={() => {
              if (this.state.popupTimeout != -1) {
                clearTimeout(this.state.popupTimeout);
              }
              this.setState({ popupSubject: null, subjectPosition: null });
            }}>
              {this.state.page <= Pages.Question1 &&
                <div className="subjects-select-box">
                  <div className="bold sidebar-title font-18">Show me:</div>
                  {this.renderSidebarCheckbox(SubjectType.ALevels, 'A-levels Only')}
                  {this.renderSidebarCheckbox(SubjectType.VocationalSubjects, 'Vocational Subjects Only')}
                  {this.renderSidebarCheckbox(SubjectType.AllSubjects, 'All Subjects')}
                </div>}
              <div className="font-18 ranking-label">Your subject rankings <span className="score-lable-r23 font-16">Score</span></div>
              <div className={`subjects-scrollbar font-16 ${this.state.page > Pages.Question1 ? 'big-subjects-sidebar' : ''}`}>
                {this.state.subjects.map((subject, i) => {
                  return <div key={i} className="subject-box-r1" onMouseEnter={(event) => {
                    if (this.state.popupTimeout) {
                      clearTimeout(this.state.popupTimeout);
                    }
                    // get position of the element and calculate where to show the popup
                    const subjectPosition = (event.target as any).getBoundingClientRect();
                    const popupTimeout = setTimeout(() => {
                      if (this.state.leavePopupTimeout) {
                        clearTimeout(this.state.leavePopupTimeout);
                      }
                      console.log('show popup');
                      this.setState({ popupSubject: subject, popupTimeout: -1, subjectPosition });
                    }, 1000);
                    this.setState({ popupTimeout });
                  }} onMouseLeave={(e) => {
                    console.log('leave started');
                    if (this.state.popupTimeout == -1) {
                      console.log('leave processing');
                      const leavePopupTimeout = setTimeout(() => {
                        console.log('leave ended');
                        clearTimeout(this.state.popupTimeout);
                        this.setState({ popupSubject: null, subjectPosition: null });
                      }, 1000);
                      this.setState({ leavePopupTimeout });
                    }
                  }}>
                    {this.renderCircle(subject)}
                    <div className="subject-name">{subject.name}</div>
                    <div className="level-round font-12">{this.renderSubjectGroup(subject)}</div>
                    <div className="score-container">{subject.score}</div>
                    <SubjectSidebarPopup
                      subject={subject}
                      popupSubject={this.state.popupSubject}
                      subjectPosition={this.state.subjectPosition}
                      showPopup={() => this.setState({ brickPopup: { isOpen: true, brick: subject.brick } })}
                      updateSubject={() => this.updateSubject(subject)}
                    />
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
        <TasterBrickDialog isOpen={this.state.brickPopup.isOpen} moveToBrick={() => {
          this.props.history.push(routes.playCover(this.state.brickPopup.brick) + '');
        }} close={() => {
          this.setState({ brickPopup: { isOpen: false, brick: null } })
        }} />
      </React.Suspense>
    );
  }
}

export default SixthformChoices;
