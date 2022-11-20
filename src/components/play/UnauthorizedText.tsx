import React, { Component } from "react";
import LabelTyping from "components/baseComponents/LabelTyping";


interface UnauthorizedTextProps {}

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
  fourth1Started: boolean;
  fourth2Started: boolean;
  fifth1Started: boolean;
  fifth2Started: boolean;
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
      third4Started: false,
      fourth1Started: false,
      fourth2Started: false,
      fifth1Started: false,
      fifth2Started: false
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
          className="font-black first"
          start={this.state.firstStarted}
          onFinish={() => this.setState({second1Started: true})}
        />
        <LabelTyping
          className="text-left margin-top f-regular"
          start={this.state.second1Started}
          value="You are looking at a Brick - our"
          onFinish={() => this.setState({second2Started: true})}
        />
        <LabelTyping
          className="text-left f-regular"
          start={this.state.second2Started}
          value=" revolutionary interactive learning"
          onFinish={() => this.setState({second3Started: true})}
        />
        <LabelTyping
          className="text-left f-regular"
          start={this.state.second3Started}
          value="unit."
          onFinish={() => this.setState({third1Started: true})}
        />

        <LabelTyping
          className="text-left margin-top f-regular"
          start={this.state.third1Started}
          value="Do the prep, play the investigation,"
          onFinish={() => this.setState({third2Started: true})}
        />
        <LabelTyping
          className="text-left f-regular"
          start={this.state.third2Started}
          value="study the synthesis and then review"
          onFinish={() => this.setState({third3Started: true})}
        />
        <LabelTyping
          className="text-left f-regular"
          start={this.state.third3Started}
          value="to score maximum points."
          onFinish={() => this.setState({fourth1Started: true})}
        />

        <LabelTyping
          className="text-left margin-top f-regular"
          start={this.state.fourth1Started}
          value="Teachers - register on the pop up to"
          onFinish={() => this.setState({fourth2Started: true})}
        />
        <LabelTyping
          className="text-left f-regular"
          start={this.state.fourth2Started}
          value="set bricks."
          onFinish={() => this.setState({fifth1Started: true})}
        />

        <LabelTyping
          className="text-left margin-top f-regular"
          start={this.state.fifth1Started}
          value="Learners - register on the pop up to"
          onFinish={() => this.setState({fifth2Started: true})}
        />
        <LabelTyping
          className="text-left f-regular"
          start={this.state.fifth2Started}
          value="play bricks."
        />
      </div>
    );
  }
};

export default UnauthorizedText;
