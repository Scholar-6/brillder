import React from 'react';
import { Dialog } from '@material-ui/core';

import './SoundRecordDialog.scss';
import SoundComponent from './Sound';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface SoundRecordDialog {
  isOpen: boolean;
  data: any;
  save(soundFile: string): void;
  close(): void;
}

const SoundRecordDialog: React.FC<SoundRecordDialog> = props => {
  let initValue = props.data.value ? props.data.value : '';
  const [value, setValue] = React.useState(initValue);

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box link-copied-dialog sound-dialog">
      <SoundComponent
        index={-1}
        locked={false}
        data={props.data}
        save={() => console.log('save')}
        updateComponent={c => setValue(c.value)}
      />
      <div className="upload-button-container">
        <div className={`upload-button ${value ? 'active' : 'disabled'}`} onClick={() => {
          props.save(value);
        }}>
          <SpriteIcon name="upload" />
        </div>
      </div>
    </Dialog>
  );
}

export default SoundRecordDialog;
