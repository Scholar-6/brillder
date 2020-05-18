import React from 'react'
import { Grid } from '@material-ui/core';


export interface SynthesisTabProps {
  columns: number
  synthesis: string
  isSynthesis: boolean
}

const SynthesisTab: React.FC<SynthesisTabProps> = ({columns, synthesis, isSynthesis}) => {
  let className = 'synthesis-tab-icon';
  if (columns > 23) {
    className+=' width-based';
  }
  return (
    <div className="last-tab">
      <Grid container justify="center" alignContent="center" style={{height: '100%'}}>
        <img alt="add-synthesis" src="/images/synthesis-icon.png" className={className} />
      </Grid>
    </div>
  );
}

export default SynthesisTab
