import React, { Component } from 'react';

import './BrickCounter.scss';
import moment, {Moment} from 'moment';

interface CounterProps {
  isArrowUp?: boolean;
  startTime?: Moment;
  isStopped?: boolean;
  onStop?(duration: any): void;
}

interface CounterState {
  minutes: string;
  seconds: string;
  milliseconds: string;
  isCounting: boolean;
  timerInterval: number;
}

class BrickCounter extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);

    this.state = {
      seconds: "00",
      minutes: "00",
      milliseconds: "00",
      isCounting: false,
      timerInterval: this.setTimer()
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerInterval);
  }

  setTimer() {
    return setInterval(() => {
      if (!this.props.startTime) {
        return;
      }
      let end = moment();
      let dif = moment.duration(end.diff(this.props.startTime));
      let minutes = this.formatTwoLastDigits(dif.hours() * 60 + dif.minutes());
      let seconds = this.formatTwoLastDigits(dif.seconds());
      let milliseconds = this.formatTwoLastDigits(Math.round(dif.milliseconds() / 10));
      this.setState({minutes, seconds, milliseconds, isCounting: true});
    }, 500);
  }

  componentDidUpdate(prevProps: CounterProps) {
    if (prevProps.isStopped !== this.props.isStopped) {
      if (typeof this.props.isStopped === "boolean") {
        if (this.props.isStopped) {
          clearInterval(this.state.timerInterval);
          if (this.props.onStop) {
            let end = moment();
            let dif = moment.duration(end.diff(this.props.startTime));
            this.props.onStop(dif);
            this.setState({...this.state, isCounting: false });
          }
        } else {
          this.setState({...this.state, isCounting: true, timerInterval: this.setTimer() });
        }
      }
    }
  }

  formatTwoLastDigits(twoLastDigits: number) {
    var formatedTwoLastDigits = "";
    if (twoLastDigits < 10 ) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  renderArrow() {
    if (this.props.isArrowUp && this.state.isCounting) {
      return (
        <div className="intro-arrow">
          <img alt="" src="/feathericons/svg/arrow-up-blue.svg" />
        </div>
      );
    }
    return "";
  }

  render() {
    return (
      <div className="brick-counter">
        {this.renderArrow()}
        {this.state.minutes}:{this.state.seconds}
        {/* <span className="counter-seconds">{this.state.milliseconds}</span> */}
      </div>
    );
  }
}

export default BrickCounter;
