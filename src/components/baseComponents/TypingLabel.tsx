import React, { Component } from "react";

interface LabelState {
  label: string;
  isTyping: boolean;
  finalLabel: string;
}

interface LabelProps {
  className?: string;
  label: string;
  minTime?: number;
  maxTime?: number;
  onEnd?(): void;
}

class TypingLabel extends Component<LabelProps, LabelState> {
  constructor(props: LabelProps) {
    super(props);
    this.state = {
      label: '',
      isTyping: true,
      finalLabel: props.label
    };
  }

  randDelay (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  componentDidMount() {
    this.printLetter(0);
  }

  componentDidUpdate(prevProps: LabelProps, prevState: LabelState) {
    console.log(prevProps, prevState);
    if (this.props.label != prevProps.label) {
      if (this.state.isTyping === false) {
        this.setState({
          label: '',
          finalLabel: this.props.label,
          isTyping: true
        });

        this.printLetter(0);
      }
    }
  }

  printLetter(index: number) {
    const {minTime, maxTime} = this.props;
    setTimeout(() => {
      const {label } = this.props;

      try {
        if (label != this.state.finalLabel) {
          this.setState({
            label: '',
            finalLabel: label,
          });
          this.printLetter(0);
          return;
        }

        this.setState({ label: this.state.label + label[index] });
        if (index < label.length - 1) {
          this.printLetter(index + 1);
        } else {
          if (this.props.onEnd) {
            this.setState({isTyping: false});
            this.props.onEnd();
          }
        }
      } catch {}
    }, this.randDelay(minTime ? minTime : 50, maxTime ? maxTime : 90));
  };

  
  render() {
    const {props} = this;
    return (<span className={props.className ? props.className : ""}>{this.state.label}</span>);
  }
};

export default TypingLabel;
