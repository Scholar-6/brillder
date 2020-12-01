import React from 'react';
import { Dialog } from '@material-ui/core';
import SoundComponent from './Sound';

interface SoundRecordDialog {
  isOpen: boolean;
  data: any;
  save(soundFile: string): void;
  close(): void;
}

const SoundRecordDialog: React.FC<SoundRecordDialog> = props => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box link-copied-dialog">
      <SoundComponent
        index={-1}
        locked={false}
        data={props.data}
        save={() => console.log('save')}
        updateComponent={(c, i)=> props.save(c.value)}
      />
    </Dialog>
  );
}

export default SoundRecordDialog;
