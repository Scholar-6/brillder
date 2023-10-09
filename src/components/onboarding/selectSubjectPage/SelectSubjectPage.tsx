import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';

import "swiper/swiper.scss";

import { ReduxCombinedState } from "redux/reducers";
import userActions from 'redux/actions/user';
import { updateUser } from "services/axios/user";
import { User } from "model/user";
import { SubjectItem } from "model/brick";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import { CHINESE_SUBJECT, GENERAL_SUBJECT } from "components/services/subject";

import SubjectsColumnV2 from "./SubjectsColumnV2";
import { isBuilderPreference, isInstitutionPreference, isStudentPreference, isTeacherPreference } from "components/services/preferenceService";
import { isPhone } from "services/phone";
import { hideZendesk } from "services/zendesk";
import LabelTyping from "components/baseComponents/LabelTyping";
import { checkIfSchool } from "localStorage/origin";


interface AllSubjectsProps {
  history: any;

  user: User;
  getUser(): Promise<void>;
}

interface AllSubjectsState {
  subjects: SubjectItem[];
  failedRequest: boolean;
}

const MobileTheme = React.lazy(() => import('./themes/SubjectMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/SubjectTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/SubjectDesktopTheme'));

class SelectSubjectPage extends Component<AllSubjectsProps, AllSubjectsState> {
  constructor(props: AllSubjectsProps) {
    super(props);

    this.state = {
      subjects: [],
      failedRequest: false,
    };

    this.loadSubjects();
  }

  componentDidMount() {
    if (isPhone()) {
      hideZendesk();
    }
  }

  async loadSubjects() {
    let subjects = await getSubjects() as SubjectItem[] | null;

    if (subjects) {
      subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
      subjects = subjects.map(s => {
        const checked = this.props.user.subjects.findIndex(s2 => s2.id === s.id) > -1;
        return { ...s, checked: checked };
      });
      subjects = subjects.filter(s => s.name !== CHINESE_SUBJECT);
      this.setState({ ...this.state, subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }

  async submit() {
    const { user } = this.props;

    const subjects = [];

    for (const subject of this.state.subjects) {
      if (subject.checked) {
        subjects.push(subject.id);
      }
    }

    if (subjects.length === 0) {
      const general = this.state.subjects.find(s => s.name === GENERAL_SUBJECT);
      if (general) {
        subjects.push(general.id);
      }
    }

    let userToSave = {
      id: user.id,
      roles: user.roles.map(r => r.roleId),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subjects
    } as any;

    const saved = await updateUser(userToSave);

    if (saved) {
      const {history} = this.props;
      const isSchool = checkIfSchool();
      
      if (isSchool) {
        window.location.href = 'https://brillder.com/brilliant-minds-prizes/';
        return;
      }

      await this.props.getUser();

      if (isStudentPreference(user)) {
        history.push(map.MainPage + '?newStudent=true');
      } else if (isTeacherPreference(user)) {
        history.push(map.MainPage + '?' + map.NewTeachQuery);
      } else {
        history.push(map.UserProfile + '?onboardingUser=true');
      }
    } else {
      //this.props.requestFailed("Can`t save user profile");
    }
  }

  onSubjectSelected(subjectId: number) {
    const { subjects } = this.state;
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      subject.checked = !subject.checked;
    }
    this.setState({ subjects });
  }

  onSelectAll() {
    const { subjects } = this.state;
    for (let s of subjects) {
      s.checked = true;
    }
    this.setState({ subjects });
  }

  onUnselectAll() {
    const { subjects } = this.state;
    for (let s of subjects) {
      s.checked = false;
    }
    this.setState({ subjects });
  }

  render() {
    const {user} = this.props;
    let titleVerb = 'build';
    if (isTeacherPreference(user)) {
      titleVerb = 'teach';
    } else if (isStudentPreference(user)) {
      titleVerb = 'play';
    }

    if (isPhone()) {
      return (
        <React.Suspense fallback={<></>}>
          <MobileTheme />
          <div className="select-subject-page">
            <div className="df-space-before-titles" />
            <h1>What kind of bricks</h1>
            <h1>will you {titleVerb}?</h1>
            <div className="df-space-after-titles" />
            <SubjectsColumnV2
              subjects={this.state.subjects}
              next={this.submit.bind(this)}
              onClick={this.onSubjectSelected.bind(this)}
              selectAll={this.onSelectAll.bind(this)}
              unselectAll={this.onUnselectAll.bind(this)}
            />
            <div className="df-button-box">
              <button className="btn theme-orange" onClick={this.submit.bind(this)}>Next</button>
            </div>
          </div>
        </React.Suspense>
      );
    }

    let title = 'Which subjects are you interested in?';
    if (isStudentPreference(user)) {
      title = 'Which subjects are you interested in?';
    } else if (isTeacherPreference(user)) {
      title = 'Which subjects will you teach?';

    } else if (isInstitutionPreference(user)) {
      title = 'Which subjects would you like to provide for?';
    } else if (isBuilderPreference(user)) {
      title = 'What kind of content will you create?';
    }

    return (
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <Grid container direction="row" className="select-subject-page">
          <h1>
            <LabelTyping start={true} value={title} onFinish={() => {}} />
          </h1>
          <SubjectsColumnV2
            subjects={this.state.subjects}
            next={this.submit.bind(this)}
            onClick={this.onSubjectSelected.bind(this)}
            selectAll={this.onSelectAll.bind(this)}
            unselectAll={this.onUnselectAll.bind(this)}
          />
        </Grid>
      </React.Suspense>
    );
  }
}


const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(mapState, mapDispatch)(SelectSubjectPage);
