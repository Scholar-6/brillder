import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './AdminOverviewPage.scss';
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import OverviewPlayedSidebar, { PDateFilter } from "./OverviewSidebar";
import { getOverviewData } from "services/axios/brick";
import map from "components/map";


interface Props {
  history: History;
  searchString: string;
  user: User;
}

export interface OverviewData {
  published: number;
  played: number;
  competitionPlays: number;
  newClasses: number;
  assignedBricks: number;
  newSignups: number;
  individualSubscriptions: number;
  newSignupsData: any[];
}

interface OverviewState {
  dateFilter: PDateFilter;

  data: OverviewData;
}

class AdminOverviewPage extends Component<Props, OverviewState> {
  constructor(props: Props) {
    super(props);

    let dateFilter = PDateFilter.Past24Hours;

    this.state = {
      dateFilter,

      data: {
        published: 0,
        played: 0,
        competitionPlays: 0,
        newClasses: 0,
        assignedBricks: 0,
        newSignups: 0,
        individualSubscriptions: 0,
        newSignupsData: []
      }
    }

    this.loadData(this.state.dateFilter);
  }

  async loadData(dateFilter: PDateFilter) {
    const data = await getOverviewData(dateFilter);
    if (data) {
      this.setState({ data, dateFilter });
    }
  }

  renderBox(number: number, text: string, isUnderline?: boolean, onClick?: Function) {
    let className = "second-text-d103";
    if (isUnderline) {
      className += ' underline';
    }

    return (
      <div className="">
        <div>
          <div className="bold">{number}</div>
          <div className={className} onClick={() => onClick?.()}>{text}</div>
        </div>
      </div>
    );
  }

  render() {
    const { history } = this.props;

    let angle = 0;
    if (this.state.dateFilter === PDateFilter.Past24Hours) {
      angle = 40;
    } else if (this.state.dateFilter === PDateFilter.PastMonth) {
      angle = 40;
    }

    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page only-overview-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title or Author Name"
          user={this.props.user}
          history={history}
          search={() => { }}
          searching={() => { }}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <OverviewPlayedSidebar
            dateFilter={this.state.dateFilter}
            setDateFilter={this.loadData.bind(this)}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Overview} history={this.props.history} />
            <div className="tab-content">
              <div className="boxes-d103 margin-top-1">
                {this.renderBox(this.state.data.published, 'Published', true, () => {
                  history.push(map.AdminBricksPlayed + '?sortBy=' + 0 + '&dateFilter=' + this.state.dateFilter);
                })}
                {this.renderBox(this.state.data.played, 'Played', true, () => {
                  history.push(map.AdminBricksPlayed + '?sortBy=' + 4 + '&dateFilter=' + this.state.dateFilter);
                })}
                {this.renderBox(this.state.data.competitionPlays, 'Competition Plays', false)}
                {this.renderBox(this.state.data.newClasses, 'New Classes', true, () => {
                  history.push(map.ClassesEvents + '?dateFilter=' + this.state.dateFilter);
                })}
              </div>
              <div className="boxes-d103">
                {this.renderBox(this.state.data.assignedBricks, 'Assigned Bricks', false)}
                {this.renderBox(this.state.data.newSignups, 'New Signups', true, () => {
                  history.push(map.UsersEvents + '?dateFilter=' + this.state.dateFilter);
                })}
                {/*this.renderBox(12, 'Institutional Subscribers', false)*/}
                {this.renderBox(this.state.data.individualSubscriptions, 'Individual Subscribers', false)}
              </div>
              <div className="schart-row">
                <div className="schart-column">
                  <div className="bold">New Signups</div>
                  <ResponsiveContainer width="50%" aspect={1.2} className={(this.state.dateFilter === PDateFilter.Past24Hours || this.state.dateFilter === PDateFilter.PastMonth) ? 'font-small' : 'font-big'}>
                    <BarChart data={this.state.data.newSignupsData}
                    >
                      <Bar dataKey="count" fill="#193266" />
                      <CartesianGrid stroke="#E5E8ED" />
                      <XAxis
                        dataKey="label"
                        angle={angle}
                        height={angle === 0 ? undefined : 200}
                        interval={0}

                      />
                      <YAxis />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="schart-column">
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

export default connect(mapState)(AdminOverviewPage);
