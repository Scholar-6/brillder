import React, { useEffect } from 'react';
import { GetVolume, SetVolume } from 'localStorage/play';
import SpriteIcon from './SpriteIcon';

interface VolumeProps {
  customClassName?: string;
}

const VolumeButton: React.FC<VolumeProps> = (props) => {
  const [volume, setVolume] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  useEffect(() => {
    const initVolume = GetVolume();
    setVolume(Boolean(initVolume));
  }, []);
  
  const toggle = () => {
    const newVolume = !volume;
    SetVolume(newVolume);
    setVolume(newVolume);
  }

  const renderIconName = () => {
    if (volume === true) {
      if (hovered === true) {
        return "volume-2";
      }
      return "volume-x";
    }
    if (hovered === true) {
      return "volume-x";
    }
    return "volume-2";
  }

  const prepareClassName = () => {
    if (volume === true) {
      if (hovered) {
        return 'active-2';
      }
      return 'muted';
    }
    if (hovered) {
      return 'muted';
    }
    return 'active-2';
  }

  return (
    <div className={`volume-container-dr flex-center ${prepareClassName()}  ${props.customClassName}`} onClick={toggle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <SpriteIcon name={renderIconName()} />
      <div className="css-custom-tooltip">
        {volume === true ? 'Enable sounds' : 'Mute sounds'}
      </div>
    </div>
  );
}

export default VolumeButton;
