import React from 'react';

import { PlayMode } from '../model';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import map from 'components/map';
import { Brick } from 'model/brick';

interface FooterProps {
  brick: Brick;
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
    <SpriteIcon name="arrow-left-circle" onClick={() => props.history.push(map.ViewAllPage + `?subjectId=${props.brick.subject?.id}`)} />
    <SpriteIcon name="file-text" onClick={() => props.history.push(map.playIntro(props.brick.id))} />
    <SpriteIcon name="highlighter" onClick={setHighlightMode} />
    <SpriteIcon name="" onClick={() => {}} />
    <SpriteIcon name="more" className="rotate-90" onClick={() = {}} />
  </div>;
}

export default PhonePlayFooter;