import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import './BricksPlayed.scss';
import { User } from "model/user";
import { Brick } from "model/brick";
import actions from 'redux/actions/requestFailed';
import { ReduxCombinedState } from "redux/reducers";
import BricksPlayedSidebar from "./BricksPlayedSidebar";
import BricksTab, { BricksActiveTab } from "./BricksTab";
import { adminGetBrickAtemptStatistic } from "services/axios/brick";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";


interface TeachProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  bricks: Brick[];
}

class BricksPlayedPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    this.state = {
      bricks: []
    }
    this.loadData();
  }

  async loadData() {
    const bricks = await adminGetBrickAtemptStatistic();
    if (bricks) {
      const sortedBricks = bricks.sort((a, b) => (a.attemptsCount > b.attemptsCount) ? -1 : 1);
      this.setState({ bricks: sortedBricks });
    }
  }

  render() {
    console.log(this.state.bricks)
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={history}
          search={() => { }}
          searching={() => { }}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <BricksPlayedSidebar isLoaded={true} filterChanged={() => { }} />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Bricks} history={this.props.history} />
            <div className="tab-content">
              <div className="table">
                <div className="table-head bold">
                  <div className="first-column">Brick</div>
                  <div className="second-column">Times Played</div>
                  <div className="third-column">Visibility</div>
                </div>
                <div className="table-body">
                  {this.state.bricks.map(b => {
                    return (<div className="table-row">
                      <div className="first-column" dangerouslySetInnerHTML={{__html: b.title}} />
                      <div className="second-column">{b.attemptsCount}</div>
                      <div className="third-column">{b.isCore ? 'dd' : 'ss'}</div>
                    </div>);
                  })}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(BricksPlayedPage);
