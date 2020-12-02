import React from 'react';
import { fileUrl } from 'components/services/uploadFile';
import { ChooseOneAnswer } from '../chooseOneBuild/types';
import { QuestionValueType } from '../types';
import SoundRecordDialog from './SoundRecordDialog';
import RemoveButton from '../components/RemoveButton';
import DeleteDialog from 'components/baseComponents/deleteBrickDialog/DeleteDialog';


interface SoundProps {
  locked: boolean;
  answer: ChooseOneAnswer;
  save(soundFile: string): void;
  clear(): void;
}
 
const SoundRecord: React.FC<SoundProps> = props => {
  const {answer} = props;
  let [isOpen, setOpen] = React.useState(false);
  let [isClearOpen, setClear] = React.useState(false);

  const renderSoundComponent = () => {
    if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div>
          <RemoveButton onClick={() => setClear(true)} />
          <audio
            controls
            style={{width: '100%'}}
            src={fileUrl(answer.soundFile ? answer.soundFile : '')} />
        </div>
      );
    }
    return (
      <div className="sound-record-button" onClick={() => {
        if (!props.locked) {
          setOpen(true);
        }
      }}>
        <img alt="sound-image" src="/images/soundicon-dark-blue.png" />
      </div>
    );
  }

  return (
    <div>
      {renderSoundComponent()}
      {isOpen &&
        <SoundRecordDialog
          isOpen={isOpen}
          save={v => {
            props.save(v);
            setOpen(false);
          }}
          data={props.answer}
          close={() => setOpen(false)}
        />
      }
      <DeleteDialog
        isOpen={isClearOpen}
        label="Delete sound?"
        submit={() => {
          props.clear();
          setClear(false);
        }}
        close={() => setClear(false)}
      />
    </div>
  );
}

export default SoundRecord;
