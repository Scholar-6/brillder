import React from 'react';
import './WordsCount.scss';

interface CountProps {
  value: string;
}

interface CountState {
  count: number;
  timeText: string;
}

class CountSynthesis extends React.Component<CountProps, CountState> {
  constructor(props: CountProps) {
    super(props);

    const count = this.getCount(props.value);
    const timeText = this.getTimeText(count);

    this.state = {
      count: this.getCount(props.value),
      timeText
    }
  }

  getTimeText(count: number) {
    console.log(count);
    let minutes = Math.floor(count / 150);
    let seconds = count % 150;
    seconds =  Math.round(seconds / 6) * 10;
    console.log(seconds);
    return `${minutes} mins ${seconds} secs`
  }

  getCount(value: string) {
    if (!value) {
      return 0;
    }
    return value.split(" ").length;
  }

  componentDidUpdate(prevProps: CountProps) {
    if (prevProps.value !== this.props.value) {
      const count = this.getCount(this.props.value);
      const timeText = this.getTimeText(count);
      this.setState({count, timeText});
    }
  }

  render() {
    return (
      <div className="synthesis-words-count">
        <div>Words: {this.state.count}</div>
        <div>Est. Reading Time: {this.state.timeText}</div>
      </div>
    );
  }
}

export default CountSynthesis;