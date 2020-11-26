import React from "react";
import { AudioStatus } from "../Sound";
// @ts-ignore
import ReactRecord from "react-record";


interface SoundProps {
  status: AudioStatus;
  isShown: boolean;
  onStop(blob: any): void;
  onSave(blob: any): void;
}

// only one record component can be present in page
const Recording: React.FC<SoundProps> = (props) => {
  const {status} = props;
  const record = document.getElementById("audio-record");

  if (!record && (status === AudioStatus.Recording || status === AudioStatus.BeforeRecorded)) {
    return (
      <div id="audio-record">
        <ReactRecord
          record={status === AudioStatus.Recording}
          onStop={props.onStop}
          onSave={props.onSave}
        />
      </div>
    );
  }
  return <div></div>;
};

export default Recording;
