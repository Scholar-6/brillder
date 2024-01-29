import React, { Component } from "react";

import "./SixthformOutcome.scss";
import { User } from "model/user";
import {
  SixthformSubject, UserSubjectChoice, getSixthformAnswers, getSixthformSubjects
} from "services/axios/sixthformChoices";

import SpriteIcon from "components/baseComponents/SpriteIcon";


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
  activeTab: SixActiveTab;
}

class SixthformChoices extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      subjectType: SubjectType.AllSubjects,
      allSubjects: [],
      subjects: [],
      answers: [],
      activeTab: SixActiveTab.Outcome,
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
              </div>
            </div>
          </div>
          <div className="content-container-e354">
            <div>
              <div className="tab-container-e354">
                <div className="tab-e354">Six Step Survey</div>
                <div className="tab-e354">Subject Tasters</div>
                <div className="tab-e354">My Outcomes</div>
              </div>
              <div>
                content
              </div>
            </div>
          </div>
        </div>
      </React.Suspense>
    );
  }
}

export default SixthformChoices;
