import React from "react";

interface State {
  seconds: number;
  interval: number;
}

interface Props {
  onEnd(): void;
}

class SecondsCountDown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      seconds: 3,
      interval: -1
    }
  }

  componentDidMount() {
    const interval = setInterval(() => {
      console.log(55 , this.state.seconds);
      if (this.state.seconds === 1) {
        this.props.onEnd();
        clearInterval(this.state.interval);
        this.setState({seconds: -1});
      } else {
        this.setState({seconds: this.state.seconds - 1})
      }
    }, 1000);
    this.setState({interval});
  }

  componentWillMount() {
    clearInterval(this.state.interval);
  }

  render() {
    return (
      <div className="seconds-countdown-container">
        {this.state.seconds}
      </div>
    );
  }
};

export default SecondsCountDown;
