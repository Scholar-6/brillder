import LabelTyping from "components/baseComponents/LabelTyping";
import React, { Component } from "react";

interface EmptyState {
  firstStarted: boolean;
  secondStarted: boolean;
  thirdStarted: boolean;
  fourthStarted: boolean;
  fifthStarted: boolean;
}

class EmptyFilter extends Component<any, EmptyState> {
  constructor(props: any) {
    super(props);

    this.state = {
      firstStarted: true,
      secondStarted: false,
      thirdStarted: false,
      fourthStarted: false,
      fifthStarted: false,
    }
  }
  render() {
    return (
      <div className="empty-filter-content">
        <LabelTyping
          value="You will always have the option to"
          start={this.state.firstStarted}
          onFinish={() => this.setState({secondStarted: true})}
        />
        <LabelTyping
          value="create a class or invite an individual"
          start={this.state.secondStarted}
          onFinish={() => this.setState({thirdStarted: true})}
        />
        <LabelTyping
          value="tutee to any given brick."
          start={this.state.thirdStarted}
          className="space-line"
          onFinish={() => this.setState({fourthStarted: true})}
        />
        <LabelTyping
          value="For now, click on whichever you"
          start={this.state.fourthStarted}
          onFinish={() => this.setState({fifthStarted: true})}
        />
        <LabelTyping
          value="would like to do first."
          start={this.state.fifthStarted}
        />
      </div>
    );
  }
}

export default EmptyFilter;
