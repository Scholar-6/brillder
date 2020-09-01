import React from 'react';
import { ClassroomStats } from 'model/stats';

import { BoxPlot } from '@vx/stats';
import { scaleLinear, scaleUtc } from '@vx/scale';
import { AxisBottom } from '@vx/axis';
import moment from 'moment';

import './StatisticsGraph.scss';

interface StatisticsGraphProps {
  stats: ClassroomStats;
}

const StatisticsGraph: React.FC<StatisticsGraphProps> = props => {
  const assignments = props.stats.assignments
    .filter(assignment => assignment.stats != null)
    .map(assignment => ({
      ...assignment,
      assignedDate: moment(assignment.assignedDate).startOf("day").toDate()
    }));

  const xScale = scaleUtc<number>({
    range: [0, 600],
    domain: [new Date("2020-08-13"), Date.now()],
  });

  const yScale = scaleLinear<number>({
    rangeRound: [500, 0],
    domain: [0, assignments[0].attempts[0].maxScore]
  });

  const boxWidth = 35;

  const renderBox = (assignment: any) => {
    const assignmentsWithDate = assignments
      .filter(item => item.assignedDate.valueOf() === assignment.assignedDate.valueOf())
      .sort(item => item.id);

    console.log(assignmentsWithDate);

    const splitBoxWidth = boxWidth / assignmentsWithDate.length;
    const offset = assignmentsWithDate.indexOf(assignment) * splitBoxWidth;

    return (
      <BoxPlot
        className="stats-box-plot"
        min={assignment.stats.minScore}
        max={assignment.stats.maxScore}
        left={xScale(assignment.assignedDate)! - (boxWidth / 2) + offset}
        firstQuartile={assignment.stats.quartiles.lower}
        median={assignment.stats.quartiles.median}
        thirdQuartile={assignment.stats.quartiles.upper}
        boxWidth={splitBoxWidth}
        valueScale={yScale}
      />
    );
  }

  return (
    <div>
      <svg width="600" height="600" className="stats-graph">
        {assignments.map(assignment => renderBox(assignment))}
        <AxisBottom
          axisClassName="stats-date-axis"
          axisLineClassName="line"
          tickClassName="tick"
          tickLabelProps={() => ({ className: "tick-label" })}
          top={500}
          scale={xScale}
        />
      </svg>
    </div>
  );
};

export default StatisticsGraph;