import React, { Component } from 'react';
import moment from 'moment';
import { isPhone } from 'services/phone';


interface StopTimerBtnProps {
  timerStopped: any;
  setStopTimer(timer: any): void;
  endTime: any;
  setEndTime(timer: any): void;
  isSynthesisParser?: boolean;
}

class StopTimerBtn extends Component<StopTimerBtnProps> {
  render() {
    if (isPhone()) {
      return <div />;
    }

    const {timerStopped, endTime, setEndTime, setStopTimer} = this.props;

    return (
      <div>
        {timerStopped.stopped && <div className="stop-background" /> }
        <div className={`btn toggle-timer stop-time ${timerStopped.stopped ? ' fixed' : ''}`} onClick={() => {
          if (timerStopped.stopped === true) {
            if (timerStopped.time) {
              const diffMilliseconds = new Date().getTime() - timerStopped.time?.getTime();
              const date22 = new Date(endTime.toDate().getTime() + diffMilliseconds);
              const date33 = moment(date22);
              console.log(endTime.toDate(), date22);
              setEndTime(date33);
            }
            setStopTimer({
              stopped: false,
              time: null
            });
          } else {
            setStopTimer({
              stopped: true,
              time: new Date()
            });
          }
        }}>
          {this.props.timerStopped.stopped ? 'Continue' : 'Pause Timer'}
        </div>
      </div>
    );
  }
}

export default StopTimerBtn;
