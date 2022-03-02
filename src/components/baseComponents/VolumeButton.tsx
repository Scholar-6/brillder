import React, { useEffect } from 'react';
import { GetVolume, SetVolume } from 'localStorage/play';
import SpriteIcon from './SpriteIcon';

interface VolumeProps {
  customClassName?: string;
}

const VolumeButton: React.FC<VolumeProps> = (props) => {
  const [volume, setVolume] = React.useState(false);

  useEffect(() => {
    const initVolume = GetVolume();
    setVolume(Boolean(initVolume));
  }, []);
  
  const toggle = () => {
    const newVolume = !volume;
    SetVolume(newVolume);
    setVolume(newVolume);
  }

  return (
    <div className={`volume-container-dr flex-center ${props.customClassName}`} onClick={toggle}>
      <SpriteIcon name={volume === true ? "volume-x" : "volume-1"} />
      <div className="css-custom-tooltip">
        {volume === true ? 'Enable sounds' : 'Mute sounds'}
      </div>
    </div>
  );
}

export default VolumeButton;
