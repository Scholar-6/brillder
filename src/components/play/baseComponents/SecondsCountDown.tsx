import React from "react";

interface State {
  seconds: number;
  interval: number;
  isApearing: boolean;
}

interface Props {
  onEnd(): void;
}

class SecondsCountDown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      seconds: 3,
      interval: -1,
      isApearing: true,
    }
  }

  componentDidMount() {
    const interval = setInterval(() => {
      if (this.state.seconds === 0) {
        this.props.onEnd();
        clearInterval(this.state.interval);
        this.setState({seconds: -1});
      } else {
        this.setState({isApearing: false});
        setTimeout(() => this.setState({seconds: this.state.seconds - 1, isApearing: true}), 400);
      }
    }, 1500);
    this.setState({interval});
  }

  componentWillMount() {
    clearInterval(this.state.interval);
  }

  render() {
    return (
      <div className={`seconds-countdown-container ${this.state.isApearing ? 'fadein' : 'fadeout'}`}>
        {this.state.seconds === 0 ? 'GO!' : this.state.seconds}
      </div>
    );
  }
};

export default SecondsCountDown;
