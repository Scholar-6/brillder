import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import { MenuItem, Select } from "@material-ui/core";

import './BrickPlayedPopup.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User, UserType } from "model/user";
import { fileUrl } from "components/services/uploadFile";
import BrickTitle from "components/baseComponents/BrickTitle";
import { AcademicLevelLabels, Brick, Subject } from "model/brick";
import { getFormattedDate } from "components/services/brickService";
import { playCover } from "components/play/routes";
import { PDateFilter } from "./BricksPlayedSidebar";

enum CopyOptions {
  CopyAll = 1,
  CopyLearners,
  CopyEducators
}

interface DateObj {
  value: PDateFilter,
  text: string;
}

interface CopyEmailObj {
  value: CopyOptions,
  text: string;
}

interface TeachProps {
  brick: Brick;
  history: any;
  dateFilter: PDateFilter;
  brickAttempts: any[];
  assignments: any[];
  subjects: Subject[];
  close(): void;
}

interface TeachState {
  coverLoaded: boolean;
  selectedDate: DateObj;
  dateArray: DateObj[];
  emailCopyOptions: CopyEmailObj[];
  classesExpanded: boolean,
  playersExpanded: boolean,

  assignments: any[];
  attempts: any[];

}

class BrickPlayedPopup extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    const dateArray = [
      {
        value: PDateFilter.Past24Hours,
        text: 'Past 24 hours'
      }, {
        value: PDateFilter.PastWeek,
        text: 'Past Week'
      }, {
        value: PDateFilter.PastMonth,
        text: 'Past Month'
      }, {
        value: PDateFilter.PastYear,
        text: 'Past Year'
      }, {
        value: PDateFilter.AllTime,
        text: 'All Time'
      }
    ];

    const emailCopyOptions = [
      {
        value: CopyOptions.CopyAll,
        text: 'Copy all'
      },
      {
        value: CopyOptions.CopyLearners,
        text: 'Copy learners'
      }, {
        value: CopyOptions.CopyEducators,
        text: 'Copy educators'
      }
    ];

    let selectedDate = dateArray.find(d => d.value === this.props.dateFilter);
    if (!selectedDate) {
      selectedDate = dateArray[0];
    }

    const attempts = this.filterByDate(this.props.brickAttempts, selectedDate.value);

    this.state = {
      coverLoaded: false,
      selectedDate,
      emailCopyOptions,
      classesExpanded: true,
      playersExpanded: true,
      dateArray,
      attempts,
      assignments: this.props.assignments
    }
  }

  filterByDate(brickAttempts: any[], dateFilter: PDateFilter) {
    if (dateFilter === PDateFilter.AllTime) {
      return brickAttempts;
    }

    // timestamp

    const date = new Date();
    let dateNumber = date.getTime();

    if (dateFilter === PDateFilter.Past24Hours) {
      dateNumber = date.setDate(date.getDate() - 1);
    } else if (dateFilter === PDateFilter.PastWeek) {
      dateNumber = date.setDate(date.getDate() - 7);
    } else if (dateFilter === PDateFilter.PastMonth) {
      dateNumber = date.setMonth(date.getMonth() - 1);
    } else if (dateFilter === PDateFilter.PastYear) {
      dateNumber = date.setFullYear(date.getFullYear() - 1);
    }

    var attempts = brickAttempts.filter(b => {
      const date = new Date(b.timestamp).getTime();
      return (dateNumber > date) ? false : true;
    });

    return attempts;
  }

  filterByDate2(brickAssignments: any[], dateFilter: PDateFilter) {
    if (dateFilter === PDateFilter.AllTime) {
      return brickAssignments;
    }

    // timestamp

    const date = new Date();
    let dateNumber = date.getTime();

    if (dateFilter === PDateFilter.Past24Hours) {
      dateNumber = date.setDate(date.getDate() - 1);
    } else if (dateFilter === PDateFilter.PastWeek) {
      dateNumber = date.setDate(date.getDate() - 7);
    } else if (dateFilter === PDateFilter.PastMonth) {
      dateNumber = date.setMonth(date.getMonth() - 1);
    } else if (dateFilter === PDateFilter.PastYear) {
      dateNumber = date.setFullYear(date.getFullYear() - 1);
    }

    var assignments = brickAssignments.filter(b => {
      const date = new Date(b.assignedDate).getTime();
      return (dateNumber > date) ? false : true;
    });

    return assignments;
  }

  renderUserType(u: User) {
    if (u.roles) {
      if (u.roles.find(r => r.roleId === UserType.Admin)) {
        return 'Admin';
      } else if (u.roles.find(r => r.roleId === UserType.Publisher)) {
        return 'Publisher';
      } else if (u.roles.find(r => r.roleId === UserType.Institution)) {
        return 'Institution';
      } else if (u.userPreference) {
        const { preferenceId } = u.userPreference;
        if (preferenceId === UserType.Student) {
          return 'Learner';
        } else if (preferenceId === UserType.Builder) {
          return 'Builder';
        } else if (preferenceId === UserType.Teacher) {
          return 'Educator';
        }
      }
    }
    return '';
  }

  renderStudent(u: User) {
    if (u) {
      return u.firstName + ' ' + (u.lastName ? u.lastName : '');
    }
    return '';
  }

  renderAttempts() {
    const brickAttempts = this.state.attempts;
    const uniqueAttempts: any[] = [];

    for (let attempt of brickAttempts) {
      let found = uniqueAttempts.find(sr => {
        if (attempt.student) {
          if (sr.studentId === attempt.studentId) {
            return true;
          }
        }
        // guests
        if (sr.studentId === attempt.studentId) {
          return true;
        }
        return false;
      });
      if (!found) {
        if (attempt.student) {
          uniqueAttempts.push(attempt);
        }
      }
    }

    let i = 1;
    const data = [];

    for (let attempt of uniqueAttempts) {
      i += 1;
      const { student } = attempt;

      let score = 0;

      try {
        if (attempt.oldScore) {
          score = Math.round(((attempt.score + attempt.oldScore) / attempt.maxScore) * 50);
        } else {
          score = Math.round((attempt.score / attempt.maxScore) * 100);
        }
      } catch { }

      data.push(<div className="userRow" key={i}>
        <div className="student-name">
          {this.renderStudent(attempt.student)}
        </div>
        <div>{score}</div>
        <div className="type-column">
          {this.renderUserType(student)}
        </div>
        <div>
          Public
        </div>
        <div className="email-column">{student.email}</div>
      </div>
      );
    }

    return data;
  }

  renderAssignments() {
    const data = [];
    const assignments = this.state.assignments;


    for (let assignment of assignments) {
      const { classroom } = assignment;

      if (classroom) {
        data.push(<div className="userRow classes-column">
          <div className="student-name">{classroom.name}</div>
          <div className="assign">1</div>
          <div className="students">{assignment.classroom.students.length}</div>
          <div className="teacher">{classroom.teachers.map((t: any) => t.firstName + ' ' + t.lastName)}</div>
          <div className="version">Public</div>
          <div className="teacher-email">{classroom.teachers.map((t: any) => t.email)}</div>
        </div>
        );
      } else {
        console.log('assignment without classroom', assignment);
      }
    }

    return data;
  }

  getAssignmentEmails(assignments: any[]) {
    const teachers2 = [];
    for (let a of assignments) {
      teachers2.push(...a.classroom.teachers)
    }

    const teacherEmails = teachers2.map(t => t.email);

    const uniqueEmails: any[] = [];

    for (let email of teacherEmails) {
      let found = uniqueEmails.find(loopEmail => loopEmail === email);
      if (!found) {
        uniqueEmails.push(email);
      }
    }
    return uniqueEmails;
  }

  getAttemptEmails(attempts: any[]) {
    const teacherEmails = attempts.map(a => a.student.email);
    const uniqueEmails: any[] = [];

    for (let email of teacherEmails) {
      let found = uniqueEmails.find(loopEmail => loopEmail === email);
      if (!found) {
        uniqueEmails.push(email);
      }
    }
    return uniqueEmails;
  }

  render() {
    const { brick } = this.props;
    const subject = this.props.subjects.find(s => s.id === brick.subjectId);

    return (
      <Dialog className="brick-played-popup" open={!!brick} onClose={this.props.close}>
        <div className="brick-played-popup-inner">
          <div className="header">
            <div>Brick Data</div>
            <SpriteIcon name="cancel-custom" className="close-btn" onClick={e => {
              this.props.close();
            }} />
          </div>
          <div>
            <div className="assign-brick-d343">
              <div>
                <div className="assign-cover-image">
                  <img
                    alt=""
                    className={this.state.coverLoaded ? ' visible' : 'hidden'}
                    onLoad={() => this.setState({ coverLoaded: true })}
                    src={fileUrl(brick.coverImage)}
                  />
                </div>
                <div className="plays-count">Plays: {this.state.attempts.length}</div>
              </div>
              <div className="short-brick-info long">
                <div className="link-description">
                  <BrickTitle title={brick ? brick.title : ''} />
                  {brick.adaptedFrom ?
                    <div className="core-buble">
                      <SpriteIcon name="copy-sw2" />
                      Adapted
                    </div> :
                    brick.isCore ?
                      <div className="core-buble">
                        <SpriteIcon name="globe" />
                        Public
                      </div> : <div className="core-buble">
                        <SpriteIcon name="key" />
                        Private
                      </div>}
                </div>
                <div className="link-info">
                  {brick.author.firstName} {brick.author.lastName}, {brick.author.email}
                </div>
                <div className="link-info">
                  Published: {brick.datePublished ? getFormattedDate(brick.datePublished) : ''} | Updated: {getFormattedDate(brick.updated)}
                </div>
                <div className="link-info">
                  {subject?.name}, Level {AcademicLevelLabels[brick.academicLevel]}, {brick.brickLength} mins, ID: #{brick.id}
                </div>
              </div>
              <div className="top-right-btns">
                <Select
                  className="selected-date"
                  value={this.state.selectedDate}
                  MenuProps={{ classes: { paper: 'select-time-list' } }}
                  onChange={e => {
                    const selectedDate = e.target.value as any;
                    const attempts = this.filterByDate(this.props.brickAttempts, selectedDate.value);
                    const assignments = this.filterByDate2(this.props.assignments, selectedDate.value);
                    this.setState({ selectedDate, assignments, attempts });
                  }}
                >
                  {this.state.dateArray.map((c, i) => <MenuItem value={c as any} key={i}>{c.text}</MenuItem>)}
                </Select>
                <div className="btn-green" onClick={() => {
                  this.props.history.push(playCover(this.props.brick));
                  this.props.close();
                }}>
                  Go to Cover
                  <SpriteIcon name="arrow-right-s" />
                </div>
              </div>
            </div>
          </div>
          <div className="table">
            <div className="player-header">
              <div className="user-title bold">
                <SpriteIcon
                  name={this.state.classesExpanded && this.state.playersExpanded ? "plus-minus" : "arrow-down"}
                  onClick={() => {
                    if (this.state.classesExpanded && this.state.playersExpanded) {
                      this.setState({ classesExpanded: false });
                    } else if (this.state.playersExpanded) {
                      this.setState({ classesExpanded: true });
                    } else {
                      this.setState({ playersExpanded: true });
                    }
                  }}
                />
                Player data
              </div>
            </div>
            {this.state.playersExpanded && <div>
              <div className="userRow header-relative">
                <div className="student-name">Player Name</div>
                <div>Score</div>
                <div className="type-column">
                  Account Type
                  <SpriteIcon name="arrow-down-s" />
                </div>
                <div>Version</div>
                <div className="email-column">Email Address</div>
                <Select
                  className="get-emails-btn"
                  value="Copy emails"
                  MenuProps={{ classes: { paper: 'select-time-list' } }}
                >
                  {this.state.emailCopyOptions.map((c, i) => <MenuItem value={c.value} key={i} onClick={() => {
                    if (c.value === CopyOptions.CopyAll) {
                      const uniqueEmails: any[] = this.getAttemptEmails(this.state.attempts);
                      const uniqueEmailsV2: any[] = this.getAssignmentEmails(this.state.assignments);
                      uniqueEmails.push(...uniqueEmailsV2);
                      const emailsString = uniqueEmails.join(' ');
                      navigator.clipboard.writeText(emailsString);
                    } else if (c.value === CopyOptions.CopyLearners) {
                      const uniqueEmails: any[] = this.getAttemptEmails(this.state.attempts);
                      const emailsString = uniqueEmails.join(' ');
                      navigator.clipboard.writeText(emailsString);
                    } else if (c.value === CopyOptions.CopyEducators) {
                      const uniqueEmails: any[] = this.getAssignmentEmails(this.state.assignments);
                      let emailsString = uniqueEmails.join(' ');
                      navigator.clipboard.writeText(emailsString);
                    }
                  }}>
                    {c.text}
                  </MenuItem>
                  )}
                </Select>
              </div>
              <div className={`scrollable-user-table ${(this.state.playersExpanded && this.state.classesExpanded === false) ? " expanded" : ""}`}>
                {this.renderAttempts()}
              </div>
            </div>}
          </div>
          <div className="table">
            <div className="player-header">
              <div className="user-title bold">
                <SpriteIcon
                  name={
                    this.state.classesExpanded && this.state.playersExpanded ? "plus-minus" : "arrow-down"
                  }
                  onClick={() => {
                    if (this.state.classesExpanded && this.state.playersExpanded) {
                      this.setState({ playersExpanded: false });
                    } else if (this.state.classesExpanded) {
                      this.setState({ playersExpanded: true });
                    } else {
                      this.setState({ classesExpanded: true });
                    }
                  }}
                />
                Classes data ({this.state.assignments.length})
              </div>
            </div>
            {this.state.classesExpanded && <div>
              <div className="userRow classes-column header-relative">
                <div className="student-name">Classes Name</div>
                <div className="assign">Assig.</div>
                <div className="students">Students</div>
                <div className="teacher">Teacher Name</div>
                <div className="version">Version</div>
                <div className="teacher-email">Edu. Email</div>
                <div className="get-emails-btn" onClick={() => {
                  const uniqueEmails: any[] = this.getAssignmentEmails(this.state.assignments);
                  const emailsString = uniqueEmails.join(' ');
                  navigator.clipboard.writeText(emailsString);
                }}>
                  Copy emails
                </div>
              </div>
              <div className={`scrollable-user-table ${(this.state.classesExpanded && this.state.playersExpanded === false) ? " expanded" : ""}`}>
                {this.renderAssignments()}
              </div>
            </div>}
          </div>
        </div>
      </Dialog>
    );
  }
}

export default BrickPlayedPopup;
