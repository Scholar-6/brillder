import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";
import { connect } from "react-redux";
import axios from "axios";
// @ts-ignore
import marked from 'marked';

import './Terms.scss';
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";


interface BricksListProps {
  user: User;
  history: any;
  location: any;
}

interface BricksListState {
  markupText: string;
}

class TermsPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    this.state = {
      markupText: ''
    };

    axios.get('/terms.txt').then(r => {
      if (r.data) {
        this.setState({ markupText: r.data });
      }
    });
  }

  render() {
    return (
      <div className="main-listing dashboard-page terms-page">
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          placeholder={"Search Subjects, Topics, Titles & more"}
          history={this.props.history}
          search={() => {}}
          searching={(v) => {}}
        />
        <Grid container direction="row" className="sorted-row">
          <Grid container item xs={3} className="sort-and-filter-container">
            <div className="bold">Privacy Policy</div>
            <div>
              <FormControlLabel
                control={<Radio />}
                label="Сookie Policy" />
            </div>
            <div className="bold">Terms of Service</div>
            <div className="bold">Rules</div>
            <div>
              <FormControlLabel
                control={<Radio />}
                label="Acceptable Content" />
            </div>
            <div className="bold">H1</div>
            <div>
              <FormControlLabel
                control={<Radio />}
                label="H2" />
            </div>
          </Grid>
          <Grid item xs={9} className="brick-row-container">
            <div className="bricks-list-container bricks-container-mobile terms-and-conditions">
              <div dangerouslySetInnerHTML={{ __html: marked(this.state.markupText) }} />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});
  
export default connect(mapState)(TermsPage);
