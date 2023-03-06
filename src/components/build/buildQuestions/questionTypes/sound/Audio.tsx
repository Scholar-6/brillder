import React from "react";
import WaveSurfer from "wavesurfer.js";

import './Audio.scss';
import { fileUrl } from "components/services/uploadFile";

interface SoundProps {
  src?: string;
}

const AudioComponent: React.FC<SoundProps> = ({ src }) => {
  const waveformRef = React.useRef() as any;

  React.useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
      });

      console.log(src);

      if (src) {
        waveformRef.load(fileUrl(src));
      }
    }
  }, []);

  return (
    <>
      <div ref={waveformRef}>
      </div>
    </>
  )
}

export default AudioComponent;
