import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { AudioStatus } from "../Sound";

interface SoundProps {
  status: AudioStatus;
  onClick(): void;
}

const PlayButton: React.FC<SoundProps> = (props) => {
  if (props.status === AudioStatus.Recorded) {
    return (
      <button className="btn svgOnHover play-record" onClick={props.onClick}>
        <SpriteIcon name="play-filled" className="active text-theme-orange" />
        <span>Play</span>
      </button>
    );
  }
  return <div></div>;
};

export default PlayButton;
