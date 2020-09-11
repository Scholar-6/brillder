import React from 'react';
import { ClassroomStats } from 'model/stats';

import { LinePath, Area } from '@vx/shape';
import { curveNatural as curveType } from '@vx/curve';
import { scaleLinear, scaleBand } from '@vx/scale';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { Grid } from '@vx/grid';

import './StatisticsGraph.scss';

interface StatisticsGraphProps {
  stats: ClassroomStats;
  graphWidth: number;
  graphHeight: number;
}

const StatisticsGraph: React.FC<StatisticsGraphProps> = props => {
  const assignments = props.stats.assignments
    .filter(assignment => assignment.stats != null)
    .sort((a, b) => a.id - b.id);

  const totalWidth = props.graphWidth;
  const totalHeight = props.graphHeight;
  
  const marginLeft = 50;
  const marginTop = 50;
  const marginRight = 50;
  const marginBottom = 50;

  const graphWidth = totalWidth - marginRight - marginLeft;
  const graphHeight = totalHeight - marginBottom - marginTop;

  const xScale = scaleBand<number>({
    range: [0, graphWidth],
    domain: assignments.map(a => a.id),
  });

  const yScale = scaleLinear<number>({
    rangeRound: [graphHeight, 0],
    domain: [0, 100]
  });

  const rangeColor = "#8ad6e8";
  const iqrColor = "#0681db";

  return (
  <div>
    <svg width={totalWidth} height={totalHeight} className="stats-graph">
      <g transform={`translate(${marginLeft},${marginTop})`}>
        <Area
          curve={curveType}
          data={assignments}
          fill={rangeColor}
          x={d => xScale(d.id)! + xScale.bandwidth() / 2}
          y0={d => yScale(d.stats.minScore)!}
          y1={d => yScale(d.stats.maxScore)!}
        />
        <Area
          curve={curveType}
          data={assignments}
          fill={iqrColor}
          x={d => xScale(d.id)! + xScale.bandwidth() / 2}
          y0={d => yScale(d.stats.quartiles.lower)!}
          y1={d => yScale(d.stats.quartiles.upper)!}
        />
        <LinePath
          curve={curveType}
          data={assignments}
          x={d => xScale(d.id)! + xScale.bandwidth() / 2}
          y={d => yScale(d.stats.avgScore)}
          stroke="black"
        />
        {assignments.map((d, i) =>
          d.attempts.map((e, j) => (
            <circle
              key={j}
              r={3}
              cx={xScale(d.id)! + xScale.bandwidth() / 2}
              cy={yScale(e.percentScore)}
              stroke="rgba(0,0,0,0.5)"
              fill="transparent"
            />
          ))
        )}
        <Grid
          xScale={xScale}
          xOffset={xScale.bandwidth() / 2}
          yScale={yScale}
          numTicksRows={5}
          stroke="#000000"
          strokeOpacity={0.1}
          width={graphWidth}
          height={graphHeight}
        />
        <AxisBottom
          axisClassName="stats-date-axis"
          axisLineClassName="line"
          tickClassName="tick"
          tickLabelProps={(d) => ({
            className: "tick-label",
            textAnchor: "start",
            angle: 45
          })}
          tickFormat={(v: number) => 
            assignments.find(d => d.id === v)?.brick.title}
          top={graphHeight}
          scale={xScale}
        />
        <AxisLeft
          scale={yScale}
          numTicks={5}
        />
      </g>
    </svg>
  </div>
  );
};

export default StatisticsGraph;