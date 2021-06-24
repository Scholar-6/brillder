import React, { Component } from "react";

interface LabelState {
  label: string;
}

interface LabelProps {
  className?: string;
  label: string;
  onEnd?(): void;
}

class TypingLabel extends Component<LabelProps, LabelState> {
  constructor(props: LabelProps) {
    super(props);
    this.state = {
      label: ''
    };
  }

  randDelay (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  componentDidMount() {
    this.printLetter(0);
  }

  printLetter (index: number) {
    setTimeout(() => {
      const {label} = this.props;
      try {
        this.setState({ label: this.state.label + label[index] });
        if (index < label.length - 1) {
          this.printLetter(index + 1);
        } else {
          if (this.props.onEnd) {
            this.props.onEnd();
          }
        }
      } catch {}
    }, this.randDelay(50, 90));
  };

  render() {
    const {props} = this;
    return (<span className={props.className ? props.className : ""}>{this.state.label}</span>);
  }
};

export default TypingLabel;
