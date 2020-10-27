import React, { Component } from "react";

interface LabelTypingProps {
  start: boolean;
  value: string;
  className?: string;
  onFinish?(): void;
}

interface LabelTypingState {
  animatedText: string;
  animationStarted: boolean;
  interval: number | null;
}

class LabelTyping extends Component<LabelTypingProps, LabelTypingState> {
  constructor(props: any) {
    super(props);

    let interval = null;

    this.state = {
      interval,
      animatedText: "",
      animationStarted: false
    } as any;
  }

  componentDidUpdate() {
    if (this.props.start === true && this.state.animationStarted === false) {
      this.animateText(this.props.value.split(""));
    }
  }

  componentDidMount() {
    if (this.props.start === true) {
      this.animateText(this.props.value.split(""));
    }
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  animateText(text: string[]) {
    let count = 0;
    const maxCount = text.length - 1;

    const notificationsInterval = setInterval(() => {
      if (count >= maxCount) {
        clearInterval(notificationsInterval);
        const {onFinish} = this.props;
        if (onFinish) {
          onFinish();
        }
      }
      this.setState({ ...this.state, animatedText: this.state.animatedText + text[count] });
      count++;
    }, 40);
    this.setState({ interval: notificationsInterval, animationStarted: true });
    return;
  }

  render() {
    return (
      <div className={this.props.className}>{this.state.animatedText}</div>
    );
  }
}

export default LabelTyping;
