import React from 'react';
import './WordsCount.scss';

interface CountProps {
  value: string;
}

interface CountState {
  count: number;
}

class CountSynthesis extends React.Component<CountProps, CountState> {
  constructor(props: CountProps) {
    super(props);

    this.state = {
      count: this.getCount(props.value)
    }
  }

  getCount(value: string) {
    if (!value) {
      return 0;
    }
    return value.split(" ").length;
  }

  componentDidUpdate(prevProps: CountProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({count: this.getCount(this.props.value)});
    }
  }

  render() {
    return (
      <div className="synthesis-words-count">
        <div>Count: {this.state.count}</div>
        <div>Reading estimate is 150 words/minute</div>
      </div>
    );
  }
}

export default CountSynthesis;