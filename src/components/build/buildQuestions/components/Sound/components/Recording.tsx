import React from "react";
import { AudioStatus } from "../Sound";
// @ts-ignore
import ReactRecord from "react-record";


interface SoundProps {
  status: AudioStatus;
  onStop(blob: any): void;
  onSave(blob: any): void;
}

// only one record component can be present in page
const Recording: React.FC<SoundProps> = (props) => {
  let record = document.getElementById("audio-record");

  if (!record) {
    return (
      <div id="audio-record">
        <ReactRecord
          record={props.status === AudioStatus.Recording}
          onStop={props.onStop}
          onSave={props.onSave}
        />
      </div>
    );
  }
  return <div></div>;
};

export default Recording;
