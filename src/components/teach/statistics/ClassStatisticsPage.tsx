import React from 'react';
import { ReduxCombinedState } from 'redux/reducers';
import statsActions from 'redux/actions/stats';
import { connect } from 'react-redux';
import { ClassroomStats } from 'model/stats';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import StatisticsGraph from './StatisticsGraph';
import PageHeadWithMenu, { PageEnum } from 'components/baseComponents/pageHeader/PageHeadWithMenu';
import { User } from 'model/user';
import { Grid } from '@material-ui/core';

interface ClassStatisticsPageProps {
  match: any;
  history: any;
  stats: ClassroomStats;
  user: User;
  getStats(classroomId: number): void;
}

const ClassStatisticsPage: React.FC<ClassStatisticsPageProps> = props => {
  if(!props.stats) {
    props.getStats(props.match.params.classroomId);
    return <PageLoader content="Getting Stats..." />;
  }


  return (
    <div className="main-listing">
      <PageHeadWithMenu
        page={PageEnum.ClassStatistics}
        placeholder="Search by Name, Email or Subject"
        user={props.user}
        history={props.history}
        search={() => {}}
        searching={v => {}}
      />
      <Grid direction="row" className="sorted-row">
        <Grid item xs={3} className="sort-and-filter-container">

        </Grid>
        <Grid item xs={9} className="brick-row-container">
          <StatisticsGraph stats={props.stats} />
        </Grid>
      </Grid>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  stats: state.stats.stats,
  user: state.user.user
});

const mapDispatch = (dispatch: any) => ({
  getStats: (classroomId: number) => dispatch(statsActions.getClassStats(classroomId))
})

const connector = connect(mapState, mapDispatch);

export default connector(ClassStatisticsPage);