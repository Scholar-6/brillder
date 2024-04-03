import React, { Component } from "react";
import { connect } from 'react-redux';
import { ReactSortable } from "react-sortablejs";

import "./SixthformOutcome.scss";
import { User } from "model/user";
import {
  SixthformSubject, UserSubjectChoice, getSixthformAnswers, getSixthformSubjects2, setSixthformSubjectChoice
} from "services/axios/sixthformChoices";

import { ReduxCombinedState } from 'redux/reducers';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import { fileUrl } from "components/services/uploadFile";
import { playCover } from "components/play/routes";
import SubjectTasters from "./subjectTasters/SubjectTasters";
import { Pages, SubjectType } from "../sixthformChoices/SixthformChoices";
import ProgressBox from "./ProgressBox";
import TopMenu from "./TopMenu";
import ProfilePage from "./ProfilePage";


interface UserProfileProps {
  user: User;
  location: any;
  history: any;
  match: any;
}

export enum SixActivePage {
  SubjectTasters,
  Outcome,
  Profile,
}

interface UserProfileState {
  filters: any[];
  answers: any[];
  definetlyList: SixthformSubject[];
  possibleList: SixthformSubject[];
  subjects: SixthformSubject[];
  otherSubjects: SixthformSubject[];
  activePage: SixActivePage;
  canPutDefinites: boolean;
  definitiesSortKey: number;
  loading: boolean;
}

