import React, { Component } from "react";

import { SixthformSubject } from "services/axios/sixthformChoices";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { AcademicLevelLabels, SubjectGroup } from "model/brick";


function fileUrl(fileName: string) {
  if (!fileName) { return '' }
  return `${process.env.REACT_APP_AWS_S3_IMAGES_BUCKET_NAME}/files/${fileName}`;
}


interface UserProfileProps {
  subjects: SixthformSubject[];
}

interface UserProfileState {
  searchString: string;
  filters: any[];
  filterPopupOpen: boolean;
}

class SixthformTasters extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      searchString: "",
      filters: [{
        name: "Arts",
        selected: false
      }, {
        name: "Languages",
        selected: false
      }, {
        name: "Humanities",
        selected: false
      }, {
        name: "STEM",
        selected: false
      }],
      filterPopupOpen: false,
    }
  }

  renderSubjectCircle(subject: SixthformSubject) {
    let brick = subject.brick;
    if (brick) {
      let subjectColor = brick.subject ? brick.subject.color : '';
      let alternateColor = brick.alternateSubject ? brick.alternateSubject.color : subjectColor;
      return (
        <div className="level-and-length">
          <div className="level before-alternative">
            <div style={{ background: alternateColor }}>
              <div className="level">
                <div style={{ background: subjectColor }}>
                  {AcademicLevelLabels[brick.academicLevel]}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return '';
  }

  renderBrick(subject: SixthformSubject, i: number) {
    if (subject.brick) {
      return (
        <div className="brick-container-23" key={i}>
          <div className="brick-container" onClick={() => {
            if (subject.brick) {
              window.location.href = 'https://app.brillder.com/play/brick/' + subject.brick.id + '/cover';
            }
          }}>
            <div className="scroll-block" style={{ backgroundImage: `url(${fileUrl(subject.brick.coverImage)})` }}>
              {this.renderSubjectCircle(subject)}
            </div>
            <div className="bottom-description-color" />
            <div className="bottom-description font-12 bold" dangerouslySetInnerHTML={{ __html: subject.brick.title }} />
          </div>
          <div className="subjectName font-12">{subject.name}</div>
        </div>
      );
    }
  }

  renderFilter() {
    const activeFilters = this.state.filters.filter(f => f.selected === true);
    return (
      <div className="filter-box">
        <div className={`filter-btn font-20 ${this.state.filterPopupOpen ? 'active' : ''}`} onClick={() => {
          this.setState({ filterPopupOpen: !this.state.filterPopupOpen });
        }}>
          Filter
          {activeFilters.length > 0 ? <SpriteIcon name="circle-filled" /> : ''}
        </div>
        <SpriteIcon name="filter-tasters" />
        {this.state.filterPopupOpen &&
          <div className="filter-popup font-16">
            <div className="label-container">
              <SpriteIcon name="filter-tasters" />
              <span>Filter</span>
            </div>
            {this.state.filters.map(f => {
              return <div key={f} className={`font-14 filter-option ${f.selected ? 'selected' : ''}`} onClick={() => {
                f.selected = !f.selected;
                this.setState({ filters: this.state.filters });
              }}>
                {f.name}
                {f.selected ? <SpriteIcon name="check-icon" /> : ''}
              </div>
            })}
          </div>
        }

        {this.state.filterPopupOpen && <div className="filter-popup-container" onClick={() => {
          this.setState({ filterPopupOpen: false });
        }}>
        </div>}
      </div>
    );
  }

  render() {
    let subjects = this.props.subjects.filter(s => s.brick);

    let finalSubjects = subjects;

    const filters = this.state.filters.filter(f => f.selected == true);

    if (filters.length > 0) {
      finalSubjects = subjects.filter(s => {
        if (s.brick && s.brick.subject) {
          let group = s.brick.subject.group;

          if (group === SubjectGroup.Arts && filters.find(f => f.name === "Arts")) {
            return true;
          }
          if (group === SubjectGroup.Languages && filters.find(f => f.name === "Languages")) {
            return true;
          }
          if (group === SubjectGroup.HumanitiesAndSocialSciences && filters.find(f => f.name === "Humanities")) {
            return true;
          }
          if (group === SubjectGroup.Science && filters.find(f => f.name === "STEM")) {
            return true;
          }
          if (group === SubjectGroup.MathsAndComputing && filters.find(f => f.name === "STEM")) {
            return true;
          }
        }
      });
    }

    let finalFinalSubjects = finalSubjects;
    if (this.state.searchString && this.state.searchString.length >= 3) {
      finalFinalSubjects = finalSubjects.filter(s => {
        if (s.brick) {
          return s.brick.title.toLowerCase().includes(this.state.searchString.toLowerCase()) || s.name.toLowerCase().includes(this.state.searchString.toLowerCase());
        }
        return false;
      });
    }

    return (
      <div className="top-part-e354">
        <div className="tab-content-e354-container">
          <div className="tab-content-e354 taster-content">
            <div className="flex-center">
              <div className="bold title-above font-28">
                Try a new subject or test yourself against<br />
                sixth form content and concepts in subjects you know.
              </div>
              <div className="search-box">
                <SpriteIcon name="search-tasters" />
                <input className="font-20" placeholder="Search" value={this.state.searchString} onChange={e => this.setState({ searchString: e.target.value })} />
              </div>
              {this.renderFilter()}
            </div>
            <div className="bricks-container">
              {finalFinalSubjects.map((s, i) => this.renderBrick(s, i))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SixthformTasters;
