import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { AudioStatus } from "../Sound";

interface SoundProps {
  blobUrl: string;
  status: AudioStatus;
  onClick(): void;
}

const RecordButton: React.FC<SoundProps> = (props) => {
  if (props.status === AudioStatus.Start && !props.blobUrl) {
    return (
      <button className="btn start-record svgOnHover" onClick={props.onClick}>
        <SpriteIcon name="circle-filled" className="active text-theme-orange" />
        <span>Record</span>
      </button>
    );
  }
  return <div></div>;
};

export default RecordButton;
