import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import './AdminOverviewPage.scss';
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import OverviewPlayedSidebar, { PDateFilter } from "./OverviewSidebar";
import { getOverviewData } from "services/axios/brick";
import map from "components/map";
import SpriteIcon from "components/baseComponents/SpriteIcon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  history: History;
  searchString: string;
  user: User;
}

export interface OverviewData {
  published: number;
  played: number;
  competitionPlays: number;
  competitionData: any[];
  newClasses: number;
  assignedBricks: number;
  newSignups: number;
  individualSubscriptions: number;
  playedData: any[];
  newSignupsData: any[];
}

interface OverviewState {
  dateFilter: PDateFilter;
  isLoading: boolean;
  data: OverviewData;
}

class AdminOverviewPage extends Component<Props, OverviewState> {
  constructor(props: Props) {
    super(props);

    let dateFilter = PDateFilter.Past24Hours;

    this.state = {
      dateFilter,
      isLoading: false,

      data: {
        published: 0,
        played: 0,
        competitionPlays: 0,
        newClasses: 0,
        assignedBricks: 0,
        newSignups: 0,
        individualSubscriptions: 0,
        playedData: [],
        newSignupsData: [],
        competitionData: []
      }
    }

    this.loadData(this.state.dateFilter);
  }

  async loadData(dateFilter: PDateFilter) {
    if (!this.state.isLoading) {
      this.setState({isLoading: true});
      const data = await getOverviewData(dateFilter);
      if (data) {
        data.newSignupsData = data.newSignupsData.reverse();
        data.playedData = data.playedData.reverse();
        data.competitionData = data.competitionData.reverse();
        this.setState({ data, dateFilter, isLoading: false });
      } else if (data === false) {
        this.setState({ isLoading: false });
      }
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
          <div className="bold">
            {this.state.isLoading ? <SpriteIcon name="f-loader" className="spinning" /> : number}
          </div>
          <div className={className} onClick={() => onClick?.()}>{text}</div>
        </div>
      </div>
    );
  }

  getData(datasetName: string, dataName: string) {
    console.log(this.state.data, dataName)
    const data = (this.state.data as any)[dataName];
    const labels = data.map((d: any) => d.label);

    return {
      labels,
      datasets: [
        {
          label: datasetName,
          data: data.map((d: any) => d.count),
          backgroundColor: '#193266',
        }]
    }
  }

  render() {
    const { history } = this.props;

    const data = this.getData('New Signups', 'newSignupsData');
    const data2 = this.getData('Played Bricks', 'playedData');
    const data3 = this.getData('Competition Plays', 'competitionData');

    console.log('data2', data2);

    let options = {
      responsive: true,
      plugins: {},
      scales: {
        y: {
          ticks: {
            color: '#001c58',
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#001c58',
          }
        }
      }
    } as any;

    if (this.state.dateFilter === PDateFilter.Past24Hours || this.state.dateFilter === PDateFilter.PastMonth || this.state.dateFilter === PDateFilter.AllTime) {
      options.scales = {
        y: {
          ticks: {
            color: '#001c58',
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#001c58',
            maxRotation: 90,
            minRotation: 90
          }
        }
      }
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
                {this.renderBox(this.state.data.individualSubscriptions, 'Individual Subscribers', false)}
              </div>
              <div className="schart-row">
                <div className="schart-column">
                  <Bar options={options} data={data} />
                </div>
                <div className="schart-column">
                  <Bar options={options} data={data2} />
                </div>
              </div>
              <div className="schart-row">
                <div className="schart-column">
                  <Bar options={options} data={data3} />
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
