import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { AudioStatus } from "../../Sound";

interface SoundProps {
  status: AudioStatus;
  onClick(): void;
}

const RecordingButton: React.FC<SoundProps> = (props) => {
  if (props.status === AudioStatus.Recording) {
    return (
      <button className="btn stop-record svgOnHover" onClick={props.onClick}>
        <SpriteIcon name="feather-stop-circle" className="active text-white" />
        <span>Stop</span>
      </button>
    );
  }
  return <div></div>;
};

export default RecordingButton;
