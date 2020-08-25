import React from 'react';
import { ReduxCombinedState } from 'redux/reducers';
import statsActions from 'redux/actions/stats';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ClassroomStats } from 'model/stats';
import PageLoader from 'components/baseComponents/loaders/pageLoader';

import { BoxPlot } from '@vx/stats';
import { scaleLinear, scaleBand } from '@vx/scale';
import { AxisBottom } from '@vx/axis';

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
    const assignment = props.stats.assignments[0];

    const xScale = scaleBand<number>({
        range: [0, 600],
        domain: props.stats.assignments.map(assignment => assignment.assignmentId),
        paddingOuter: 0.4,
        paddingInner: 0.7
    });

    const yScale = scaleLinear<number>({
        rangeRound: [500, 0],
        domain: [0, assignment.attempts[0].maxScore]
    });

    const boxWidth = xScale.bandwidth();
    const constrainedWidth = Math.min(40, boxWidth);

    return (
    <div>
        <svg width="600" height="600">
            {props.stats.assignments.map(assignment => (
            <BoxPlot
                min={assignment.stats.minScore}
                max={assignment.stats.maxScore}
                left={xScale(assignment.assignmentId)! + constrainedWidth * 0.4}
                fill="#eeeeee"
                stroke="#000000"
                firstQuartile={assignment.stats.quartiles.lower}
                median={assignment.stats.quartiles.median}
                thirdQuartile={assignment.stats.quartiles.upper}
                boxWidth={constrainedWidth * 0.4}
                valueScale={yScale}
                />
            ))}
            <AxisBottom
                top={500}
                scale={xScale}
                />
        </svg>
    </div>
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