import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { AudioStatus } from "../Sound";

interface SoundProps {
  status: AudioStatus;
  onClick(): void;
}

const PauseButton: React.FC<SoundProps> = (props) => {
  if (props.status === AudioStatus.Play) {
    return (
      <button className="btn svgOnHover play-record" onClick={props.onClick}>
        <SpriteIcon name="pause-filled" className="active text-theme-orange" />
        <span>Pause</span>
      </button>
    );
  }
  return <div></div>;
};

export default PauseButton;
