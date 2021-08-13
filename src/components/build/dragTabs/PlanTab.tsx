import React from 'react'
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import Grid from '@material-ui/core/Grid';
import routes from 'components/build/routes';
import { TutorialStep } from '../tutorial/TutorialPanelWorkArea';

export interface PlanTabProps {
  brickId: number;
  tutorialStep: TutorialStep;
  isValid: boolean;
  isActive: boolean;
  history: any;
}

const PlanTab: React.FC<PlanTabProps> = (props) => {
  const haveBorder = props.tutorialStep === TutorialStep.Proposal;
  return (
    <Grid
      className={"drag-tile " + (props.isValid ? "" : " invalid")}
      container alignContent="center" justify="center"
      onClick={() => props.history.push(routes.buildPlan(props.brickId))}
    >
      <div className={`${haveBorder ? 'editor-border' : ''}`}>
        {haveBorder && <SpriteIcon name="dashed-circle" className="circle-border" />}
        <SpriteIcon name="feather-map" className={`${haveBorder ? 'w60 h60' : 'w100 h100'} active ${(props.isActive || haveBorder) ? 'text-theme-dark-blue' : 'text-dark-gray'}`}/>
        <div className="css-custom-tooltip">Plan</div>
      </div>
    </Grid>
  );
}

export default PlanTab;
