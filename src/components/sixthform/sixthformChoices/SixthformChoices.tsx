import React, { Component } from "react";

import "./SixthformChoices.scss";
import { User } from "model/user";
import {
  SixthformSubject, UserSubjectChoice, getSixthformAnswers,
  getSixthformSubjects, saveSixthformAnswer, setSixthformSubjectChoice
} from "services/axios/sixthformChoices";

import SpriteIcon from "components/baseComponents/SpriteIcon";

import FirstStep from "./components/firstStep/FirstStep";
import SecondStep from "./components/secondStep/SecondStep";
import ThirdStep from "./components/thirdStep/ThirdStep";
import FifthStep from "./components/fifthStep/FifthStep";
import { fileUrl } from "components/services/uploadFile";
import ProgressBarSixthform from "./components/progressBar/ProgressBarSixthform";
import SixStep from "./components/sixStep/SixStep";
import map from "components/map";
import TasterBrickDialog from "./components/TasterBrickDialog";
import routes from "components/play/routes";
import authRoutes from "../login/routes";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import FourthStep from "./components/fourthStep/FourthStep";


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
      popupSubject: null,
      subjectPosition: null,

      page: Pages.Question4,
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
        answerR1.answer.listeningChoices = answer.listeningChoices;
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
        answerR1.answer.aAnswer = answer.aAnswer;
        answerR1.answer.abAnswer = answer.abAnswer;
        answerR1.answer.careers = answer.careers;
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
        answer={this.state.answers.find(a => a.step === Pages.Question1)}
        saveAnswer={(answer: any) => this.saveFirstAnswer(answer)}
        moveNext={() => this.setState({ page: Pages.Question2 })}
      />
    } else if (this.state.page === Pages.Question2) {
      return <SecondStep
        answer={this.state.answers.find(a => a.step === Pages.Question2)}
        saveAnswer={async (answer: any) => {
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question2);
          if (result) {
            this.parseAnswer2(result, answer, Pages.Question2);
            this.setState({
              subjects: this.filterBySubjectType(answer.subjectType, result.subjectScores),
              allSubjects: result.subjectScores,
              subjectType: answer.subjectType
            });
          }
        }}
        moveNext={async (answer: any) => {
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question2);
          if (result) {
            let subjects = this.state.subjects;
            this.parseAnswer2(result, answer, Pages.Question2);
            this.setState({ page: Pages.Question3, subjects: subjects });
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
        answer={this.state.answers.find(a => a.step === Pages.Question3)}
        saveAnswer={async (answer: any) => {
          let subjects = this.state.subjects;
          if (answer && answer.schoolName) {
            let name = answer.schoolName;
            if (name === "Hereford Sixth Form College") {
              subjects = subjects.filter(s =>
                s.name === 'Biology' ||
                s.name === 'Business' ||
                s.name === 'Chemistry' ||
                s.name === 'Classical Civilisation' ||
                s.name === 'Computer Science' ||
                s.name === 'Drama & Theatre Studies' ||
                s.name === 'Economics' ||
                s.name === 'English Language' ||
                s.name === 'English Literature' ||
                s.name === 'Environmental Science' ||
                s.name === 'Fine Art' ||
                s.name === 'French' ||
                s.name === 'Further Mathematics' ||
                s.name === 'Geography' ||
                s.name === 'Geology' ||
                s.name === 'German' ||
                s.name === 'History' ||
                s.name === 'History of Art' ||
                s.name === 'Law' ||
                s.name === 'Mathematics' ||
                s.name === 'Media Studies' ||
                s.name === 'Music' ||
                s.name === 'Philosophy' ||
                s.name === 'Photography' ||
                s.name === 'Physical Education' ||
                s.name === 'Physics' ||
                s.name === 'Politics' ||
                s.name === 'Psychology' ||
                s.name === 'Sociology' ||
                s.name === 'Spanish' ||
                s.name === 'Statistics' ||

                s.name === 'Applied Maths (Core & Certificate)' ||
                s.name === 'Applied Psychology' ||
                s.name === 'Creative Digital Media' ||
                s.name === 'Criminology' ||
                s.name === 'Dance (Vocational)' ||
                s.name === 'Engineering' ||
                s.name === 'Enterprise & Entrepreneurship' ||
                s.name === 'eSports & Computer Games' ||
                s.name === 'Forensic Science' ||
                s.name === 'Health & Social Care' ||
                s.name === 'Information Technology' ||
                s.name === 'Musical Theatre' ||
                s.name === 'Performing Arts (Acting)' ||
                s.name === 'Sport & Exercise Science' ||
                s.name === 'Sporting Excellence' ||
                s.name === 'Travel & Tourism'
              );
            } else if (name === "Worcester Sixth Form College") {
              subjects = subjects.filter(s =>
                s.name === 'Accounting' ||
                s.name === 'Bengali' ||
                s.name === 'Biology' ||
                s.name === 'Business' ||
                s.name === 'Chemistry' ||
                s.name === 'Classical Civilisation' ||
                s.name === 'Computer Science' ||
                s.name === 'Dance' ||
                s.name === 'Drama & Theatre Studies' ||
                s.name === 'Economics' ||
                s.name === 'English Language' ||
                s.name === 'English Literature' ||
                s.name === 'Environmental Science' ||
                s.name === 'Film Studies' ||
                s.name === 'Fine Art' ||
                s.name === 'French' ||
                s.name === 'Further Mathematics' ||
                s.name === 'Geography' ||
                s.name === 'Geology' ||
                s.name === 'German' ||
                s.name === 'Graphic Communication' ||
                s.name === 'History' ||
                s.name === 'Law' ||
                s.name === 'Mathematics' ||
                s.name === 'Media Studies' ||
                s.name === 'Music' ||
                s.name === 'Music Technology' ||
                s.name === 'Philosophy' ||
                s.name === 'Photography' ||
                s.name === 'Physical Education' ||
                s.name === 'Physics' ||
                s.name === 'Politics' ||
                s.name === 'Psychology' ||
                s.name === 'Sociology' ||
                s.name === 'Spanish' ||
                s.name === 'Urdu' ||

                s.name === 'Applied Business' ||
                s.name === 'Applied Maths (Core & Certificate)' ||
                s.name === 'Childcare & Child Development (Education & Early Years)' ||
                s.name === 'Criminology' ||
                s.name === 'Engineering' ||
                s.name === 'Food Science & Nutrition' ||
                s.name === 'Health & Social Care' ||
                s.name === 'Information Technology' ||
                s.name === 'Performing Arts (Acting)' ||
                s.name === 'Sport & Exercise Science' ||
                s.name === 'Travel & Tourism' ||

                s.name === 'Education & Early Years' ||
                s.name === 'Health & Science'
              );
            }
          }
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
          console.log('move back')
          const result = await saveSixthformAnswer(JSON.stringify(answer), Pages.Question3);
          if (result) {
            this.parseAnswer3(result, answer, Pages.Question3);
            this.setState({ page: Pages.Question2, answers: [...this.state.answers] })
          }
        }} />
    } else if (this.state.page === Pages.Question4) {
      let secondAnswer = this.state.answers.find(a => a.step === Pages.Question2);
      let thirdAnswer = this.state.answers.find(a => a.step === Pages.Question3);
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
      let secondAnswer = this.state.answers.find(a => a.step === Pages.Question2);

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
      const { popupSubject, subjectPosition } = this.state;
      const windowHeight = window.innerHeight;
      let style = { top: '11vw', bottom: 'unset' };

      if (subjectPosition && (subjectPosition.bottom > (windowHeight / 1.5))) {
        // popup should be based on bottom
        style.top = 'unset';
        style.bottom = '5vw';
      } else if (subjectPosition && (subjectPosition.bottom > (windowHeight / 1.7))) {
        // popup should be based on bottom
        style.top = 'unset';
        style.bottom = '11vw';
      }
      return (
        <div style={style} className={`subject-sixth-popup ${subject.isTLevel ? 'big-T-level' : ''}`}>
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
              {popupSubject.name} {/*popupSubject.score*/}
            </span>
          </div>
          <div className="font-14">
            {subject.description && subject.description}
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
          {subject.brick &&
            <div className="taste-container" onClick={() => {
              if (subject.brick) {
                this.setState({ brickPopup: { isOpen: true, brick: subject.brick } });
              }
            }}>
              <div className="label-container">
                <div>
                  <div className="bold font-18">Try a taster topic</div>
                  <div className="font-14">Try out a Brick for this subject to see if it’s a good fit for you.</div>
                </div>
              </div>
              <div>
                {this.renderBrick(subject)}
              </div>
            </div>}
        </div>
      );
    }
    return;
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
            <div className="sort-and-filter-container">
              {this.state.page <= Pages.Question1 &&
                <div className="subjects-select-box">
                  <div className="bold sidebar-title font-18">Show me:</div>
                  {this.renderSidebarCheckbox(SubjectType.ALevels, 'A-levels Only')}
                  {this.renderSidebarCheckbox(SubjectType.VocationalSubjects, 'Vocational Subjects Only')}
                  {this.renderSidebarCheckbox(SubjectType.AllSubjects, 'Showing All Subjects')}
                </div>}
              <div className="font-18 ranking-label">Your subject rankings</div>
              <div className={`subjects-scrollbar font-16 ${this.state.page > Pages.Question1 ? 'big-subjects-sidebar' : ''}`}>
                {this.state.subjects.map((subject, i) => {
                  return <div key={i} className="subject-box-r1" onMouseEnter={(event) => {
                    if (this.state.popupTimeout) {
                      clearTimeout(this.state.popupTimeout);
                    }
                    // get position of the element and calculate where to show the popup
                    const subjectPosition = (event.target as any).getBoundingClientRect();
                    let popupTimeout = setTimeout(() => {
                      this.setState({ popupSubject: subject, subjectPosition });
                    }, 1000);
                    this.setState({ popupTimeout });
                  }} onMouseLeave={(e) => {
                    clearTimeout(this.state.popupTimeout);
                    this.setState({ popupSubject: null, subjectPosition: null });
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
