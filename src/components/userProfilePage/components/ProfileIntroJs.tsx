import React from 'react';
import queryString from 'query-string';
import 'intro.js/introjs.css';
// @ts-ignore
import { Steps } from 'intro.js-react';

import { UserPreferenceType, User } from 'model/user';

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
  suspended: boolean;
  steps: any[];
}

class ProfileIntroJs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const getUserPreferenceTypeName = () => {
      if (props.user.userPreference) {
        const { preferenceId } = props.user.userPreference;
        if (preferenceId === UserPreferenceType.Student) {
          return 'Student';
        } else if (preferenceId === UserPreferenceType.Teacher) {
          return "Teacher";
        } else if (preferenceId === UserPreferenceType.Builder) {
          return 'Builder';
        }
      }
      return '';
    }

    this.state = {
      nextLabel: 'Start Tutorial',
      initialStep: 0,
      stepsEnabled: false,
      suspended: false,
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
            <p>You have selected your preference to be a ${getUserPreferenceTypeName()}.</p>
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
          element: '.profile-username',
          intro: "This is your username that others see, it's only useful if your name is very common like John, or Smith.' to the tutorial on the profile page."
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

  checkIntroJs() {
    const res = document.getElementsByClassName("introjs-overlay");
    const res2 = document.getElementsByClassName("introjs-helperLayer");
    const res3 = document.getElementsByClassName('introjs-tooltipReferenceLayer');
    if (
      res.length > 0 && res[0] &&
      res2.length > 0 && res2[0] &&
      res3.length > 0 && res3[0]
    ) {
      return [res[0] as HTMLDivElement, res2[0] as HTMLDivElement, res3[0] as HTMLDivElement]
    }
  }

  hideIntroJs() {
    const elems = this.checkIntroJs();
    if (elems) {
      for (const elem of elems) {
        elem.style.display = 'none';
      }
    }
  }
  
  showIntroJs() {
    const elems = this.checkIntroJs();
    if (elems) {
      for (const elem of elems) {
        elem.style.display = 'block';
      }
    }
  }

  componentDidUpdate(props: Props) {
    if (this.props.suspended !== props.suspended) {
      if (this.props.suspended) {
        if (!this.state.suspended) {
          this.setState({suspended: this.props.suspended});
        }
        this.hideIntroJs();
      } else {
        if (this.state.suspended) {
          this.setState({suspended: false});
        }
        this.showIntroJs();
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