import React from 'react';
import 'intro.js/introjs.css';
// @ts-ignore
import { Steps } from 'intro.js-react';

interface Props {}

interface State {
  nextLabel: string;
  initialStep: number;
  stepsEnabled: boolean;
  steps: any[];
}

class SaveIntroJs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      nextLabel: 'Start Tutorial',
      initialStep: 0,
      stepsEnabled: true,
      steps: [{
        element: '.save-button-container',
        intro: 'Click here to save changes',
      }]
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
        />
      </div>
    );
  }
}

export default SaveIntroJs;