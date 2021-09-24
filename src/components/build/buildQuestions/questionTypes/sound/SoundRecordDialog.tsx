import React from 'react';
import { Dialog } from '@material-ui/core';

import './SoundRecordDialog.scss';
import SoundComponent from './Sound';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import CopyrightCheckboxes from 'components/baseComponents/CopyrightCheckboxs';


interface SoundRecordDialog {
  isOpen: boolean;
  data: any;
  save(soundFile: string, caption: string, permition: boolean | 1, source: string): void;
  close(): void;
}

const SoundRecordDialog: React.FC<SoundRecordDialog> = props => {
  let initValue = props.data.soundFile ? props.data.soundFile : '';
  const [value, setValue] = React.useState(initValue);
  const [caption, setCaption] = React.useState('');
  const [source, setSource] = React.useState('');
  const [permision, setPermision] = React.useState(props.data.imagePermision ? true : false as boolean | 1);
  const [validationRequired, setValidation] = React.useState(false);

  let canUpload = false;
  if ((permision) && source) {
    canUpload = true;
  }

  const close = () => {
    setValue('');
    props.close();
  }

  return (
    <Dialog open={props.isOpen} onClose={close} className="dialog-box link-copied-dialog sound-dialog">
      <SoundComponent
        index={-1}
        locked={false}
        data={props.data}
        save={() => console.log('save')}
        updateComponent={c => setValue(c.value)}
      />
      {value && 
        <div>
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Enter caption here" />
          <div className="bold">
            Where did you get this sound?
            <span className="text-theme-orange">*</span>
          </div>
          <input
            value={source}
            className={validationRequired && !source ? "invalid" : ""}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Add link to source or name of owner"
          />
          <CopyrightCheckboxes
            isSound={true}
            validationRequired={validationRequired}
            permision={permision}
            setPermision={setPermision}
          />
        </div>
      }
      <div className="upload-button-container">
        <div className={`upload-button ${(canUpload) ? 'active' : 'disabled'}`} onClick={() => {
          if (canUpload) {
            props.save(value, caption, permision, source);
            setValue('');
          } else {
            setValidation(true);
          }
        }}>
          <div className="background" />
          <SpriteIcon name="upload" />
          <div className="css-custom-tooltip bold">Upload</div>
        </div>
      </div>
    </Dialog>
  );
}

export default SoundRecordDialog;
