import LabelTyping from "components/baseComponents/LabelTyping";
import React, { Component } from "react";

interface EmptyState {
  firstStarted: boolean;
  secondStarted: boolean;
  thirdStarted: boolean;
  fourthStarted: boolean;
}

class EmptyFilter extends Component<any, EmptyState> {
  constructor(props: any) {
    super(props);

    this.state = {
      firstStarted: true,
      secondStarted: false,
      thirdStarted: false,
      fourthStarted: false
    }
  }
  render() {
    return (
      <div className="empty-filter-content">
        <LabelTyping
          value="Welcome to the Assignments tab."
          className="bold"
          start={this.state.firstStarted}
          onFinish={() => this.setState({secondStarted: true})}
        />
        <LabelTyping
          value="This is where you will be able to"
          start={this.state.secondStarted}
          onFinish={() => this.setState({thirdStarted: true})}
        />
        <LabelTyping
          value="keep track of bricks you have"
          start={this.state.thirdStarted}
          onFinish={() => this.setState({fourthStarted: true})}
        />
        <LabelTyping
          value="assigned to classes or tutees."
          start={this.state.fourthStarted}
        />
      </div>
    );
  }
}

export default EmptyFilter;
