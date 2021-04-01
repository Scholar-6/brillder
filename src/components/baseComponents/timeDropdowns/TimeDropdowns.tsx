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

  startDate: Date;

  year: number;
  month: number;
  day: number;
}

class TimeDropdowns extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    const startDate = new Date(2021, 3, 8);

    const start = startDate.getFullYear();
    const end = start + 4; 

    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();

    const years = [];
    for (let i = start; i <= end; i++) {
      years.push(i);
    }

    const months = this.getMonths(startMonth);

    let days = this.getDays(3, start, startDay);

    this.state = {
      days,
      months,
      years,
      startDate,
      year: start,
      month: months[0],
      day: days[0]
    }

    props.onChange(new Date(days.length + 1, months.length + 1, start));
  }

  getMonths(startMonth: number) {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      if (i > startMonth) {
        months.push(i);
      }
    }
    return months;
  }

  getDays(month: number, year: number, startDay: number) {
    let days = [];
    let last = new Date(year, month, 0).getDate();
    for (let i = 1; i <= last; i++) {
      if (i > startDay) {
        days.push(i);
      }
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
    let startDay = 0;
    if (this.state.year === this.state.years[0]) {
      startDay = this.state.startDate.getDate();
    }
    const days = this.getDays(newMonth, this.state.year, startDay);
    this.setState({days, month: newMonth});
    this.onChange(this.state.year, newMonth, this.state.day);
  }

  setYear(newYear: number) {
    let startDay = 0;
    if (newYear === this.state.years[0]) {
      startDay = this.state.startDate.getDate();
    }
    const days = this.getDays(this.state.month, newYear, startDay);
    let months = this.getMonths(0);
    if (newYear === this.state.years[0]) {
      months = this.getMonths(this.state.startDate.getMonth());
    }
    this.setState({days, year: newYear, months});
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