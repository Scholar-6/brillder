import React from 'react';
import queryString from 'query-string';
import 'intro.js/introjs.css';
// @ts-ignore
import { Steps } from 'intro.js-react';

import './IntroJs.scss';
import { RolePreference, User } from 'model/user';

interface Props {
  suspended: boolean | undefined;
  user: User;
  location: any;
  history: any;
}

interface State {
  nextLabel: string;
  initialStep: number;
  stepsEnabled: boolean;
  steps: any[];
}

class ProfileIntroJs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const getUserPreferenceName = () => {
      if (props.user.rolePreference) {
        const { roleId } = props.user.rolePreference;
        if (roleId === RolePreference.Student) {
          return 'Student';
        } else if (roleId === RolePreference.Teacher) {
          return "Teacher";
        } else if (roleId === RolePreference.Builder) {
          return 'Builder';
        }
      }
      return '';
    }

    this.state = {
      nextLabel: 'Start Tutorial',
      initialStep: 0,
      stepsEnabled: false,
      steps: [
        {
          element: 'body',
          intro: `
           <p>Hi ${props.user.firstName},</p>
           <p>Welcome to your Profile Page!</p>
          `,
        },
        {
          element: '.profile-image-container',
          intro: 'Add a picture so that your interactions on the platform are more personal'
        },
        {
          element: '.profile-roles-container',
          intro: `
            <p>You have selected your preference to be a ${getUserPreferenceName()}.</p>
            <p></p>
            <p>You can change your preferences by clicking on the other two radio buttons.</p>
          `
        },
        {
          element: '.subject-autocomplete',
          intro: 'You can add subjects to your profile in this panel'
        },
        {
          element: '.bio-container',
          intro: 'Write an academic bio (in the third person) so that the Brillder community can know more about your intellectual background'
        },
        {
          element: '.save-button-container',
          intro: 'Click here to save changes',
        },
        {
          element: 'body',
          intro: "That's it for this page!"
        }
      ]
    }

    setTimeout(() => {
      const values = queryString.parse(props.location.search);
      let stepsEnabled = false;
      if (values.onboardingUser) {
        stepsEnabled = true;
      }
      this.setState({ stepsEnabled });
    }, 1000);
  }

  componentDidUpdate(props: Props) {
    if (this.props.suspended !== props.suspended) {
      if (this.props.suspended) {
        this.setState({stepsEnabled: false});
      }
    }
  }

  onExit() {
    this.setState({ stepsEnabled: false });
  };

  onChange(e: any, b: any) {
    if (e === 0) {
      this.setState({ initialStep: e, nextLabel: 'Start Tutorial' });
    } else {
      this.setState({ initialStep: e, nextLabel: 'Next' });
    }
  }

  render() {
    return (
      <div>
        <Steps
          enabled={this.state.stepsEnabled}
          steps={this.state.steps}
          initialStep={0}
          onChange={this.onChange.bind(this)}
          onExit={this.onExit.bind(this)}
          onComplete={() => this.props.history.push('')}
          options={{
            nextLabel: this.state.nextLabel,
            doneLabel: 'Explore Brillder'
          }}
        />
      </div>
    );
  }
}

export default ProfileIntroJs;