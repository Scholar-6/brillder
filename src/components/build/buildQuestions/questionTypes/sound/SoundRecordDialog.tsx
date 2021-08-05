import React from 'react';
import { Dialog } from '@material-ui/core';

import './SoundRecordDialog.scss';
import SoundComponent from './Sound';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface SoundRecordDialog {
  isOpen: boolean;
  data: any;
  save(soundFile: string, caption: string): void;
  close(): void;
}

const SoundRecordDialog: React.FC<SoundRecordDialog> = props => {
  let initValue = props.data.soundFile ? props.data.soundFile : '';
  const [value, setValue] = React.useState(initValue);
  const [caption, setCaption] = React.useState('');

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box link-copied-dialog sound-dialog">
      <SoundComponent
        index={-1}
        locked={false}
        data={props.data}
        save={() => console.log('save')}
        updateComponent={c => setValue(c.value)}
      />
      {value && <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Enter caption here" />}
      <div className="upload-button-container">
        <div className={`upload-button ${value ? 'active' : 'disabled'}`} onClick={() => {
          props.save(value, caption);
        }}>
          <div className="background" />
          <SpriteIcon name="upload" />
          <div className="css-custom-tooltip">Upload</div>
        </div>
      </div>
    </Dialog>
  );
}

export default SoundRecordDialog;
