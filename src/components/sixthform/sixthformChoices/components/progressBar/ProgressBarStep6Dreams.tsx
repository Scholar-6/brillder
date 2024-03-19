import React from 'react';
import './ProgressBarSixthform.scss';
import { LinearProgress } from '@material-ui/core';

interface Props {
  step: number;
  total: number;
  description: string;
}

const ProgressBarStep6Dreams: React.FC<Props> = (props) => {
  const { step, total } = props;
  const value = ((step + 1) / total) * 100
  return (
    <div className="progress-description-container-r3234 progress-watching-bar progress-entusiasm-bar">
      <LinearProgress className="progress-bar-long-r233" variant="determinate" value={value} />
      <div className="font-14 paging-3c1">{step + 1} / {total} items</div>
      <div className="flex-center bold font-24">One day I’d like to...</div>
      <div className="font-32 text-center bold title-6v2">{props.description}</div>
    </div>
  );
}


export default ProgressBarStep6Dreams;
