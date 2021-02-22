import React from 'react';

import { PlayMode } from '../model';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface FooterProps {
  history: any;

  mode: PlayMode;
  setMode(mode: PlayMode): void;
}

const PhonePlayFooter: React.FC<FooterProps> = (props) => {
  const setHighlightMode = () => {
    if (props.setMode) {
      if (props.mode === PlayMode.Highlighting) {
        props.setMode(PlayMode.Normal);
      } else {
        props.setMode(PlayMode.Highlighting);
      }
    }
  }

  return <div className="phone-play-footer">
    <SpriteIcon name="" />
    <SpriteIcon name="arrow-left-circle" onClick={() => {}} />
    <SpriteIcon name="file-text" onClick={() => {}} />
    <SpriteIcon name="highlighter" onClick={setHighlightMode} />
    <SpriteIcon name="" onClick={() => {}} />
    <SpriteIcon name="more" className="rotate-90" onClick={() => alert('good')} />
  </div>;
}

export default PhonePlayFooter;