import React, { Component } from "react";
import { connect } from 'react-redux';
import { ReactSortable } from "react-sortablejs";

import "./SixthformOutcome.scss";
import { User } from "model/user";
import {
  SixthformSubject, UserSubjectChoice, getSixthformAnswers, getSixthformSubjects2
} from "services/axios/sixthformChoices";

import { ReduxCombinedState } from 'redux/reducers';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarSixthformV2 from "../sixthformChoices/components/progressBar/ProgressBarSixthformV2";
import map from "components/map";
import { fileUrl } from "components/services/uploadFile";
import { playCover } from "components/play/routes";


interface UserProfileProps {
  user: User;
  location: any;
  history: any;
  match: any;
}

enum SixActiveTab {
  Survey,
  SubjectTasters,
  Outcome
}

interface UserProfileState {
  answers: any[];
  definetlyList: SixthformSubject[];
  possibleList: SixthformSubject[];
  subjects: SixthformSubject[];
  activeTab: SixActiveTab;
  canPutDefinites: boolean;
  definitiesSortKey: number;
}

class SixthformChoices extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    let activeTab = SixActiveTab.Outcome;

    if (props.match.path === map.SixthformTaster) {
      activeTab = SixActiveTab.SubjectTasters;
    }

    this.state = {
      answers: [],
      definetlyList: [],
      possibleList: [],
      subjects: [],
      activeTab,
      canPutDefinites: true,
      definitiesSortKey: 1,
    }

    this.loadSubjects();
  }

  async loadSubjects() {
    const subjects = await getSixthformSubjects2();

    if (subjects) {
      for (let subject of subjects) {
        if (!subject.userChoice) {
          subject.userChoice = UserSubjectChoice.Maybe;
        }
      }
      let definetlyList: any[] = subjects.filter(s => s.userChoice === UserSubjectChoice.Definetly);
      let subjectsR1 = subjects.filter(s => s.userChoice !== UserSubjectChoice.Definetly);
      let subjectCuts = this.sortByScore(subjectsR1).slice(0, 8);
      let possibleList = subjectCuts.slice(0, 6);
      if (definetlyList.length === 0) {
        definetlyList.push({ isEmpty: true });
        definetlyList.push({ isEmpty: true });
        definetlyList.push({ isEmpty: true });
      }
      this.setState({ definetlyList, subjects, possibleList });
    }

    const answers = await getSixthformAnswers();

    if (answers) {
      for (let answer of answers) {
        answer.answer = JSON.parse(answer.answer);
      }

      let steps = 0;

      for (let answer of answers) {
        if (answer.answer) {
          steps += 1;
        }
      }

      this.setState({ answers });
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

  renderBrick(subject: SixthformSubject) {
    if (subject.brick) {
      return (
        <div className="brick-container-23">
          <div className="brick-container">
            <div className="scroll-block" style={{ backgroundImage: `url(${fileUrl(subject.brick.coverImage)})` }}></div>
            <div className="bottom-description-color" />
            <div className="bottom-description font-12 bold" dangerouslySetInnerHTML={{ __html: subject.brick.title }} />
          </div>
          <div className="subjectName font-12">{subject.name}</div>
        </div>
      );
    }
  }

  renderCardBrick(subject: SixthformSubject) {
    if (subject.brick) {
      return (
        <div className="brick-container">
          <div className="scroll-block" style={{ backgroundImage: `url(${fileUrl(subject.brick.coverImage)})` }}></div>
        </div>
      );
    }
  }

  renderStepBox() {
    let answers = this.state.answers;

    if (answers.length > 0) {
      let lastStep = 0;
      for (let answer of answers) {
        if (answer.step > lastStep) {
          lastStep = answer.step;
        }
      }

      if (lastStep === 6) {
        return (
          <div className="box-box box-second">
            <div className="font-16 second-box-top-text">
              <div className="opacity-04">SIXTH FORM COURSE SELECTOR:</div>
              <SpriteIcon name="check-green-six" className="absolute-icon" />
            </div>
            <div className="flex-center percentage-final">
              <div>
                <div className="flex-center font-32 bold">
                  <span className="font-36 line-height-1m15">100%</span>
                </div>
                <div className="flex-center bold">
                  <div className="font-24 line-height-1m15">COMPLETED</div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="box-box box-second">
          <div className="font-16 second-box-top-text">
            <div className="opacity-04">SIXTH FORM COURSE SELECTOR:</div>
            <div className="flex-end">
              <span className="flex-center opacity-04">PROGRESS:</span>
              <span className="font-40">50%</span>
            </div>
          </div>
          <ProgressBarSixthformV2 step={lastStep} />
          <div className="flex-end">
            <div className="survey-button font-20" onClick={() => this.props.history.push(map.SixthformChoices)}>Continue Survey</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="box-box box-second">
          <div className="opacity-04 font-16">SIXTH FORM COURSE SELECTOR:</div>
          <div className="opacity-04 font-15 flex-center not-started-label m-t-2-e3">
            <SpriteIcon name="alert-triangle" />
            NOT STARTED
          </div>
          <div className="flex-center">
            <div className="survey-button font-20" onClick={() => {
              this.props.history.push(map.SixthformChoices);
            }}>
              Take the Survey
            </div>
          </div>
        </div>
      );
    }
  }

  renderEmpty() {
    return (
      <div className="cards-drop empty">
        <SpriteIcon name="empty-category-e354" className="first" />
        <SpriteIcon name="empty-category-e354" />
        <SpriteIcon name="empty-category-e354" className="last" />
      </div>
    );
  }

  renderSubjectTag(subject: SixthformSubject) {
    let label = "VAP"
    if (subject.isTLevel) {
      label = 'T-Level';
    } else if (subject.isALevel) {
      label = 'A-Level';
    }
    return <div className="level-round font-14">{label}</div>
  }

  renderCard(subject: SixthformSubject, i: number) {
    subject.brick = {
      coverImage: "b14cfc0a-1574-4ab7-ae5a-7ac66ea761cd.jpg",
      id: 1006,
      title: "<p>The North Pole wefwef wef wef wef wefwef wefwe f</p>"
    } as any;

    if (subject.isEmpty) {
      return (
        <div className="subject-group first font-20" key={i}>
          Select and drag from the<br />
          subject cards below to choose<br />
          your Definites.
        </div>
      )
    }

    return (
      <div className={`subject-sixth-card ${subject.expanded ? 'expanded' : ''}`} key={i} onMouseEnter={() => {
        subject.expanded = true;
        this.setState({});
      }} onMouseLeave={() => {
        subject.expanded = false;
        this.setState({ definetlyList: this.state.definetlyList, possibleList: this.state.possibleList });
      }}>
        <div>
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
              {subject.name} {/*subject.score*/}
            </span>
          </div>
          {this.renderSubjectTag(subject)}
          <div className={`font-14 height-transform ${subject.expanded ? 'visible' : 'hidden'}`}>
            {subject.description ? subject.description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
          </div>
          <div className={`second-row height-transform ${subject.expanded ? 'visible' : 'hidden'}`}>
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
          {subject.brick &&
            <div className="taste-container smaller">
              <div className="label-container">
                <div>
                  <div className="bold font-18 margin-bottom-0">Suggested Taster Topic</div>
                  <div className="font-14 brick-title-e342" dangerouslySetInnerHTML={{ __html: subject.brick.title }} />
                  <div className="btn-orange font-16" onClick={() => {
                    this.props.history.push(playCover(subject.brick));
                  }}>Try it out</div>
                </div>
              </div>
              <div>
                {this.renderCardBrick(subject)}
              </div>
            </div>}
        </div>
      </div>
    );
  }

  renderDefinities(lastStep: number) {
    if (lastStep === 6) {
      return (
        <ReactSortable
          list={this.state.definetlyList}
          animation={150}
          key={this.state.definitiesSortKey}
          className="cards-drop real"
          group={{ name: "cloning-group-name", put: this.state.canPutDefinites }}
          setList={definetlyList => {
            let emptyCount = 0;
            for (let subject of definetlyList) {
              if (subject.isEmpty) {
                emptyCount += 1;
              }
            }
            if (definetlyList.length > 3) {
              definetlyList = definetlyList.filter(s => !s.isEmpty);
            }

            if (definetlyList.length === 2) {
              definetlyList.push({ isEmpty: true } as any);
            }

            if (definetlyList.length === 1) {
              definetlyList.push({ isEmpty: true } as any);
              definetlyList.push({ isEmpty: true } as any);
            }

            if (definetlyList.length === 0) {
              definetlyList.push({ isEmpty: true } as any);
              definetlyList.push({ isEmpty: true } as any);
              definetlyList.push({ isEmpty: true } as any);
            }

            // can have 3 A-level or VAPs
            let canPutDefinites = true;
            let realCardsCount = definetlyList.filter(d => !d.isEmpty).length;
            if (realCardsCount >= 3) {
              canPutDefinites = false;
            }

            // only one T-level possible
            let hasTLevel = definetlyList.filter(d => d.isTLevel).length > 0;
            if (hasTLevel) {
              canPutDefinites = false;
            }

            if (canPutDefinites !== this.state.canPutDefinites) {
              this.setState({ definetlyList, canPutDefinites, definitiesSortKey: this.state.definitiesSortKey + 1});
            } else {
              this.setState({ definetlyList, canPutDefinites });
            }
          }}
        >
          {this.state.definetlyList.map(this.renderCard.bind(this))}
        </ReactSortable>
      );
    } else {
      return this.renderEmpty();
    }
  }

  renderPossibles(lastStep: number) {
    if (lastStep === 6) {
      return (
        <ReactSortable
          list={this.state.possibleList}
          animation={150}
          key={1}
          className="cards-drop real"
          group={{ name: "cloning-group-name" }}
          setList={possibleList => this.setState({ possibleList })}
        >
          {this.state.possibleList.map(this.renderCard.bind(this))}
        </ReactSortable>
      );
    } else {
      return this.renderEmpty();
    }
  }

  renderCollegeName(answer2: any) {
    if (answer2) {
      if (answer2.answer && answer2.answer.databaseSchool && answer2.answer.databaseSchool.name) {
        return (
          <div>
            <div className="opacity-07 font-16 m-t-1-e3">INSTITUTIONAL PROVIDER:</div>
            <div className="font-18">{answer2.answer.databaseSchool.name}</div>
          </div>
        );
      }
    }
    return <div />;
  }

  renderOutcomeTabContent() {
    let answer2 = null;
    let lastStep = 0;
    let answers = this.state.answers;

    if (answers.length > 0) {
      for (let answer of answers) {
        if (answer.step > lastStep) {
          lastStep = answer.step;
        }
      }

      answer2 = answers.find(a => a.step === 2);
    }

    const realCardsCount = this.state.definetlyList.filter(d => !d.isEmpty).length + this.state.possibleList.length;

    return (
      <div className="top-part-e354">
        <div className="tab-content-e354">
          <div className="top-header-e354 font-32">
            <SpriteIcon name="hand-icon" />
            Welcome back, {this.props.user ? this.props.user.firstName : 'User'}!
          </div>
          <div className="font-16">
            Below, you’ll find your Scholar 6 details and course outcomes based on your survey. You will also find taster subjects that you can take based on your survey results and subject rankings.
          </div>
          <div className="boxes-e354">
            <div className="box-box box-first">
              <SpriteIcon name="edit-icon-sixthform" />
              <div className="opacity-04 font-16">ACCOUNT DETAILS</div>
              <div className="font-16">{this.props.user.firstName} {this.props.user.lastName}</div>
              <div className="font-16">{this.props.user.email}</div>
              {this.renderCollegeName(answer2)}
            </div>
            {this.renderStepBox()}
          </div>
          <div className="box-e354-big">
            <div className="box-box box-first">
              <div className="font-16 top-text-cotainer opacity-04">
                <div className="first-box">
                  MY SUBJECT RANKINGS ({realCardsCount})
                </div>
                <div className="second-box">Click and drag to rearrange your subjects</div>
              </div>
              <div>
                <div className="font-20">DEFINITES</div>
                <div className="line-e354"></div>
                {this.renderDefinities(lastStep)}
              </div>
              <div>
                <div className="font-20">POSSIBLES</div>
                <div className="line-e354"></div>
                {this.renderPossibles(lastStep)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTatersTabContent() {
    let subjects = this.state.subjects.filter(s => s.brick);

    /*
    subjects.map(s => {
      let brick = {
        coverImage: "9f514d49-79ee-41ae-b238-46b752c80908.png",
        id: 3127,
        title: "<p>Introduction to Dance</p>"
      } as any;
      s.brick = brick
    });*/

    return (
      <div className="top-part-e354">
        <div className="tab-content-e354 taster-content font-30">
          <div className="bold title-above">
            Try a new subject or test yourself against<br />
            sixth form content and concepts in subjects you know.
          </div>
          <div className="bricks-container">
            {subjects.map(s => this.renderBrick(s))}
          </div>
        </div>
      </div>
    );
  }

  renderSurveyTabContent() {
    return (
      <div className="top-part-e354">
        <div className="tab-content-e354 tab-content-survey">
          <div className="flex-center">
            <img alt="brill" className="brills-icon" src="/images/SixthformSurvey.png" />
          </div>
          <div className="flex-center font-36 bold">
            Take our Six-Step Course Selector Survey
          </div>
          <div className="flex-center font-20">
            Rank and score the options you are considering with a comprehensive assessment.
          </div>
          <div className="flex-center">
            <div className="btn-orange font-20" onClick={() => {
              this.props.history.push(map.SixthformChoices);
            }}>
              Take the Survey
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTabContent() {
    if (this.state.activeTab === SixActiveTab.SubjectTasters) {
      return this.renderTatersTabContent();
    } else if (this.state.activeTab === SixActiveTab.Survey) {
      return this.renderSurveyTabContent();
    } else if (this.state.activeTab === SixActiveTab.Outcome) {
      return this.renderOutcomeTabContent();
    }
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        <div className="SixthformOutcomePage">
          <div className="header-top">
            <div className="top-left-logo-container">
              <div>
                <div className="logo-container-r23">
                  <SpriteIcon name="scholar6-white-logo" className="white-logo-r23" />
                  <SpriteIcon name="red-shape-icon-r1" className="red-shape-r23" />
                </div>
              </div>
            </div>
            <div className="logout-container">
              <div className="search-container font-32">
                {this.props.user.firstName} Dashboard
              </div>
            </div>
          </div>
          <div className="content-container-e354">
            <div>
              <div className="tab-container-e354">
                <div
                  className={`tab-e354 ${this.state.activeTab === SixActiveTab.Survey ? "active" : "not-active"}`}
                  onClick={() => {
                    this.setState({ activeTab: SixActiveTab.Survey });
                  }}
                >
                  Six Step Survey
                </div>
                <div
                  className={`tab-e354 ${this.state.activeTab === SixActiveTab.SubjectTasters ? "active" : "not-active"}`}
                  onClick={() => {
                    this.setState({ activeTab: SixActiveTab.SubjectTasters });
                  }}
                >
                  Subject Tasters
                </div>
                <div
                  className={`tab-e354 ${this.state.activeTab === SixActiveTab.Outcome ? "active" : "not-active"}`}
                  onClick={() => {
                    this.setState({ activeTab: SixActiveTab.Outcome });
                  }}
                >
                  My Outcomes
                </div>
              </div>
              {this.renderTabContent()}
            </div>
          </div>
        </div>
      </React.Suspense>
    );
  }
}


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(SixthformChoices);
