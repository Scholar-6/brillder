import React, { Component } from "react";

interface EmptyState {
  firstStarted: boolean;
  secondStarted: boolean;
  thirdStarted: boolean;
  fourthStarted: boolean;
  fifthStarted: boolean;
}

class EmptyFilter extends Component<any, EmptyState> {
  constructor(props: any) {
    super(props);

    this.state = {
      firstStarted: true,
      secondStarted: false,
      thirdStarted: false,
      fourthStarted: false,
      fifthStarted: false,
    }
  }
  render() {
    return (
      <div className="empty-filter-content">
      </div>
    );
  }
}

export default EmptyFilter;
