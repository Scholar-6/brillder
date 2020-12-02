import React from 'react';
import { fileUrl } from 'components/services/uploadFile';
import { ChooseOneAnswer } from '../chooseOneBuild/types';
import { QuestionValueType } from '../types';
import SoundRecordDialog from './SoundRecordDialog';
import RemoveButton from '../components/RemoveButton';


interface SoundProps {
  locked: boolean;
  answer: ChooseOneAnswer;
  save(soundFile: string): void;
  clear(): void;
}
 
const SoundRecord: React.FC<SoundProps> = props => {
  const {answer} = props;
  let [isOpen, setOpen] = React.useState(false);

  const renderSoundComponent = () => {
    if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div>
          <div className="remove-button-container">
            <RemoveButton onClick={props.clear} />
          </div>
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
    </div>
  );
}

export default SoundRecord;
