import React from 'react';
import queryString from 'query-string';
import 'intro.js/introjs.css';
// @ts-ignore
import { Steps } from 'intro.js-react';

interface Props {
  location: any;
}

interface State {
  stepsEnabled: boolean;
  steps: any[];
}

class ProfileIntroJs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const values = queryString.parse(props.location.search);
    let stepsEnabled = false;
    if (values.onboardingUser) {
      stepsEnabled = true;
    }

    this.state = {
      stepsEnabled,
      steps: [{
        element: '.save-button-container',
        intro: 'Click here to save changes',
      }]
    }
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