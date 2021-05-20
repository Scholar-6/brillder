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
    const constant = 150;
    let minutes = Math.floor(count / constant);
    let seconds = count % constant;
    console.log(minutes, seconds);
    seconds =  Math.round((seconds / constant) * 6) * 10;
    let res = '';

    if (seconds === 60) {
      minutes += 1;
      seconds = 0;
    }

    if (minutes > 0) {
      if (minutes === 1) {
        res += `${minutes} min `;
      } else {
        res += `${minutes} mins `;
      }
    }

    res += `${seconds} secs`;
    return res;
  }

  getCount(value: string) {
    if (!value) {
      return 0;
    }

    //eslint-disable-next-line
    let res = value.replace(/\&nbsp;/g, '');
    res = res.replace("   ", "");
    res = res.replace("  ", " ");
    let count = res.split(" ").length;
    if (count > 1) {
      count -= 1;
    }
    return count;
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
        <div className="bold">Words</div>
        <div><span className="text-orange">Current</span> | Recommended</div>
        <div><span className="text-orange">{this.state.count}</span> | 1200-1600</div>
        <div className="bold">Reading Time</div>
        <div><span className="text-orange">Current</span> | Recommended</div>
        <div><span className="text-orange">{this.state.timeText}</span> | 8 mins</div>
      </div>
    );
  }
}

export default CountSynthesis;