import React, { Component } from 'react';

import {Moment} from 'moment';
let moment = require('moment');


interface CounterProps {
  startTime?: Moment;
}

interface CounterState {
  hours: string;
  minutes: string;
  seconds: string;
}

class BrickCounter extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);
    this.state = {
      hours: "00",
      minutes: "00",
      seconds: "00"
    }

    setInterval(() => {
      if (!props.startTime) {
        return;
      }
      let end = moment();
      let dif = moment.duration(end.diff(props.startTime));
      let hours = this.formatTwoLastDigits(dif.hours());
      let minutes = this.formatTwoLastDigits(dif.minutes());
      let seconds = this.formatTwoLastDigits(dif.seconds());
      this.setState({hours, minutes, seconds});
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

  render() {
    return (
      <div className="counter">
        {this.state.hours}:{this.state.minutes}
        <span className="counter-seconds">{this.state.seconds}</span>
      </div>
    );
  }
}

export default BrickCounter;
