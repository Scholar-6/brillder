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
  Legend,
} from 'chart.js';


import './AdminOverviewPage.scss';
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import OverviewPlayedSidebar, { PDateFilter } from "./OverviewSidebar";
import { getInstitutionOverviewData, getOverviewAssignedData, getOverviewCompetitionData, getOverviewData, getOverviewNewSignups, getOverviewPlayedData } from "services/axios/brick";
import map from "components/map";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { checkRealInstitution } from "components/services/brickService";


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
  publishedPrivate: number;
  played: number;
  competitionPlays: number;
  competitionData: any[];
  newClasses: number;
  assignedBricks: number;
  newSignups: number;
  individualSubscriptions: number;
  playedData: any[];
  newSignupsData: any[];
  assignedData: any[];
}

interface OverviewState {
  dateFilter: PDateFilter;
  isInitLoading: boolean;
  isLoading: boolean;
  isNewSingupsLoading: boolean;
  isPlayedBricksLoading: boolean;
  isCompetitionLoading: boolean;
  isAssignmentsLoading: boolean;
  data: OverviewData;
}

class AdminOverviewPage extends Component<Props, OverviewState> {
  constructor(props: Props) {
    super(props);

    let dateFilter = PDateFilter.Past24Hours;

    this.state = {
      dateFilter,
      isInitLoading: true,
      isLoading: true,
      isNewSingupsLoading: true,
      isPlayedBricksLoading: true,
      isCompetitionLoading: true,
      isAssignmentsLoading: true,

      data: {
        published: 0,
        publishedPrivate: 0,
        played: 0,
        competitionPlays: 0,
        newClasses: 0,
        assignedBricks: 0,
        newSignups: 0,
        individualSubscriptions: 0,
        playedData: [],
        newSignupsData: [],
        competitionData: [],
        assignedData: []
      }
    }

    this.loadData(this.state.dateFilter);
  }

  async loadData(dateFilter: PDateFilter) {
    if (!this.state.isLoading || this.state.isInitLoading) {
      this.setState({ isLoading: true, isNewSingupsLoading: true, isPlayedBricksLoading: true, isCompetitionLoading: true, isAssignmentsLoading: true });
      const isInstitution = checkRealInstitution(this.props.user.roles);

      let data:any = null;

      if (isInstitution) {
        data = await getInstitutionOverviewData(dateFilter);
      } else {
        data = await getOverviewData(dateFilter);
      }

      if (data) {
        data.newSignupsData = [];
        data.playedData = [];
        data.competitionData = [];
        data.assignedData = [];

        this.setState({ data, dateFilter, isLoading: false });

        const data2 = await getOverviewNewSignups(dateFilter);

        if (data2) {
          if (dateFilter === PDateFilter.Past24Hours) {
            let dateR = new Date();
            for (let i = 0; i < 24; i++) {
              const label = dateR.toLocaleString("en-US", { hour: "numeric", hour12: true });
              dateR.setHours(dateR.getHours() - 1);
              data2.newSignupsData[i].label = label;
            }
          }

          const dataN = { ...this.state.data };
          dataN.newSignupsData = data2.newSignupsData.reverse();
          this.setState({ data: dataN, isNewSingupsLoading: false });

          const data3 = await getOverviewPlayedData(dateFilter);
          if (data3) {
            if (dateFilter === PDateFilter.Past24Hours) {
              const dateR = new Date();
              for (let i = 0; i < 24; i++) {
                const label = dateR.toLocaleString("en-US", { hour: "numeric", hour12: true });
                dateR.setHours(dateR.getHours() - 1);
                data3.playedData[i].label = label;
              }
            }

            const dataP = { ...this.state.data };
            dataP.playedData = data3.playedData.reverse();
            this.setState({ data: dataP, isPlayedBricksLoading: false });

            const data4 = await getOverviewCompetitionData(dateFilter);
            if (data4) {
              if (dateFilter === PDateFilter.Past24Hours) {
                const dateR = new Date();
                for (let i = 0; i < 24; i++) {
                  const label = dateR.toLocaleString("en-US", { hour: "numeric", hour12: true });
                  dateR.setHours(dateR.getHours() - 1);
                  data4.competitionData[i].label = label;
                }
              }

              const dataC = { ...this.state.data };
              dataC.competitionData = data4.competitionData.reverse();
              this.setState({ data: dataC, isCompetitionLoading: false });

              const data5 = await getOverviewAssignedData(dateFilter);
              if (data5) {
                if (dateFilter === PDateFilter.Past24Hours) {
                  const dateR = new Date();
                  for (let i = 0; i < 24; i++) {
                    const label = dateR.toLocaleString("en-US", { hour: "numeric", hour12: true });
                    dateR.setHours(dateR.getHours() - 1);
                    data5.assignedData[i].label = label;
                  }
                }

                const dataA = { ...this.state.data };
                dataA.assignedData = data5.assignedData.reverse();
                this.setState({ data: dataA });
              }
            }
          }
        }
      }
      this.setState({ isInitLoading: false, isLoading: false, isNewSingupsLoading: false, isPlayedBricksLoading: false, isCompetitionLoading: false, isAssignmentsLoading: false });
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

  renderPublishedBox(number: number, number2: number, text: string, isUnderline?: boolean, onClick?: Function) {
    let className = "second-text-d103";
    if (isUnderline) {
      className += ' underline';
    }

    return (
      <div className="">
        <div>
          <div className="bold">
            {this.state.isLoading ? <SpriteIcon name="f-loader" className="spinning" /> : (number + number2)}
          </div>
          <div className={className} onClick={() => onClick?.()}>{text}</div>
        </div>
      </div>
    );
  }

  getData(datasetName: string, dataName: string) {
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

  renderBar(options: any, data: any) {
    console.log(options, data);
    return <Bar options={options} data={data} />
  }

  render() {
    const { history } = this.props;

    const data = this.getData('New Signups', 'newSignupsData');
    const data2 = this.getData('Played Bricks', 'playedData');
    const data3 = this.getData('Competition Plays', 'competitionData');
    const data4 = this.getData('Assigned Bricks', 'assignedData');

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
                {this.renderPublishedBox(this.state.data.published, this.state.data.publishedPrivate, 'Published', true, () => {
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
                  {this.state.isNewSingupsLoading ? <SpriteIcon name="f-loader" className="spinning" /> : <Bar options={options} data={data} />}
                </div>
                <div className="schart-column">
                  {this.state.isPlayedBricksLoading ? <SpriteIcon name="f-loader" className="spinning" /> : <Bar options={options} data={data2} />}
                  {this.state.isNewSingupsLoading ? <SpriteIcon name="f-loader" className="spinning" /> : this.renderBar(options, data)}
                </div>
              </div>
              <div className="schart-row">
                <div className="schart-column">
                  {this.state.isCompetitionLoading ? <SpriteIcon name="f-loader" className="spinning" /> : <Bar options={options} data={data3} />}
                </div>
                <div className="schart-column">
                  {this.state.isAssignmentsLoading ? <SpriteIcon name="f-loader" className="spinning" /> : <Bar options={options} data={data4} />}
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
