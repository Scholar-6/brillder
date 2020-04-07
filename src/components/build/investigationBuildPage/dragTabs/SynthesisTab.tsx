import React from 'react'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { Grid } from '@material-ui/core';


export interface SynthesisTabProps {
  columns: number
  synthesis: string
  isSynthesis: boolean
}

const SynthesisTab: React.FC<SynthesisTabProps> = ({columns, synthesis, isSynthesis}) => {
  return (
    <div className="last-tab">
      <Grid container justify="center" alignContent="center" style={{height: '100%'}}>
        <img alt="add-synthesis" src="/images/synthesis-icon.png" className="synthesis-tab-icon" />
      </Grid>
    </div>
  );
}

export default SynthesisTab
