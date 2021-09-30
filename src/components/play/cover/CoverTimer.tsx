import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { formatTwoLastDigits } from 'components/services/brickService';
import React from 'react';

interface Props {
  onFinish(): void;
}

const CoverTimer: React.FC<Props> = (props) => {
  const [seconds, setSeconds] = React.useState(0);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const timeSeconds = seconds % 60;
    return `${formatTwoLastDigits(minutes)}:${formatTwoLastDigits(timeSeconds)}`;
  }

  React.useEffect(() => {
    setInterval(() => setSeconds((prev) => prev + 1), 1000)
  }, []);

  return <div className="cover-timer"><SpriteIcon name="clock" /> {formatTime()}</div>
}

export default CoverTimer;
