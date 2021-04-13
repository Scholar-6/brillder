import React, { Component } from "react";


interface FilterProps {
  label: string;
  isClearFilter: any;
  setHeight(height: string): void;
  clear(): void;
}

interface FilterState {
  filterExpanded: boolean;
}

class CustomFilterBox extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
      filterExpanded: true
    }
  }

  hideFilter() {
    this.setState({ ...this.state, filterExpanded: false });
    this.props.setHeight("0");
  }

  expandFilter() {
    this.setState({
      ...this.state,
      filterExpanded: true,
    });
    this.props.setHeight("auto");
  }

  render() {    
    return (
      <div className="filter-header">
        <span>{this.props.label}</span>
        <button
          className={
            "btn-transparent filter-icon " +
            (this.state.filterExpanded
              ? this.props.isClearFilter
                ? "arrow-cancel"
                : "arrow-down"
              : "arrow-up")
          }
          onClick={() => {
            this.state.filterExpanded
              ? this.props.isClearFilter
                ? this.props.clear()
                : this.hideFilter()
              : this.expandFilter();
          }}
        ></button>
      </div>
    );
  }
}

export default CustomFilterBox;
