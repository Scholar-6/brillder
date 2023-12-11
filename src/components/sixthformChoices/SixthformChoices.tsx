import React, { Component } from "react";

import "./SixthformChoices.scss";
import { User } from "model/user";
import { SixthformSubject, getSixthformSubjects } from "services/axios/sixthformChoices";

import HomeButton from "components/baseComponents/homeButton/HomeButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import FirstQuestion from "./components/FirstQuestion";
import SecondQuestion from "./components/ThirdQuestion";
import ThirdQuestion from "./components/ThirdQuestion";
import moment from "moment";


interface UserProfileProps {
  user: User;
  location: any;
  history: any;
  match: any;
}

enum Pages {
  Welcome = 1,
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
  page: Pages;
}

class SixthformChoices extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      subjectType: SubjectType.AllSubjects,
      allSubjects: [],
      subjects: [],
      page: Pages.Welcome,
    }

    let momen2t = moment(new Date());

    var duration = moment.duration(momen2t.diff(new Date('12 11 2023')));
    var hours = duration.asHours();

    let sss = duration.asMilliseconds();

    console.log(hours, sss);

    this.loadSubjects();
  }

  async loadSubjects() {
    const subjects = await getSixthformSubjects();
    if (subjects) {
      this.setState({subjects, allSubjects: subjects});
    }
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
          <button className="absolute-contunue-btn font-25" onClick={() => this.setState({page: Pages.Question1})}>Continue</button>
        </div>
      );
    }

    if (this.state.page === Pages.Question1) {
      return <FirstQuestion moveNext={() => this.setState({page: Pages.Question2})} moveBack={() => this.setState({page: Pages.Welcome})} />
    } else if (this.state.page === Pages.Question2) {
      return <SecondQuestion moveNext={() => this.setState({page: Pages.Question3})} moveBack={() => this.setState({page: Pages.Question1})} />
    } else if (this.state.page === Pages.Question3) {
      return <ThirdQuestion moveNext={() => this.setState({page: Pages.Question4})} moveBack={() => this.setState({page: Pages.Question2})} />
    } else if (this.state.page === Pages.Question4) {
      //return <FourthQuestion setPage={setPage} />
    }
    return <div />;
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        <div className="page1 dashboard-page SixthformChoicesPage">
          <div className="header-top">
            <HomeButton link={"/home"} history={history} />
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
                {this.renderSidebarCheckbox(4, 'All Subjects')}
              </div>
              <div className="subjects-scrollbar font-16">
                {this.state.subjects.map((subject, i) => {
                  return <div key={i} onMouseEnter={() => {
                    setTimeout(() => {
                      //setHoveredSubject(subject);
                    }, 1000);
                  }}>
                    <div className="circle" />
                    <div>{subject.name}</div>
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
