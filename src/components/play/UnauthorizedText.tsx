import React, { Component } from "react";
import LabelTyping from "components/baseComponents/LabelTyping";


interface UnauthorizedTextProps {}

interface UnauthorizedTextState {
  firstStarted: boolean;
  secondStarted: boolean;
  thirdStarted: boolean;
}

class UnauthorizedText extends Component<UnauthorizedTextProps, UnauthorizedTextState> {
  constructor(props: UnauthorizedTextProps) {
    super(props);
    this.state = {
      firstStarted: false,
      secondStarted: false,
      thirdStarted: false
    }
  }

  componentDidMount() {
    this.setState({firstStarted: true});
  }

  render() {
    return (
      <div className="sidebar-button unauthorized">
        <LabelTyping
          value="Welcome to Brillder"
          className="m-t-10 font-black"
          start={this.state.firstStarted}
          onFinish={() => this.setState({secondStarted: true})}
        />
        <LabelTyping
          className="text-left"
          start={this.state.secondStarted}
          value="You are looking at a Brick - our revolutionary interactive learning unit."
          onFinish={() => this.setState({thirdStarted: true})}
        />
        <LabelTyping
          className="text-left"
          start={this.state.thirdStarted}
          value="Do the prep, play the investigation, study the synthesis and then review to score maximum points."
        />
      </div>
    );
  }
};

export default UnauthorizedText;
