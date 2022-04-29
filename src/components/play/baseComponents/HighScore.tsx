import React, { useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import BrillIcon from 'components/baseComponents/BrillIcon';


interface HighScoreProps {
  bestScore: number;
  sidebarRolledUp: boolean;
}

const HighScore: React.FC<HighScoreProps> = (props) => {
  const [brills, setBrills] = React.useState(0);

  useEffect(() => {
    
  }, []);

  const { bestScore } = props;
  if (bestScore > 0) {
    if (props.sidebarRolledUp) {
      return (
        <div className="high-score-sm-d3s">
          <BrillIcon />
          <div>{bestScore}</div>
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
        <LinearProgress variant="determinate" value={bestScore > 100 ? 100 : bestScore} />
        <div className="score-label">
          {bestScore}
        </div>
      </div>
    );
  }
  return <div />;
}

export default HighScore;