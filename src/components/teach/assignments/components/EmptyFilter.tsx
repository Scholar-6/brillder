import LabelTyping from "components/baseComponents/LabelTyping";
import React, { Component } from "react";

interface PropsFilter {
  createClassToggle(): void;
}

interface EmptyState {
  firstStarted: boolean;
  secondStarted: boolean;
  thirdStarted: boolean;
  fourthStarted: boolean;

}

class EmptyFilter extends Component<PropsFilter, EmptyState> {
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
        <div className="top-row-v5">
          <div className="text bold font-20">CLASSES</div>
          <div className="btn btn-orange font-16" onClick={this.props.createClassToggle}>Create Class</div>
        </div>
        <div className="typed-textbox-v9">
          <LabelTyping
            value="Welcome to the Classes tab"
            className="bold title"
            start={this.state.firstStarted}
            onFinish={() => this.setState({ secondStarted: true })}
          />
          <LabelTyping
            value="This is where you will be able to"
            start={this.state.secondStarted}
            onFinish={() => this.setState({ thirdStarted: true })}
          />
          <LabelTyping
            value="manage your Classes by adding"
            start={this.state.thirdStarted}
            onFinish={() => this.setState({ fourthStarted: true })}
          />
          <LabelTyping
            value="students and assigning bricks."
            start={this.state.fourthStarted}
          />
        </div>
      </div>
    );
  }
}

export default EmptyFilter;
