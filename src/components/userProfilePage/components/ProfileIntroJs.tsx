import React from 'react';
import queryString from 'query-string';
import 'intro.js/introjs.css';
// @ts-ignore
import { Steps } from 'intro.js-react';

import './IntroJs.scss';
import { RolePreference, User } from 'model/user';

interface Props {
  user: User;
  location: any;
}

interface State {
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
      stepsEnabled: false,
      steps: [
        {
          element: 'body',
          intro: `
           <p>Hi ${props.user.firstName},</p>
           <p>Welcome to your Profile Page!</p>
           <p>Start Tutorial</p>
          `,
        },
        {
          element: '.profile-image-container',
          intro: 'Add a picture so that your interactions on the platform are more personal'
        },
        {
          element: '.profile-roles-container',
          intro: `You have selected your preference to be a ${getUserPreferenceName()}. You change your preferences by clicking on the other two radio buttons.`
        },
        {
          element: '.subject-autocomplete-container',
          intro: 'You can add subjects to your profile in this panel'
        },
        {
          element: '.bio-container',
          intro: 'Add an academic bio in the third person so that the Brillder community can know more about your intellectual background'
        },
        {
          element: '.save-button-container',
          intro: 'Click here to save changes',
        },
        {
          element: 'html',
          intro: "That's it for this page! Explore Brillder"
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

  onExit = () => {
    this.setState({ stepsEnabled: false });
  };

  render() {
    return (
      <div>
        <Steps
          enabled={this.state.stepsEnabled}
          steps={this.state.steps}
          initialStep={0}
          onExit={() => { }}
        />
      </div>
    );
  }
}

export default ProfileIntroJs;