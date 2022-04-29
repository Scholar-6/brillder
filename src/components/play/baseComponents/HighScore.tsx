import React, { useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import BrillIcon from 'components/baseComponents/BrillIcon';


interface HighScoreProps {
  bestScore: number;
  sidebarRolledUp: boolean;
}

const HighScore: React.FC<HighScoreProps> = (props) => {
  const [brills, setBrills] = React.useState(0);

  const getStep = (low: number, high: number) => {
    let step = Math.round((high - low) / 15);
    if (step < 2) {
      step = 2;
    }
    return step;
  }

  const animateBrills = (low: number, high: number) => {
    const step = getStep(low, high);

    const interval = setInterval(() => {
      if (low < high - step) {
        low += step;
        setBrills(low);
      } else {
        setBrills(high);
        clearInterval(interval);
      }
    }, 100);
  }

  useEffect(() => {
    if (brills != props.bestScore) {
      animateBrills(brills, props.bestScore);
    }
  }, [props.bestScore]);

  if (brills > 0) {
    if (props.sidebarRolledUp) {
      return (
        <div className="high-score-sm-d3s">
          <BrillIcon />
          <div>{brills}</div>
          <div className="custom-tooltip">
            Total Brills earned from this Brick
          </div>
        </div>
      );
    }

    return (
      <div className="high-score-d3s">
        <div className="label-container">
          <div>Total</div>
          <div>Brills</div>
        </div>
        <LinearProgress variant="determinate" value={brills > 100 ? 100 : brills} />
        <div className="score-label">
          {brills}
        </div>
      </div>
    );
  }
  return <div />;
}

export default HighScore;