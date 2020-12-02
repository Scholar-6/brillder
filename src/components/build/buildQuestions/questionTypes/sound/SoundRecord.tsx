import React from 'react';
import SoundRecordDialog from './SoundRecordDialog';


interface SoundProps {
  locked: boolean;
  data: any;
  save(soundFile: string): void;
}

const SoundRecord: React.FC<SoundProps> = props => {
  let [isOpen, setOpen] = React.useState(false);
  return (
    <div>
      <div className="sound-record-button" onClick={() => {
        if (!props.locked) {
          setOpen(true);
        }
      }}>
        <img alt="sound-image" src="/images/soundicon-dark-blue.png" />
      </div>
      {isOpen &&
        <SoundRecordDialog
          isOpen={isOpen}
          save={v => {
            props.save(v);
            setOpen(false);
          }}
          data={props.data}
          close={() => setOpen(false)}
        />
      }
    </div>
  );
}

export default SoundRecord;
