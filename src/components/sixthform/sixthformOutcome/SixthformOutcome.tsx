import React, { Component } from "react";
import { connect } from 'react-redux';

import "./SixthformOutcome.scss";
import { User } from "model/user";
import {
  SixthformSubject, UserSubjectChoice, getSixthformAnswers, getSixthformSubjects
} from "services/axios/sixthformChoices";

import { ReduxCombinedState } from 'redux/reducers';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarSixthformV2 from "../sixthformChoices/components/progressBar/ProgressBarSixthformV2";
import map from "components/map";


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
  allSubjects: SixthformSubject[];
  subjects: SixthformSubject[];
  answers: any[];
  activeTab: SixActiveTab;
}

class SixthformChoices extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    console.log(props);

    this.state = {
      allSubjects: [],
      subjects: [],
      answers: [],
      activeTab: SixActiveTab.Outcome,
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


      let steps = 0;

      for (let answer of answers) {
        if (answer.answer) {
          steps += 1;
        }
      }

      console.log('res', answers)


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

  renderStepBox() {
    let answers = this.state.answers;
    console.log(answers);
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
            </div>
            <div className="flex-center">
              <span className="font-64">100%</span>
            </div>
            <div className="flex-center">
              <div className="font-36">COMPLETED</div>
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
                Joan’s Dashboard
              </div>
            </div>
          </div>
          <div className="content-container-e354">
            <div>
              <div className="tab-container-e354">
                <div
                  className={`tab-e354 ${this.state.activeTab === SixActiveTab.Survey ? "active" : "not-active"}`}
                >
                  Six Step Survey
                </div>
                <div
                  className={`tab-e354 ${this.state.activeTab === SixActiveTab.SubjectTasters ? "active" : "not-active"}`}
                  onClick={() => {

                  }}
                >
                  Subject Tasters
                </div>
                <div
                  className={`tab-e354 ${this.state.activeTab === SixActiveTab.Outcome ? "active" : "not-active"}`}
                  onClick={() => {

                  }}
                >
                  My Outcomes
                </div>
              </div>
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
                      <div className="font-20">{this.props.user.firstName} {this.props.user.lastName}</div>
                      <div className="font-20">{this.props.user.email}</div>
                      <div className="opacity-07 font-16 m-t-1-e3">INSTITUTIONAL PROVIDER:</div>
                      <div className="font-20">Hereford Sixth Form College</div>
                    </div>
                    {this.renderStepBox()}
                  </div>
                  <div className="box-e354-big">
                    <div className="box-box box-first">
                      <div className="font-16 top-text-cotainer opacity-04">
                        <div className="first-box">MY SUBJECT RANKINGS (8)</div>
                        <div className="second-box">Click and drag to rearrange your subjects</div>
                      </div>
                      <div>
                        <div className="font-20">DEFINITES</div>
                        <div className="line-e354"></div>
                        <div className="cards-drop empty">
                          <SpriteIcon name="empty-category-e354" className="first" />
                          <SpriteIcon name="empty-category-e354" />
                          <SpriteIcon name="empty-category-e354" className="last" />
                        </div>
                      </div>
                      <div>
                        <div className="font-20">PROBABLES</div>
                        <div className="line-e354"></div>
                        <div className="cards-drop empty">
                          <SpriteIcon name="empty-category-e354" className="first" />
                          <SpriteIcon name="empty-category-e354" />
                          <SpriteIcon name="empty-category-e354" className="last" />
                        </div>
                      </div>
                      <div>
                        <div className="font-20">POSSIBLES</div>
                        <div className="line-e354"></div>
                        <div className="cards-drop empty">
                          <SpriteIcon name="empty-category-e354" className="first" />
                          <SpriteIcon name="empty-category-e354" />
                          <SpriteIcon name="empty-category-e354" className="last" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
