import React from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import Select from '@material-ui/core/Select';
import './TimeDropdowns.scss';

interface Props {
  date: Date;
  onChange(date: Date): void;
}

interface State {
  minutes: number[];
  hours: number[];
  days: number[];
  months: number[];
  years: number[];
}

class TimeHourDropdowns extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let start = new Date().getFullYear();
    let end = start + 5;

    let years = [];
    for (let i = start; i <= end; i++) {
      years.push(i);
    }

    let months = [];
    for (let i = 0; i <= 11; i++) {
      months.push(i);
    }

    let days = this.getDays(3, start);
    if (props.date) {
      days = this.getDays(props.date.getMonth(), props.date.getFullYear());
    }

    let minutes = [0, 15, 30, 45];

    let hours = [];
    for (let i = 1; i <= 24; i++) {
      hours.push(i);
    }

    this.state = {
      minutes,
      hours,
      days,
      months,
      years,
    }
  }

  getDays(month: number, year: number) {
    let days = [];
    let last = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < last; i++) {
      days.push(i);
    }
    return days;
  }

  onChange({ year, month, day, hour, minute }: { year?: number, month?: number, day?: number, hour?: number, minute?: number }) {
    const newDate = new Date(this.props.date);
    newDate.setMinutes(0);
    if(minute) newDate.setMinutes(minute);
    if(hour) newDate.setHours(hour);
    if(year) newDate.setFullYear(year);
    if(month || month === 0) newDate.setMonth(month);
    if(day) newDate.setDate(day);

    const compareDate = new Date();
    compareDate.setMinutes(0);

    if (newDate.getTime() > compareDate.getTime()) {
      this.props.onChange(newDate);
    }
  }

  setMinutes(newMinutes: number) {
    this.onChange({ minute: newMinutes });
  }

  setHour(newHour: number) {
    this.onChange({ hour: newHour });
  }

  setDay(newDay: number) {
    this.onChange({ day: newDay + 1 });
  }

  setMonth(newMonth: number) {
    const days = this.getDays(newMonth, this.props.date.getFullYear());
    this.setState({ days });
    this.onChange({ month: newMonth });
  }

  setYear(newYear: number) {
    const days = this.getDays(this.props.date.getMonth(), newYear);
    this.setState({ days });
    this.onChange({ year: newYear });
  }

  renderSelect(value: number, choices: number[], setChoice: Function, className: string, isMonth?: boolean) {
    return (
      <Select
        className={"select-date " + className}
        value={value}
        MenuProps={{ classes: { paper: 'select-time-list' } }}
        onChange={e => setChoice(e.target.value)}
      >
        {choices.map((c, i) => <MenuItem value={c} key={i}>{isMonth ? (c + 1) : c}</MenuItem>)}
      </Select>
    );
  }

  renderMinuteSelect(value: number, choices: number[], setChoice: Function) {
    return (
      <Select
        className="select-date minutes"
        value={value}
        MenuProps={{ classes: { paper: 'select-time-list' } }}
        onChange={e => setChoice(e.target.value)}
      >
        {choices.map((c, i) => {
          if (c === 0) {
            return <MenuItem value={c} key={i}>00</MenuItem>;
          }
          return <MenuItem value={c} key={i}>{c}</MenuItem>;
        })}
      </Select>
    );
  }

  render() {
    return (
      <div className="inline time-dropdown-time">
        {this.renderSelect(this.props.date.getHours(), this.state.hours, (newHours: number) => this.setHour(newHours), 'hours')} 
        {this.renderMinuteSelect(this.props.date.getMinutes(), this.state.minutes, (newMinutes: number) => this.setMinutes(newMinutes))} 
        on
        {this.renderSelect(this.props.date.getDate() - 1, this.state.days, (newDay: number) => this.setDay(newDay), 'first', true) /* Months are 0-indexed */}
        {this.renderSelect(this.props.date.getMonth(), this.state.months, (newMonth: number) => this.setMonth(newMonth), 'second', true) /* Months are 0-indexed */}
        {this.renderSelect(this.props.date.getFullYear(), this.state.years, (newYear: number) => this.setYear(newYear), 'last')}
      </div>
    );
  }
}

export default TimeHourDropdowns;