import React from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import Select from '@material-ui/core/Select';
import './TimeDropdowns.scss';

interface Props {
  onChange(date: Date): void;
}

interface State {
  days: number[];
  months: number[];
  years: number[];

  year: number;
  month: number;
  day: number;
}

class TimeDropdowns extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    let start = 2021;
    let end = 2025;

    let years = [];
    for (let i = start; i <= end; i++) {
      years.push(i);
    }

    let months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }

    let days = this.getDays(3, start);

    this.state = {
      days,
      months,
      years,
      year: start,
      month: 1,
      day: 1
    }

    props.onChange(new Date(1, 1, start));
  }

  getDays(month: number, year: number) {
    let days = [];
    let last = new Date(year, month, 0).getDate();
    for (let i = 1; i <= last; i++) {
      days.push(i);
    }
    return days;
  }

  onChange(year: number, month: number, day: number) {
    this.props.onChange(new Date(year, month - 1, day));
  }

  setDay(newDay: number) {
    this.setState({day: newDay});
    this.onChange(this.state.year, this.state.month, newDay);
  }

  setMonth(newMonth: number) {
    const days = this.getDays(newMonth, this.state.year);
    this.setState({days, month: newMonth});
    this.onChange(this.state.year, newMonth, this.state.day);
  }

  setYear(newYear: number) {
    const days = this.getDays(this.state.month, newYear);
    this.setState({days, year: newYear});
    this.onChange(newYear, this.state.month, this.state.day);
  }

  renderSelect(value: number, choices: number[], setChoice: Function, className: string) {
    return (
      <Select
        className={"select-date " + className}
        value={value}
        MenuProps={{ classes: { paper: 'select-time-list' } }}
        onChange={e => setChoice(e.target.value)}
      >
        {choices.map((c, i) => <MenuItem value={c} key={i}>{c}</MenuItem>)}
      </Select>
    );
  }

  render() {
    return (
      <div className="inline">
        {this.renderSelect(this.state.day, this.state.days, (newDay: number) => this.setDay(newDay), 'first')}
        {this.renderSelect(this.state.month, this.state.months, (newMonth: number) => this.setMonth(newMonth), 'second')}
        {this.renderSelect(this.state.year, this.state.years, (newYear: number) => this.setYear(newYear), 'last')}
      </div>
    );
  }
}

export default TimeDropdowns;