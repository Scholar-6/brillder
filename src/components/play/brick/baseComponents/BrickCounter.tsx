import React, { Component } from 'react';

import './BrickCounter.scss';
import {Moment} from 'moment';
let moment = require('moment');

interface CounterProps {
  isIntroPage?: boolean;
  startTime?: Moment;
}

interface CounterState {
  hours: string;
  minutes: string;
  seconds: string;
  isCounting: boolean;
}

class BrickCounter extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);
    this.state = {
      hours: "00",
      minutes: "00",
      seconds: "00",
      isCounting: false,
    }

    setInterval(() => {
      if (!this.props.startTime) {
        return;
      }
      let end = moment();
      let dif = moment.duration(end.diff(this.props.startTime));
      let hours = this.formatTwoLastDigits(dif.hours());
      let minutes = this.formatTwoLastDigits(dif.minutes());
      let seconds = this.formatTwoLastDigits(dif.seconds());
      this.setState({hours, minutes, seconds, isCounting: true});
    }, 1000);
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
    if (this.props.isIntroPage && this.state.isCounting) {
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
        {this.state.hours}:{this.state.minutes}
        <span className="counter-seconds">{this.state.seconds}</span>
      </div>
    );
  }
}

export default BrickCounter;
