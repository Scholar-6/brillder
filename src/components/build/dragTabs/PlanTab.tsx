import React from 'react'
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import Grid from '@material-ui/core/Grid';
import routes from 'components/build/routes';

export interface PlanTabProps {
  brickId: number;
  history: any;
}

const PlanTab: React.FC<PlanTabProps> = (props) => {
  return (
    <Grid className="drag-tile" container alignContent="center" justify="center" onClick={() => {
      props.history.push(routes.buildPlan(props.brickId))
    }}>
      <div className="svgOnHover add-tab last-tab">
        <SpriteIcon name="feather-map" className="w100 h100 active text-theme-dark-blue"/>
      </div>
    </Grid>
  );
}

export default PlanTab;
