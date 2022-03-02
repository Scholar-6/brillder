import React, { useEffect } from 'react';
import { GetVolume, SetVolume } from 'localStorage/play';
import SpriteIcon from './SpriteIcon';

interface VolumeProps { }

const VolumeButton: React.FC<VolumeProps> = () => {
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
    <div className="volume-container-dr flex-center" onClick={toggle}>
      <SpriteIcon name={volume === true ? "volume-x" : "volume-1"} />
    </div>
  );
}

export default VolumeButton;
