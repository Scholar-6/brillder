import React, { Component } from "react";

interface InputState {
  placeholder: string;
}

interface InputProps {
  value: string;
  type: string;
  required?: boolean;
  className: string;
  placeholder: string;
  onChange?(value: string): void;
  disabled?: boolean;
}

class TypingInput extends Component<InputProps, InputState> {
  constructor(props: InputProps) {
    super(props);
    this.state = {
      placeholder: ''
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
      const {placeholder} = this.props;
      try {
        this.setState({ placeholder: this.state.placeholder + placeholder[index] });
        if (index < placeholder.length - 1) {
          this.printLetter(index + 1);
        }
      } catch {}
    }, this.randDelay(50, 90));
  };

  render() {
    const {props} = this;
    return (
      <input
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange!(e.target.value)}
        className={props.className}
        placeholder={this.state.placeholder}
        required={props.required}
        disabled={props.disabled}
      />
    );
  }
};

export default TypingInput;
