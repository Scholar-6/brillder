
import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import TypingLabel from "components/baseComponents/TypingLabel";

interface State {
  finished: boolean;
}

class AllSubjectsSidebar extends Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      finished: false
    }
  }

  render() {
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        <div className="unauthorized-sidebar" >
          <div>
            <TypingLabel className="bold title f-1-9vw" label="Click to select a Subject" onEnd={() => this.setState({finished: true})} />
          </div>
          <div>
            { this.state.finished && <TypingLabel className="bold title f-1-9vw" label=" or View All bricks." onEnd={() => {}} /> }
          </div>
        </div>
      </Grid>
    );
  }
}

export default AllSubjectsSidebar;
