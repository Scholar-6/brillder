
import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import TypingLabel from "components/baseComponents/TypingLabel";

interface State {
  finished: boolean;
  finished2: boolean;
}

class SubjectCategoriesSidebar extends Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      finished: false,
      finished2: false,
    }
  }

  render() {
    return (
      <Grid container item xs={2} className="sort-and-filter-container subject-category-sidebar">
        <div className="unauthorized-sidebar" >
          <div>
            <TypingLabel className="bold title f-1-9vw" label="Click to explore" onEnd={() => this.setState({finished: true})} />
          </div>
          <div>
            { this.state.finished && <TypingLabel className="bold title f-1-9vw" label="one of the following" onEnd={() => this.setState({finished2: true})} /> }
          </div>
          <div>
            { this.state.finished2 && <TypingLabel className="bold title f-1-9vw" label="subject categories." onEnd={() => {}} /> }
          </div>
        </div>
      </Grid>
    );
  }
}

export default SubjectCategoriesSidebar;
