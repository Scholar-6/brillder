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
  const {history} = props;
  const setHighlightMode = () => {
    if (props.setMode) {
      if (props.mode === PlayMode.Highlighting) {
        props.setMode(PlayMode.Normal);
      } else {
        props.setMode(PlayMode.Highlighting);
      }
    }
  }

  const isIntro = () => {
    return history.location.pathname.slice(-6) === '/intro';
  }

  return <div className="phone-play-footer">
    <SpriteIcon name="" />
    <SpriteIcon name="corner-up-left" onClick={() => history.push(map.ViewAllPage + `?subjectId=${props.brick.subject?.id}`)} />
    {isIntro() ? <SpriteIcon name="" /> : <SpriteIcon name="file-text" onClick={() => history.push(map.playIntro(props.brick.id))} /> }
    <SpriteIcon name="highlighter" onClick={setHighlightMode} />
    <SpriteIcon name="" onClick={() => {}} />
    <SpriteIcon name="more" className="rotate-90" onClick={() => {}} />
  </div>;
}

export default PhonePlayFooter;