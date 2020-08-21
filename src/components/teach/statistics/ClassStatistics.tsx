import React from 'react';
import { ReduxCombinedState } from 'redux/reducers';
import statsActions from 'redux/actions/stats';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ClassroomStats } from 'model/stats';
import PageLoader from 'components/baseComponents/loaders/pageLoader';

interface ClassStatisticsProps {
    match: any;
    stats: ClassroomStats;
    getStats(classroomId: number): void;
}

const ClassStatistics: React.FC<ClassStatisticsProps> = props => {
    if(!props.stats) {
        props.getStats(props.match.params.classroomId);
        return <PageLoader content="Getting Stats..." />;
    }

    return (
    <div></div>
    );
};

const mapState = (state: ReduxCombinedState) => ({
    stats: state.stats.stats
});

const mapDispatch = (dispatch: any) => ({
    getStats: (classroomId: number) => dispatch(statsActions.getClassStats(classroomId))
})

const connector = connect(mapState, mapDispatch);

export default connector(ClassStatistics);