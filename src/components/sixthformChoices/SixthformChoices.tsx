import React, { Component } from "react";

import "./SixthformChoices.scss";
import { User } from "model/user";
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import FirstQuestion from "./components/FirstQuestion";
import SecondQuestion from "./components/ThirdQuestion";
import ThirdQuestion from "./components/ThirdQuestion";

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
  vocationalSubjects: any[];
  ALevels: any[];
  subjects: any[];
  page: Pages;
}

class SixthformChoices extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    let ALevels = [
      'Mathematics',
      'Psychology',
      'Biology',
      'Chemistry',
      'Sociology',
      'History',
      'Business',
      'Economics',
      'Physics',
      'Geography',
      'English Literature',
      'Politics',
      'Computer Science',
      'Religious Studies',
      'Media Studies',
      'Law',
      'Art and Design (Fine Art)',
      'English Language',
      'Further Mathematics',
      'Physical Education',
      'Art and Design (Photography)',
      'Drama and Theatre',
      'Design and Technology: Product Design',
      'Spanish',
      'Film Studies',
      'English Language and Literature',
      'French',
      'Art and Design (Art, Craft and Design)',
      'Art and Design (Graphic Communication)',
      'Classical Civilisation',
      'Philosophy',
      'Music',
      'Art and Design (Textile Design)',
      'Accounting',
      'Other languages',
      'German',
      'Art and Design (Three-dimensional design)',
      'Environmental Science',
      'Music Technology',
      'Dance',
      'Latin',
      'Geology',
      'Ancient Hist',
      'Hist of Art',
      'Electronics',
      'Design and Technology: Design Engineering',
      'Design and Technology: Fashion and Textiles',
      'Classical Greek',
      'Art and Design (Critical and Contextual Studies)',
      'Biblical Hebrew',
    ];

    let vocationalSubjects = [
      'Animal Care',
      'Art & Design ',
      'Automotive & Vehicle ',
      'Business & Enterprise',
      'Catering & Hospitality',
      'Child Development & Care',
      'Dance',
      'Built Environment (Construction)',
      'Built Environment (Design)',
      'Creative Media',
      'Digital & IT',
      'Engineering Technology',
      'Event Operations',
      'Hair & Beauty',
      'Health & Social Care',
      'Interactive Media',
      'Land Based Studies',
      'Music',
      'Music (General)',
      'Music (Instrument & Performance)',
      'Music (Technology)',
      'Music (Theory)',
      'Performing Arts',
      'Maintenance & Service Engineering',
      'Sport, Activity & Fitness',
      'Travel & Tourism',
    ];

    this.state = {
      subjectType: SubjectType.AllSubjects,
      vocationalSubjects,
      ALevels,
      subjects: [...vocationalSubjects, ...ALevels],
      page: Pages.Welcome,
    }

    this.loadSubjects();
  }

  async loadSubjects() {

  }

  renderSidebarCheckbox(currentSubjectType: SubjectType, label: string) {
    return (
      <label className="check-box-container container font-16" onClick={() => {
        let subjects: any[] = [];
        if (currentSubjectType === SubjectType.ALevels) {
          subjects = this.state.ALevels;

        } else if (currentSubjectType === SubjectType.VocationalSubjects) {
          subjects = this.state.vocationalSubjects;
        } else if (currentSubjectType === 4) {
          subjects = [...this.state.vocationalSubjects, ...this.state.ALevels];
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
                    <div>{subject}</div>
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
