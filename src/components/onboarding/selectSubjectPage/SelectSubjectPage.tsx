import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';

import "swiper/swiper.scss";

import { ReduxCombinedState } from "redux/reducers";
import userActions from 'redux/actions/user';
import { updateUser } from "services/axios/user";
import { RolePreference, User, UserType } from "model/user";
import { SubjectItem } from "model/brick";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import { GENERAL_SUBJECT } from "components/services/subject";

import SubjectsColumnV2 from "./SubjectsColumnV2";


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

  async loadSubjects() {
    let subjects = await getSubjects() as SubjectItem[] | null;

    if (subjects) {
      subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
      this.setState({ ...this.state, subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }

  async submit() {
    const { user } = this.props;

    let subjects = [];
    let general = this.state.subjects.find(s => s.name === GENERAL_SUBJECT);
    if (general) {
      subjects.push(general.id);
    }

    for (let subject of this.state.subjects) {
      if (subject.checked) {
        subjects.push(subject.id);
      }
    }

    let userToSave = {
      id: user.id,
      roles: user.roles.map(r => r.roleId),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subjects: subjects
    } as any;


    const saved = await updateUser(userToSave);

    if (saved) {
      await this.props.getUser();
      if (user.rolePreference && user.rolePreference.roleId === UserType.Student) {
      this.props.history.push('/home');
      } else {
        this.props.history.push(map.UserProfile + '?onboardingUser=true');
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

  render() {
    let titleVerb = 'build';
    if (this.props.user.rolePreference && this.props.user.rolePreference.roleId === RolePreference.Teacher) {
      titleVerb = 'teach';
    } else if(this.props.user.rolePreference && this.props.user.rolePreference.roleId === RolePreference.Student) {
      titleVerb = 'play';
    }
    return (
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <Grid container direction="row" className="select-subject-page">
          <h1>What kind of bricks will you {titleVerb}?</h1>
          <SubjectsColumnV2
            subjects={this.state.subjects}
            next={this.submit.bind(this)}
            onClick={this.onSubjectSelected.bind(this)}
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
