import React, { Component } from "react";
import LabelTyping from "components/baseComponents/LabelTyping";


interface UnauthorizedTextProps { }

interface UnauthorizedTextState {
  firstStarted: boolean;
  second1Started: boolean;
  second2Started: boolean;
  second3Started: boolean;
  second4Started: boolean;
  third1Started: boolean;
  third2Started: boolean;
  third3Started: boolean;
  third4Started: boolean;
}

class UnauthorizedText extends Component<UnauthorizedTextProps, UnauthorizedTextState> {
  constructor(props: UnauthorizedTextProps) {
    super(props);
    this.state = {
      firstStarted: false,
      second1Started: false,
      second2Started: false,
      second3Started: false,
      second4Started: false,
      third1Started: false,
      third2Started: false,
      third3Started: false,
      third4Started: false
    }
  }

  componentDidMount() {
    this.setState({ firstStarted: true });
  }

  render() {
    return (
      <div className="sidebar-button unauthorized">
        <LabelTyping
          value="Welcome to Brillder"
          className="bolder first"
          start={this.state.firstStarted}
          onFinish={() => this.setState({ second1Started: true })}
        />
        <LabelTyping
          className="text-left margin-top"
          start={this.state.second1Started}
          value="You are looking at a Brick -"
          onFinish={() => this.setState({ second2Started: true })}
        />
        <LabelTyping
          className="text-left"
          start={this.state.second2Started}
          value="our revolutionary"
          onFinish={() => this.setState({ second3Started: true })}
        />
        <LabelTyping
          className="text-left"
          start={this.state.second3Started}
          value="interactive learning unit."
          onFinish={() => this.setState({ third1Started: true })}
        />
        <LabelTyping
          className="text-left margin-top"
          start={this.state.third1Started}
          value="Do the prep, play the"
          onFinish={() => this.setState({ third2Started: true })}
        />
        <LabelTyping
          className="text-left"
          start={this.state.third2Started}
          value="investigation, study the"
          onFinish={() => this.setState({ third3Started: true })}
        />
        <LabelTyping
          className="text-left"
          start={this.state.third3Started}
          value="synthesis and then review"
          onFinish={() => this.setState({ third4Started: true })}
        />
        <LabelTyping
          className="text-left"
          start={this.state.third4Started}
          value="to score maximum points."
        />
      </div>
    );
  }
};

export default UnauthorizedText;