class SixthformChoices extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    let activePage = SixActivePage.Outcome;

    if (props.match.path === map.SixthformTaster) {
      activePage = SixActivePage.SubjectTasters;
    } else if (props.match.path === map.SixthformProfile) {
      activePage = SixActivePage.Profile;
    }

    this.state = {
      loading: true,
      filters: [],
      answers: [],
      definetlyList: [],
      possibleList: [],
      subjects: [],
      otherSubjects: [],
      activePage,
      canPutDefinites: true,
      definitiesSortKey: 1,
    }

    this.loadSubjects();
  }

  async loadSubjects() {
    const subjects = await getSixthformSubjects2();
    const answers = await getSixthformAnswers() || [];

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
    }

    if (subjects) {
      for (let subject of subjects) {
        if (!subject.userChoice) {
          subject.userChoice = UserSubjectChoice.Maybe;
        }
      }
      let subjectsSorted = this.sortByScore(subjects);
      let definetlyList: any[] = subjects.filter(s => s.userChoice === UserSubjectChoice.Definetly);
      let subjectsR1 = subjectsSorted.filter(s => s.userChoice !== UserSubjectChoice.Definetly);

      let possibleList = subjectsR1.splice(0, 6);

      if (answers) {
        var firstAnswer = answers.find(a => a.step === Pages.Question1);
        if (firstAnswer && firstAnswer.answer) {
          if (firstAnswer.answer.subjectType === SubjectType.ALevels) {
            subjectsR1 = subjectsR1.filter(s => s.isALevel);
            possibleList = subjectsR1.splice(0, 6);
          } else if (firstAnswer.answer.subjectType === SubjectType.VocationalSubjects) {
            subjectsR1 = subjectsR1.filter(s => s.isVocational);
            possibleList = subjectsR1.splice(0, 6);
          }
        }
      }

      if (definetlyList.length === 0) {
        definetlyList.push({ isEmpty: true });
        definetlyList.push({ isEmpty: true });
        definetlyList.push({ isEmpty: true });
      }
      this.setState({ definetlyList, answers, loading: false, subjects, otherSubjects: subjectsR1, possibleList });
    } else {
      this.setState({ loading: false });
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

  renderCardBrick(subject: SixthformSubject) {
    if (subject.brick) {
      return (
        <div className="brick-container">
          <div
            className="scroll-block"
            style={{ backgroundImage: `url(${fileUrl(subject.brick.coverImage)})` }}
            onClick={() => {
              if (subject.brick) {
                this.props.history.push(playCover(subject.brick));
              }
            }}
          ></div>
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
      label = 'T-level';
    } else if (subject.isALevel) {
      label = 'A-level';
    }
    return <div className="level-round font-14">{label}</div>
  }

  renderCardDescription(subject: SixthformSubject) {
    let visible = false;
    if (subject.expanded) {
      visible = true;
    }
    if (!subject.brick) {
      visible = true;
    }
    return (
      <div className={`font-14 height-transform ${visible ? 'visible' : 'hidden'}`}>
        {subject.description && subject.description}
      </div>
    );
  }

  renderCard(subject: SixthformSubject, i: number, isDefinities: boolean = false) {
    if (subject.isEmpty) {
      return (
        <div className="subject-group first font-16" key={i}>
          Select and drag from the subject cards below to<br />
          choose your Definites.
        </div>
      )
    }

    if (isDefinities && subject.isTLevel) {
      return (
        <div className="subject-sixth-card T-level" key={i} onMouseEnter={() => {
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
            <div className="subject-name font-24">
              <span className="left-part-e323">
                {this.renderCircle(subject)}
                <span className="subject-name-only bold">
                  {subject.name} {/*subject.score*/}
                </span>
                {this.renderSubjectTag(subject)}
              </span>
              <span className="font-14 right-part-e323">This subject is a T-level course, meaning you can only select to do this at Sixth Form.</span>
            </div>

            <div className="flex-box-e234">
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
              </div>
              {subject.brick &&
                <div className="taste-container smaller">
                  <div className="label-container">
                    <div>
                      <div className="bold font-18 margin-bottom-0">Suggested Taster Topic</div>
                      <div className="font-14 brick-title-e342" dangerouslySetInnerHTML={{ __html: subject.brick.title }} />
                      <div className="btn-orange font-16" onClick={() => {
                        if (subject.brick) {
                          this.props.history.push(playCover(subject.brick));
                        }
                      }}>Try it out</div>
                    </div>
                  </div>
                  <div>
                    {this.renderCardBrick(subject)}
                  </div>
                </div>}
            </div>
          </div>
        </div>
      );
    }

    if (subject.brick && subject.attempt) {
      const a = subject.attempt;
      let percentages = 0;
      if (typeof a.oldScore === null) {
        percentages = Math.round(a.score * 100 / a.maxScore);
      } else {
        const middleScore = (a.score + a.oldScore) / 2;
        percentages = Math.round(middleScore * 100 / a.maxScore);
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
              {subject.description && subject.description}
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
                    <div className="bold font-18 margin-bottom-0">Completed Taster Topic</div>
                    <div className="font-14 brick-title-e342" dangerouslySetInnerHTML={{ __html: subject.brick.title }} />
                    <div className="font-32 percentages">{percentages}%</div>
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
          {this.renderCardDescription(subject)}
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
                    if (subject.brick) {
                      this.props.history.push(playCover(subject.brick));
                    }
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
    if (lastStep === Pages.Question6) {
      return (
        <ReactSortable
          list={this.state.definetlyList}
          animation={150}
          key={this.state.definitiesSortKey}
          className="cards-drop real definities-list"
          group={{ name: "cloning-group-name", put: this.state.canPutDefinites }}
          setList={definetlyList => {
            // updating server data
            // find subject that don`t have definetly and send request to server
            if (definetlyList.length > this.state.definetlyList.length) {
              for (let subject of definetlyList) {
                if (!subject.isEmpty && subject.userChoice !== UserSubjectChoice.Definetly) {
                  subject.userChoice = UserSubjectChoice.Definetly;
                  setSixthformSubjectChoice(subject);
                }
              }
            }

            let emptyCount = 0;
            for (let subject of definetlyList) {
              if (subject.isEmpty) {
                emptyCount += 1;
              }
            }

            // add boxes if less than 3 based on number of items
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
            if (realCardsCount >= 4) {
              canPutDefinites = false;
            }

            // only one T-level possible
            let possibleList = this.state.possibleList;
            let hasTLevel = definetlyList.filter(d => d.isTLevel).length > 0;
            if (hasTLevel) {
              canPutDefinites = false;

              // T-level selected move other subjects to bottom
              let otherSubjects = this.state.definetlyList.filter(d => !d.isEmpty).filter(d => !d.isTLevel);
              if (otherSubjects && otherSubjects.length > 0) {
                possibleList.push(...otherSubjects);
              }

              // other subjects except T-level removed
              let index = definetlyList.findIndex(d => !d.isTLevel);
              if (index >= 0) {
                definetlyList.splice(index, 1);
              }

              let index2 = definetlyList.findIndex(d => !d.isTLevel);
              if (index2) {
                definetlyList.splice(index2, 1);
              }
            }

            // filter same type of subjects
            possibleList = possibleList.filter((value: any, index: number, self) =>
              index === self.findIndex((t) => (
                t.id === value.id
              ))
            )

            if (canPutDefinites !== this.state.canPutDefinites) {
              this.setState({
                definetlyList, possibleList,
                canPutDefinites,
                definitiesSortKey: this.state.definitiesSortKey + 1
              });
            } else {
              this.setState({ definetlyList, canPutDefinites, possibleList });
            }
          }}
        >
          {this.state.definetlyList.map((s, i) => this.renderCard(s, i, true))}
        </ReactSortable>
      );
    } else {
      return this.renderEmpty();
    }
  }

  renderPossibles(lastStep: number) {
    if (lastStep === Pages.Question6) {
      return (
        <ReactSortable
          list={this.state.possibleList}
          animation={150}
          key={1}
          className="cards-drop real"
          group={{ name: "cloning-group-name" }}
          setList={possibleList => {
            // updating server data
            // find subject that have definetly and send request to server
            if (possibleList.length > this.state.possibleList.length) {
              for (let subject of possibleList) {
                if (!subject.isEmpty && subject.userChoice === UserSubjectChoice.Definetly) {
                  subject.userChoice = UserSubjectChoice.Maybe;
                  setSixthformSubjectChoice(subject);
                }
              }
            }

            let otherSubjects = this.state.otherSubjects;
            if (possibleList.length < 6) {
              let subject = otherSubjects.splice(0, 1);
              possibleList.push(subject[0]);
            }
            this.setState({ possibleList, otherSubjects });
          }}
        >
          {this.state.possibleList.map((s, i) => this.renderCard(s, i))}
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

  renderOutcomeTabContent(progressScore: number) {
    let lastStep = 0;
    let answers = this.state.answers;

    if (answers.length > 0) {
      for (let answer of answers) {
        if (answer.step > lastStep) {
          lastStep = answer.step;
        }
      }
    }

    return (
      <div className="top-part-e354">
        <div className="tab-content-e354-container">
          <div className="tab-content-e354">
            <div className="font-32 bold">My Outcomes</div>
            <div className="font-16 light">
              Below, you’ll find your Scholar 6 details and course outcomes based on your survey. You will also find taster subjects that you can take based on your survey results and subject rankings.
            </div>
            <div className="boxes-e354">
              <ProgressBox progress={progressScore} history={this.props.history} answers={this.state.answers} loading={this.state.loading} />
            </div>
            <div className="box-e354-big">
              <div className="box-box box-first">
                <div>
                  <div className="font-20 definity-label-container">
                    <span className="font-20">MY DEFINITES</span>
                    <span className="font-16 grey-text">You can always change your mind later</span>
                  </div>
                  <div className="line-e354"></div>
                  {this.renderDefinities(lastStep)}
                </div>
                <div>
                  <div className="font-20">MY POSSIBLES</div>
                  <div className="line-e354"></div>
                  {this.renderPossibles(lastStep)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTatersTabContent() {
    return (
      <SubjectTasters subjects={this.state.subjects} history={this.props.history} />
    );
  }

  renderTabContent(progressScore: number) {
    if (this.state.activePage === SixActivePage.SubjectTasters) {
      return this.renderTatersTabContent();
    } else if (this.state.activePage === SixActivePage.Outcome) {
      return this.renderOutcomeTabContent(progressScore);
    } else if (this.state.activePage === SixActivePage.Profile) {
      return <ProfilePage user={this.props.user} />;
    }
  }

  render() {
    const progressScore = Math.round((this.state.answers.length / 7) * 100);
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
            <TopMenu
              activePage={this.state.activePage}
              setActivePage={activePage => this.setState({ activePage })}
              progress={progressScore} history={this.props.history}
            />
          </div>
          <div className="content-container-e354">
            {this.renderTabContent(progressScore)}
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
